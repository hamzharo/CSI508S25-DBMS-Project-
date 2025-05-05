-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2025 at 04:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bank_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `account_type` enum('Savings','Checking') DEFAULT 'Checking',
  `balance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` enum('active','inactive','frozen') DEFAULT 'active',
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `user_id`, `account_number`, `account_type`, `balance`, `status`, `branch_id`, `created_at`, `updated_at`) VALUES
(1, 15, 'BA159876', 'Checking', 71594.25, 'active', NULL, '2025-04-14 11:58:07', '2025-05-05 14:25:42'),
(2, 16, 'BA161234', 'Checking', 112.75, 'active', NULL, '2025-04-14 12:02:17', '2025-05-01 20:52:05'),
(4, 17, 'BA1518999404', 'Checking', 64884.25, 'active', NULL, '2025-04-28 21:02:31', '2025-05-05 14:18:00'),
(5, 9, 'BA7792133757', 'Checking', 0.00, 'active', NULL, '2025-05-03 20:56:19', '2025-05-03 20:56:19'),
(7, 10, 'BA1714846412', 'Checking', 0.00, 'active', NULL, '2025-05-03 21:19:31', '2025-05-03 21:19:31'),
(17, 42, 'BA9038134161', 'Checking', 900.00, 'active', NULL, '2025-05-05 14:21:43', '2025-05-05 14:25:42'),
(18, 44, 'BA0837399144', 'Checking', 0.00, 'active', NULL, '2025-05-05 14:41:23', '2025-05-05 14:41:23');

-- --------------------------------------------------------

--
-- Table structure for table `approve`
--

CREATE TABLE `approve` (
  `admin_user_id` int(10) UNSIGNED NOT NULL,
  `customer_user_id` int(10) UNSIGNED NOT NULL,
  `approval_timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `approve`
--

INSERT INTO `approve` (`admin_user_id`, `customer_user_id`, `approval_timestamp`) VALUES
(14, 42, '2025-05-05 14:21:43'),
(14, 44, '2025-05-05 14:41:23');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` text DEFAULT NULL,
  `manager_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `location`, `manager_id`, `created_at`, `updated_at`) VALUES
(1, 'Downtown Branch', '123 Main St', 14, '2025-04-15 16:07:06', '2025-04-15 16:07:06'),
(2, 'Uptown Branch', '456 High Ave', NULL, '2025-04-15 16:08:08', '2025-04-15 16:08:08');

-- --------------------------------------------------------

--
-- Table structure for table `fraud_reports`
--

CREATE TABLE `fraud_reports` (
  `id` int(10) UNSIGNED NOT NULL,
  `reporting_customer_id` int(10) UNSIGNED NOT NULL,
  `description` text NOT NULL,
  `status` enum('reported','investigating','action_taken','resolved','dismissed') DEFAULT 'reported',
  `assigned_admin_id` int(10) UNSIGNED DEFAULT NULL,
  `reported_account_id` int(10) UNSIGNED DEFAULT NULL,
  `related_transaction_id` int(10) UNSIGNED DEFAULT NULL,
  `evidence_details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fraud_reports`
--

INSERT INTO `fraud_reports` (`id`, `reporting_customer_id`, `description`, `status`, `assigned_admin_id`, `reported_account_id`, `related_transaction_id`, `evidence_details`, `created_at`, `updated_at`, `resolved_at`) VALUES
(1, 15, 'Suspicious login attempt noticed.', 'dismissed', NULL, 1, NULL, 'Checked logs, no unauthorized access found.', '2025-04-15 16:53:37', '2025-04-15 16:57:17', '2025-04-15 12:57:17'),
(2, 15, 'My accoun being used .', 'reported', NULL, 1, NULL, NULL, '2025-04-15 16:54:12', '2025-04-15 16:54:12', NULL),
(3, 17, 'Suspicious Transaction Report', 'investigating', NULL, NULL, NULL, NULL, '2025-05-03 19:29:10', '2025-05-03 23:16:28', NULL),
(4, 17, '$ 15000 missing from my account ', 'action_taken', NULL, 1, 5, NULL, '2025-05-03 21:11:27', '2025-05-03 23:16:49', '2025-05-03 19:16:49'),
(5, 17, 'attempt access to my account ', 'dismissed', NULL, 1, NULL, NULL, '2025-05-04 00:17:08', '2025-05-04 00:21:22', '2025-05-03 20:21:22'),
(6, 17, 'Unusual emails receiving ', 'reported', NULL, 1, NULL, NULL, '2025-05-04 23:30:48', '2025-05-04 23:30:48', NULL),
(7, 17, 'Unusual emails receiving about my account 1', 'reported', NULL, 1, NULL, NULL, '2025-05-04 23:32:01', '2025-05-04 23:32:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `customer_user_id` int(10) UNSIGNED NOT NULL,
  `fraud_report_id` int(10) UNSIGNED NOT NULL,
  `link_timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report`
--

INSERT INTO `report` (`customer_user_id`, `fraud_report_id`, `link_timestamp`) VALUES
(17, 7, '2025-05-04 23:32:01');

-- --------------------------------------------------------

--
-- Table structure for table `submit`
--

CREATE TABLE `submit` (
  `customer_user_id` int(10) UNSIGNED NOT NULL,
  `support_ticket_id` int(10) UNSIGNED NOT NULL,
  `link_timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submit`
--

INSERT INTO `submit` (`customer_user_id`, `support_ticket_id`, `link_timestamp`) VALUES
(17, 7, '2025-05-04 23:13:11');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed','reopened') DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `assigned_admin_id` int(10) UNSIGNED DEFAULT NULL,
  `related_account_id` int(10) UNSIGNED DEFAULT NULL,
  `related_transaction_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `resolved_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `customer_id`, `subject`, `description`, `status`, `priority`, `assigned_admin_id`, `related_account_id`, `related_transaction_id`, `created_at`, `updated_at`, `resolved_at`, `closed_at`) VALUES
(1, 15, 'Login Issue', 'I cannot log in sometimes.', 'closed', 'high', 14, NULL, NULL, '2025-04-15 16:33:30', '2025-05-03 23:17:15', '2025-05-03 18:04:54', '2025-05-03 19:17:15'),
(3, 17, 'Logi in issue', 'I cannot login to my account, keep getting wrong username or password and I did not change ', 'open', 'medium', NULL, NULL, NULL, '2025-05-03 18:55:10', '2025-05-03 18:55:10', NULL, NULL),
(4, 17, 'Email change request ', 'need help to change  email ', 'open', 'medium', NULL, NULL, NULL, '2025-05-03 21:10:02', '2025-05-04 15:27:45', '2025-05-03 18:05:32', NULL),
(5, 17, 'Transaction Issue ', 'I can deposit money ', 'closed', 'medium', NULL, NULL, NULL, '2025-05-04 00:15:46', '2025-05-04 00:20:42', NULL, '2025-05-03 20:20:42'),
(6, 17, 'Access issue ', 'I cannot access to my account ', 'open', 'medium', NULL, NULL, NULL, '2025-05-04 23:07:48', '2025-05-04 23:07:48', NULL, NULL),
(7, 17, 'Wire Transfer ', 'I cannot send wire ', 'open', 'medium', NULL, NULL, NULL, '2025-05-04 23:13:11', '2025-05-04 23:13:11', NULL, NULL);

--
-- Triggers `support_tickets`
--
DELIMITER $$
CREATE TRIGGER `trg_after_support_ticket_insert` AFTER INSERT ON `support_tickets` FOR EACH ROW BEGIN
    INSERT INTO Submit (customer_user_id, support_ticket_id, link_timestamp)
    VALUES (NEW.customer_id, NEW.id, NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` enum('deposit','withdrawal','transfer','fee','interest') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','failed','cancelled','flagged') DEFAULT 'completed',
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `account_id` int(10) UNSIGNED NOT NULL,
  `sender_account_id` int(10) UNSIGNED DEFAULT NULL,
  `receiver_account_id` int(10) UNSIGNED DEFAULT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `type`, `amount`, `description`, `status`, `timestamp`, `account_id`, `sender_account_id`, `receiver_account_id`, `reference_number`, `created_at`, `updated_at`) VALUES
(1, 'transfer', 7.00, 'Transfer to account BA161234', 'completed', '2025-04-14 19:51:40', 1, 1, 2, NULL, '2025-04-14 19:51:40', '2025-04-14 19:51:40'),
(2, 'deposit', 100.50, 'Customer deposit', 'completed', '2025-04-15 14:12:03', 1, NULL, NULL, NULL, '2025-04-15 14:12:03', '2025-04-15 14:12:03'),
(3, 'withdrawal', 50.25, 'Customer withdrawal', 'completed', '2025-04-15 14:13:18', 1, NULL, NULL, NULL, '2025-04-15 14:13:18', '2025-04-15 14:13:18'),
(4, 'deposit', 200.50, 'Customer deposit', 'completed', '2025-05-01 20:47:46', 4, NULL, NULL, NULL, '2025-05-01 20:47:46', '2025-05-01 20:47:46'),
(5, 'deposit', 450.50, 'Customer deposit', 'completed', '2025-05-01 20:48:23', 4, NULL, NULL, NULL, '2025-05-01 20:48:23', '2025-05-01 20:48:23'),
(6, 'deposit', 25000.00, 'Customer deposit', 'completed', '2025-05-01 20:49:04', 4, NULL, NULL, NULL, '2025-05-01 20:49:04', '2025-05-01 20:49:04'),
(7, 'transfer', 55.75, 'Transfer to account BA161234', 'completed', '2025-05-01 20:52:05', 4, 4, 2, NULL, '2025-05-01 20:52:05', '2025-05-01 20:52:05'),
(8, 'transfer', 200.00, 'Transfer to account BA159876', 'completed', '2025-05-03 16:33:31', 4, 4, 1, NULL, '2025-05-03 16:33:31', '2025-05-03 16:33:31'),
(9, 'transfer', 5000.00, 'Transfer to account BA159876', 'completed', '2025-05-03 20:13:23', 4, 4, 1, NULL, '2025-05-03 20:13:23', '2025-05-03 20:13:23'),
(10, 'transfer', 1500.00, 'Transfer to account BA159876', 'completed', '2025-05-03 21:08:16', 4, 4, 1, NULL, '2025-05-03 21:08:16', '2025-05-03 21:08:16'),
(11, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-04 00:12:30', 4, 4, 1, NULL, '2025-05-04 00:12:30', '2025-05-04 00:12:30'),
(12, 'transfer', 1000.00, 'Transfer to account BA2675378261', 'completed', '2025-05-04 00:25:47', 4, 4, NULL, NULL, '2025-05-04 00:25:47', '2025-05-04 00:25:47'),
(13, 'deposit', 5000.00, 'Customer deposit', 'completed', '2025-05-04 13:25:55', 4, NULL, NULL, NULL, '2025-05-04 13:25:55', '2025-05-04 13:25:55'),
(14, 'deposit', 520.00, 'Customer deposit', 'completed', '2025-05-04 14:29:40', 4, NULL, NULL, NULL, '2025-05-04 14:29:40', '2025-05-04 14:29:40'),
(15, 'deposit', 100000.00, 'Customer deposit', 'completed', '2025-05-05 01:26:13', 4, NULL, NULL, NULL, '2025-05-05 01:26:13', '2025-05-05 01:26:13'),
(16, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 01:43:13', 4, 4, 1, NULL, '2025-05-05 01:43:13', '2025-05-05 01:43:13'),
(17, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 01:43:15', 4, 4, 1, NULL, '2025-05-05 01:43:15', '2025-05-05 01:43:15'),
(18, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 01:43:20', 4, 4, 1, NULL, '2025-05-05 01:43:20', '2025-05-05 01:43:20'),
(19, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 01:43:23', 4, 4, 1, NULL, '2025-05-05 01:43:23', '2025-05-05 01:43:23'),
(20, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 01:43:24', 4, 4, 1, NULL, '2025-05-05 01:43:24', '2025-05-05 01:43:24'),
(21, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 01:43:48', 4, 4, 1, NULL, '2025-05-05 01:43:48', '2025-05-05 01:43:48'),
(22, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 01:44:07', 4, 4, 1, NULL, '2025-05-05 01:44:07', '2025-05-05 01:44:07'),
(23, 'deposit', 10.00, 'Customer deposit', 'completed', '2025-05-05 01:44:23', 4, NULL, NULL, NULL, '2025-05-05 01:44:23', '2025-05-05 01:44:23'),
(24, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 02:27:51', 4, 4, 1, NULL, '2025-05-05 02:27:51', '2025-05-05 02:27:51'),
(25, 'transfer', 1000.00, 'Transfer to account BA159876', 'completed', '2025-05-05 02:28:21', 4, 4, 1, NULL, '2025-05-05 02:28:21', '2025-05-05 02:28:21'),
(26, 'transfer', 53400.00, 'Transfer to account BA159876', 'completed', '2025-05-05 02:28:55', 4, 4, 1, NULL, '2025-05-05 02:28:55', '2025-05-05 02:28:55'),
(27, 'transfer', 1.00, 'Transfer to account BA159876', 'completed', '2025-05-05 02:43:03', 4, 4, 1, NULL, '2025-05-05 02:43:03', '2025-05-05 02:43:03'),
(28, 'transfer', 150.00, 'Transfer to account BA159876', 'completed', '2025-05-05 02:43:19', 4, 4, 1, NULL, '2025-05-05 02:43:19', '2025-05-05 02:43:19'),
(29, 'deposit', 200.00, 'Customer deposit', 'completed', '2025-05-05 02:43:27', 4, NULL, NULL, NULL, '2025-05-05 02:43:27', '2025-05-05 02:43:27'),
(30, 'deposit', 5.00, 'Customer deposit', 'completed', '2025-05-05 03:11:43', 4, NULL, NULL, NULL, '2025-05-05 03:11:43', '2025-05-05 03:11:43'),
(31, 'transfer', 100.00, 'Transfer to account BA159876', 'completed', '2025-05-05 03:17:34', 4, 4, 1, NULL, '2025-05-05 03:17:34', '2025-05-05 03:17:34'),
(32, 'deposit', 5.00, 'Customer deposit', 'completed', '2025-05-05 03:17:42', 4, NULL, NULL, NULL, '2025-05-05 03:17:42', '2025-05-05 03:17:42'),
(33, 'transfer', 100.00, 'Transfer to account BA159876', 'completed', '2025-05-05 14:17:46', 4, 4, 1, NULL, '2025-05-05 14:17:46', '2025-05-05 14:17:46'),
(34, 'deposit', 5000.00, 'Customer deposit', 'completed', '2025-05-05 14:18:00', 4, NULL, NULL, NULL, '2025-05-05 14:18:00', '2025-05-05 14:18:00'),
(35, 'deposit', 1000.00, 'Customer deposit', 'completed', '2025-05-05 14:25:01', 17, NULL, NULL, NULL, '2025-05-05 14:25:01', '2025-05-05 14:25:01'),
(36, 'transfer', 100.00, 'Transfer to account BA159876', 'completed', '2025-05-05 14:25:42', 17, 17, 1, NULL, '2025-05-05 14:25:42', '2025-05-05 14:25:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `dob` date DEFAULT NULL,
  `citizenship` varchar(50) DEFAULT NULL,
  `ssn` varchar(20) DEFAULT NULL,
  `gender` enum('Male','Female','Other','Prefer not to say') DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `apt` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `zip` varchar(10) DEFAULT NULL,
  `local_address_same` tinyint(1) DEFAULT 0,
  `status` enum('pending_email_verification','pending_approval','active','inactive','blocked') DEFAULT 'pending_email_verification',
  `is_email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `email_token_expires` datetime DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `first_name`, `last_name`, `dob`, `citizenship`, `ssn`, `gender`, `phone`, `address`, `street`, `apt`, `city`, `country`, `zip`, `local_address_same`, `status`, `is_email_verified`, `email_verification_token`, `email_token_expires`, `password_reset_token`, `password_reset_expires`, `branch_id`, `created_at`, `updated_at`) VALUES
(9, 'hamzaharoun1196@gmail.com', '$2a$10$PtT7Occae7zi1qPEQ2KMNOtyqSYexh2QFxj6rasf.zIyy1c2RKVWa', 'customer', 'Verify', 'Test', '1995-05-05', 'TestLand', '000-12-222', 'Prefer not to say', '555-0001', '1 Verification Way', 'Verification Way', NULL, 'EmailTown', 'TestLand', '12345', 1, 'active', 1, '', NULL, NULL, NULL, NULL, '2025-04-12 18:53:50', '2025-05-03 20:56:19'),
(10, 'hamzaharoun196@gmail.com', '$2a$10$m3UNvXstfHy6Nvtn/jbbIe5kQYk/Ec8S9tuFjdzD3Ya18LXtddBky', 'customer', 'Verify', 'Test', '1995-05-05', 'TestLand', '000-12-222', 'Prefer not to say', '555-0001', '1 Verification Way', 'Verification Way', NULL, 'EmailTown', 'TestLand', '12345', 1, 'active', 1, NULL, NULL, NULL, NULL, NULL, '2025-04-12 19:08:54', '2025-05-03 21:19:31'),
(11, 'hamzaharoun1096@gmail.com', '$2a$10$nxX/ipxijhFWVWnPjWB5we4SxKRY9FpCwshbGGpagTbqkYpIIetMa', 'customer', 'Verify', 'Test', '1995-05-05', 'TestLand', '000-12-222', 'Prefer not to say', '555-0001', '1 Verification Way', 'Verification Way', NULL, 'EmailTown', 'TestLand', '12345', 1, 'pending_email_verification', 0, '196d0b0755b909fcd83774b82f65bdb24a7b069aabef78d8535a867463675102', '2025-04-12 16:11:35', NULL, NULL, NULL, '2025-04-12 19:11:35', '2025-04-12 19:11:35'),
(14, 'admin@example.com', '$2a$12$O8zxMbXnBRfAzgFJ7W9vj.LkzQxltwLYwD8On9NP63TDKkXzVAV.q', 'admin', 'adminFirstName', 'adminLastName', '1995-05-05', 'TestLand', '000-12-222', 'Male', '555-0001', '1 Verification Way', 'Verification Way', '4', 'Albany', 'Albany', '12345', 1, 'active', 1, NULL, NULL, NULL, NULL, NULL, '2025-04-12 19:36:27', '2025-04-12 19:57:28'),
(15, 'testing12@gmail.com', '$2a$10$2zGf27pc5/tFs6kZO5JWR.I3EDkODy6zveU1CdCtdzbcQbGMbdyse', 'customer', 'Verify', 'Test', '1995-05-05', 'TestLand', '000-12-222', 'Prefer not to say', '555-0001', '1 Verification Way', 'Verification Way', NULL, 'EmailTown', 'TestLand', '12345', 1, 'active', 1, NULL, NULL, NULL, NULL, 1, '2025-04-14 11:00:09', '2025-04-24 09:40:40'),
(16, 'testing13@gmail.com', '$2a$10$g4LxqrcsxmBsUkZWGF69buQpPP4pM4DA3UAL38KAO0NDiuaRgJWDa', 'customer', 'Verify', 'Test', '1995-05-05', 'TestLand', '000-12-222', 'Prefer not to say', '555-0001', '1 Verification Way', 'Verification Way', NULL, 'EmailTown', 'TestLand', '12345', 1, 'active', 1, NULL, NULL, NULL, NULL, NULL, '2025-04-14 12:00:11', '2025-04-14 12:01:25'),
(17, 'john.doe.test@example.com', '$2a$10$i.dI9czSVkC9xvfzuRthXOBvw.S2fBIt.xOIcfIcYfw4TNpunY7CO', 'customer', 'John', 'Doe', '1985-07-15', 'USA', '111-00-2222', 'Male', '555-123-4567', '100 Main Street, Apt 1', '11 Wilkins ave', 'apt 2', 'Colonie', 'United States', '12205', 1, 'active', 1, NULL, NULL, NULL, NULL, NULL, '2025-04-28 20:35:41', '2025-05-03 21:12:14'),
(42, 'hamzaharoun96@gmail.com', '$2a$10$fwtbW6Cv0hCW8g.Z5FXuK.tBksfewBDBcvCfvcgC.ZigtXMNwvjp2', 'customer', 'Haroun Moussa', 'Hamza', '2000-11-11', 'Chad ', '11111111', '', '5513126010', '706 Central Ave Apt 2', '8em arrd', '1111111', 'Albany', 'United States', '12206', 1, 'active', 1, NULL, NULL, NULL, NULL, NULL, '2025-05-05 14:20:19', '2025-05-05 14:21:43'),
(43, 'harounhamza0096@gmail.com', '$2a$10$03jtWIdgZ6Ra9I1WHOODOu5zMVsOkBfQ/A6FjLeJov5LVnYdBkoWq', 'customer', 'Haroun Moussa', 'Hamza', '2000-11-11', 'Chad ', '11111111', '', '5513126010', '706 Central Ave Apt 2', '8em arrd', '1111111', 'Albany', 'United States', '12206', 1, 'pending_email_verification', 0, '0e60a95157fe37c3f5f4e3bd287d528510996b98dd751b5b172212b1cfcb8cfc', '2025-05-05 11:38:30', NULL, NULL, NULL, '2025-05-05 14:38:30', '2025-05-05 14:38:30'),
(44, 'hhm762967@gmail.com', '$2a$10$SpdIxRB6jP3v5tz.aHJcV.TQg2DrsACZD6wdjavktOprATIJUFB8a', 'customer', 'Haroun Moussa', 'Hamza', '2000-11-11', 'Chad ', '11111111', '', '5513126010', '706 Central Ave Apt 2', '8em arrd', '1111111', 'Albany', 'United States', '12206', 1, 'active', 1, NULL, NULL, NULL, NULL, NULL, '2025-05-05 14:39:59', '2025-05-05 14:41:23');

-- --------------------------------------------------------

--
-- Table structure for table `work`
--

CREATE TABLE `work` (
  `admin_user_id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL,
  `assignment_timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `account_number` (`account_number`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_account_number` (`account_number`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indexes for table `approve`
--
ALTER TABLE `approve`
  ADD PRIMARY KEY (`admin_user_id`,`customer_user_id`),
  ADD KEY `fk_approve_customer_idx` (`customer_user_id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_manager` (`manager_id`);

--
-- Indexes for table `fraud_reports`
--
ALTER TABLE `fraud_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reporting_customer_id` (`reporting_customer_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_assigned_admin_id` (`assigned_admin_id`),
  ADD KEY `reported_account_id` (`reported_account_id`),
  ADD KEY `related_transaction_id` (`related_transaction_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`customer_user_id`,`fraud_report_id`),
  ADD KEY `fk_report_fraud_idx` (`fraud_report_id`);

--
-- Indexes for table `submit`
--
ALTER TABLE `submit`
  ADD PRIMARY KEY (`customer_user_id`,`support_ticket_id`),
  ADD KEY `fk_submit_ticket_idx` (`support_ticket_id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_id` (`customer_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_assigned_admin_id` (`assigned_admin_id`),
  ADD KEY `related_account_id` (`related_account_id`),
  ADD KEY `related_transaction_id` (`related_transaction_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_number` (`reference_number`),
  ADD KEY `idx_account_id` (`account_id`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `sender_account_id` (`sender_account_id`),
  ADD KEY `receiver_account_id` (`receiver_account_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `fk_user_branch` (`branch_id`);

--
-- Indexes for table `work`
--
ALTER TABLE `work`
  ADD PRIMARY KEY (`admin_user_id`,`branch_id`),
  ADD KEY `fk_work_branch_idx` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fraud_reports`
--
ALTER TABLE `fraud_reports`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `approve`
--
ALTER TABLE `approve`
  ADD CONSTRAINT `fk_approve_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_approve_customer` FOREIGN KEY (`customer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `fraud_reports`
--
ALTER TABLE `fraud_reports`
  ADD CONSTRAINT `fraud_reports_ibfk_1` FOREIGN KEY (`reporting_customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fraud_reports_ibfk_2` FOREIGN KEY (`assigned_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fraud_reports_ibfk_3` FOREIGN KEY (`reported_account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fraud_reports_ibfk_4` FOREIGN KEY (`related_transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `fk_report_customer` FOREIGN KEY (`customer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_report_fraud` FOREIGN KEY (`fraud_report_id`) REFERENCES `fraud_reports` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `submit`
--
ALTER TABLE `submit`
  ADD CONSTRAINT `fk_submit_customer` FOREIGN KEY (`customer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_submit_ticket` FOREIGN KEY (`support_ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `support_tickets_ibfk_2` FOREIGN KEY (`assigned_admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_ibfk_3` FOREIGN KEY (`related_account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `support_tickets_ibfk_4` FOREIGN KEY (`related_transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`sender_account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`receiver_account_id`) REFERENCES `accounts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `work`
--
ALTER TABLE `work`
  ADD CONSTRAINT `fk_work_admin` FOREIGN KEY (`admin_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_work_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
