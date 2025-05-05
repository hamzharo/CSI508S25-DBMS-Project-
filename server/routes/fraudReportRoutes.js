// server/routes/fraudReportRoutes.js
import express from "express";
import {
    createFraudReport,
    getMyFraudReports,
    getAllFraudReportsAdmin,
    getFraudReportByIdAdmin,
    updateFraudReportAdmin
} from "../controllers/fraudReportController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// --- Customer Routes ---
// Base path: /api/fraud (from server.js)

router.post(
    '/reports',         // POST /api/fraud/reports
    authMiddleware,
    createFraudReport
);

router.get(
    '/reports/my-reports', // GET /api/fraud/reports/my-reports
    authMiddleware,
    getMyFraudReports
);

// --- Admin Routes ---
// Base path: /api/admin/fraud (from server.js)
const adminRouter = express.Router();

adminRouter.get(
    '/reports',         // GET /api/admin/fraud/reports
    authMiddleware,
    adminMiddleware,
    getAllFraudReportsAdmin
);

adminRouter.get(
    '/reports/:id',     // GET /api/admin/fraud/reports/:id
    authMiddleware,
    adminMiddleware,
    getFraudReportByIdAdmin
);

adminRouter.put(
    '/reports/:id',     // PUT /api/admin/fraud/reports/:id
    authMiddleware,
    adminMiddleware,
    updateFraudReportAdmin
);

export { router as fraudReportCustomerRoutes, adminRouter as fraudReportAdminRoutes };