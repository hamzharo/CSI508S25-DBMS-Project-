// server/controllers/transactionController.js
import pool from "../config/db.js"; // Import the pool

// =============================================
// Get Transactions (Existing & Working)
// =============================================
export const getTransactions = async (req, res) => { // Added async
  const userId = req.user.id; // Assumes authMiddleware adds req.user

  try {
    // Find accounts belonging to the user first
    const getAccountsSql = "SELECT id FROM accounts WHERE user_id = ?";
    const [accounts] = await pool.query(getAccountsSql, [userId]);

    if (accounts.length === 0) {
      // It's okay if a user has no accounts yet
      return res.json([]);
    }

    // Get IDs of the user's accounts
    const accountIds = accounts.map(acc => acc.id);

    // Query transactions where the user's account is involved
    // Using account_id, sender_account_id, or receiver_account_id
    const getTransactionsSql = `
            SELECT * FROM transactions
            WHERE account_id IN (?)
               OR sender_account_id IN (?)
               OR receiver_account_id IN (?)
            ORDER BY timestamp DESC
        `;
    // We need to pass the array of IDs three times for the IN clauses
    const [transactions] = await pool.query(getTransactionsSql, [accountIds, accountIds, accountIds]);

    res.json(transactions);

  } catch (err) {
    console.error(" Database error getting transactions:", err);
    res.status(500).json({ message: "Error fetching transaction history." });
  }
};

// =============================================
// Transfer Funds (Existing & Working)
// =============================================
export const transferFunds = async (req, res) => { // Added async
  // Get sender user ID from verified token
  const senderUserId = req.user.id;
  // Get receiver account number and amount from request body
  const { receiverAccountNumber, amount } = req.body;

  // Validate amount
  const transferAmount = parseFloat(amount);
  if (isNaN(transferAmount) || transferAmount <= 0) {
    return res.status(400).json({ message: "Invalid transfer amount." });
  }

  // Validate receiver account number presence
  if (!receiverAccountNumber) {
      return res.status(400).json({ message: "Receiver account number is required." });
  }

  let connection; // Declare connection outside try block

  try {
    // Get a connection from the pool for transaction
    connection = await pool.getConnection();
    await connection.beginTransaction(); // Start transaction

    // --- Find Sender's Primary Account and Balance ---
    // Simplified: Assuming first account found for user is the one to use
    const findSenderAccountSql = "SELECT id, balance, status FROM accounts WHERE user_id = ? LIMIT 1";
    const [senderAccounts] = await connection.query(findSenderAccountSql, [senderUserId]);

    if (senderAccounts.length === 0) {
      await connection.rollback(); // Rollback transaction
      connection.release();       // Release connection
      return res.status(404).json({ message: "Sender account not found." });
    }
    const senderAccount = senderAccounts[0];
    const senderAccountId = senderAccount.id;

    // Check sender account status
    if (senderAccount.status !== 'active') {
        await connection.rollback();
        connection.release();
        return res.status(403).json({ message: "Sender account is not active." });
    }

    // Check sufficient balance
    const senderBalance = parseFloat(senderAccount.balance);
    if (senderBalance < transferAmount) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // --- Find Receiver's Account by Account Number ---
    const findReceiverAccountSql = "SELECT id, status FROM accounts WHERE account_number = ?";
    const [receiverAccounts] = await connection.query(findReceiverAccountSql, [receiverAccountNumber]);

    if (receiverAccounts.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ message: "Receiver account number not found." });
    }
    const receiverAccount = receiverAccounts[0];
    const receiverAccountId = receiverAccount.id;

     // Check receiver account status
    if (receiverAccount.status !== 'active') {
        await connection.rollback();
        connection.release();
        return res.status(403).json({ message: "Receiver account is not active." });
    }

    // Prevent transferring to the same account
    if (senderAccountId === receiverAccountId) {
         await connection.rollback();
         connection.release();
         return res.status(400).json({ message: "Cannot transfer funds to the same account." });
    }

    // --- Perform Updates within Transaction ---
    // 1. Deduct from sender
    const deductSql = "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?"; // Add balance check for safety
    const [deductResult] = await connection.query(deductSql, [transferAmount, senderAccountId, transferAmount]);
    if (deductResult.affectedRows === 0) {
         await connection.rollback();
         connection.release();
         return res.status(400).json({ message: "Insufficient balance or sender account error." });
    }

    // 2. Add to receiver
    const addSql = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
    await connection.query(addSql, [transferAmount, receiverAccountId]);

    // 3. Log the transaction
    const logTransactionSql = `
            INSERT INTO transactions (type, amount, status, account_id, sender_account_id, receiver_account_id, description)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    const description = `Transfer to account ${receiverAccountNumber}`;
    await connection.query(logTransactionSql, [
      'transfer', transferAmount, 'completed', senderAccountId, // account_id = primary account involved (sender)
      senderAccountId, receiverAccountId, description
    ]);

    // --- Commit Transaction ---
    await connection.commit();
    console.log(`✅ Transfer successful: Account ${senderAccountId} -> Account ${receiverAccountId}, Amount: ${transferAmount}`);
    res.json({ message: "Transaction successful" });

  } catch (err) {
    console.error(" Transaction failed:", err);
    if (connection) {
      try { await connection.rollback(); console.log("Transaction rolled back."); }
      catch (rollbackError) { console.error(" Error rolling back transaction:", rollbackError); }
    }
    res.status(500).json({ message: "Transaction failed.", error: err.message });
  } finally {
    if (connection) { connection.release(); console.log("DB Connection Released after transfer attempt."); }
  }
};


// =============================================
//  NEW: Deposit Funds (Added)
// =============================================
export const deposit = async (req, res) => {
    const userId = req.user.id; // From authMiddleware
    const { accountNumber, amount } = req.body;

    // --- Basic Validation ---
    const depositAmount = parseFloat(amount);
    if (!accountNumber || !amount || isNaN(depositAmount) || depositAmount <= 0) {
        return res.status(400).json({ message: "Valid account number and positive amount are required." });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // --- Find Account & Verify Ownership/Status ---
        const findAccountSql = "SELECT id, user_id, status FROM accounts WHERE account_number = ?";
        const [accounts] = await connection.query(findAccountSql, [accountNumber]);

        if (accounts.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ message: "Account not found." });
        }
        const account = accounts[0];

        if (account.user_id !== userId) {
            await connection.rollback();
            connection.release();
            // 403 Forbidden as the account exists but doesn't belong to the user
            return res.status(403).json({ message: "Access denied. Account does not belong to user." });
        }
        if (account.status !== 'active') {
             await connection.rollback();
             connection.release();
             return res.status(400).json({ message: `Account status is '${account.status}'. Cannot deposit.` });
        }

        const accountId = account.id;

        // --- Perform Deposit Update ---
        const depositSql = "UPDATE accounts SET balance = balance + ? WHERE id = ?";
        await connection.query(depositSql, [depositAmount, accountId]);

        // --- Log the Deposit Transaction ---
        const logSql = `
            INSERT INTO transactions (type, amount, status, account_id, description)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.query(logSql, ['deposit', depositAmount, 'completed', accountId, 'Customer deposit']);

        // --- Commit Transaction ---
        await connection.commit();

        console.log(` Deposit successful: Account ${accountNumber}, Amount: ${depositAmount}`);
        // Optionally fetch and return the new balance
        const [updatedAccount] = await connection.query("SELECT balance FROM accounts WHERE id = ?", [accountId]);
        res.json({ message: "Deposit successful.", newBalance: updatedAccount[0]?.balance });

    } catch (err) {
        console.error(" Deposit failed:", err);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Deposit failed.", error: err.message });
    } finally {
        if (connection) connection.release();
    }
};


// =============================================
//  NEW: Withdraw Funds (Added)
// =============================================
export const withdrawal = async (req, res) => {
    const userId = req.user.id; // From authMiddleware
    const { accountNumber, amount } = req.body;

    // --- Basic Validation ---
    const withdrawalAmount = parseFloat(amount);
    if (!accountNumber || !amount || isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        return res.status(400).json({ message: "Valid account number and positive amount are required." });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // --- Find Account & Verify Ownership/Status/Balance ---
        const findAccountSql = "SELECT id, user_id, status, balance FROM accounts WHERE account_number = ?";
        const [accounts] = await connection.query(findAccountSql, [accountNumber]);

        if (accounts.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ message: "Account not found." });
        }
        const account = accounts[0];
        const accountId = account.id;
        const currentBalance = parseFloat(account.balance);

        if (account.user_id !== userId) {
            await connection.rollback();
            connection.release();
            return res.status(403).json({ message: "Access denied. Account does not belong to user." });
        }
        if (account.status !== 'active') {
             await connection.rollback();
             connection.release();
             return res.status(400).json({ message: `Account status is '${account.status}'. Cannot withdraw.` });
        }
        // Check sufficient funds
        if (currentBalance < withdrawalAmount) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: "Insufficient balance." });
        }

        // --- Perform Withdrawal Update ---
        // Include balance check in WHERE clause for extra safety against race conditions
        const withdrawSql = "UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?";
        const [withdrawResult] = await connection.query(withdrawSql, [withdrawalAmount, accountId, withdrawalAmount]);

        if (withdrawResult.affectedRows === 0) {
             // This could happen if balance check failed due to race condition
             await connection.rollback();
             connection.release();
             console.warn(`Withdrawal conflict for Account ${accountId}, Amount: ${withdrawalAmount}`);
             return res.status(409).json({ message: "Withdrawal conflict. Please try again." }); // 409 Conflict
        }


        // --- Log the Withdrawal Transaction ---
        const logSql = `
            INSERT INTO transactions (type, amount, status, account_id, description)
            VALUES (?, ?, ?, ?, ?)
        `;
        await connection.query(logSql, ['withdrawal', withdrawalAmount, 'completed', accountId, 'Customer withdrawal']);

        // --- Commit Transaction ---
        await connection.commit();

        console.log(` Withdrawal successful: Account ${accountNumber}, Amount: ${withdrawalAmount}`);
        // Optionally fetch and return the new balance
        const [updatedAccount] = await connection.query("SELECT balance FROM accounts WHERE id = ?", [accountId]);
        res.json({ message: "Withdrawal successful.", newBalance: updatedAccount[0]?.balance });

    } catch (err) {
        console.error(" Withdrawal failed:", err);
        if (connection) await connection.rollback();
        res.status(500).json({ message: "Withdrawal failed.", error: err.message });
    } finally {
        if (connection) connection.release();
    }
};