// server/routes/supportTicketRoutes.js
import express from "express";
import {
    createSupportTicket,
    getMySupportTickets,
    getAllSupportTicketsAdmin,
    getSupportTicketByIdAdmin,
    updateSupportTicketAdmin,
    deleteSupportTicketAdmin 
} from "../controllers/supportTicketController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// --- Customer Routes ---
// All routes here will be automatically prefixed with /api/support (from server.js)

// Create a new ticket (requires customer login)
router.post(
    '/tickets',         // POST /api/support/tickets
    authMiddleware,
    createSupportTicket
);

// Get tickets belonging to the logged-in customer
router.get(
    '/tickets/my-tickets', // GET /api/support/tickets/my-tickets
    authMiddleware,
    getMySupportTickets
);


// --- Admin Routes ---
// All routes here will be automatically prefixed with /api/admin/support (from server.js)
// We define a separate router for admin routes for clarity, or mount them within adminRoutes.js

const adminRouter = express.Router();

// Get all tickets (requires admin login)
adminRouter.get(
    '/tickets',         // GET /api/admin/support/tickets
    authMiddleware,
    adminMiddleware,
    getAllSupportTicketsAdmin
);

// Get a specific ticket by ID (requires admin login)
adminRouter.get(
    '/tickets/:id',     // GET /api/admin/support/tickets/:id
    authMiddleware,
    adminMiddleware,
    getSupportTicketByIdAdmin
);

// Update a specific ticket (requires admin login)
adminRouter.put(
    '/tickets/:id',     // PUT /api/admin/support/tickets/:id
    authMiddleware,
    adminMiddleware,
    updateSupportTicketAdmin
);

// DELETE route
adminRouter.delete(
    '/tickets/:id',         // DELETE /api/admin/support/tickets/:id
    authMiddleware,
    adminMiddleware,
    deleteSupportTicketAdmin 
);

// Export both routers (or combine if preferred)
export { router as supportTicketCustomerRoutes, adminRouter as supportTicketAdminRoutes };