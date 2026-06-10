"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const lectureProgressController_1 = require("../controllers/lectureProgressController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/dashboard', auth_1.protect, analyticsController_1.getDashboard);
router.get('/lecture-summary', auth_1.protect, lectureProgressController_1.getProgressSummary);
router.get('/admin', auth_1.protect, auth_1.adminOnly, analyticsController_1.getAdminAnalytics);
exports.default = router;
//# sourceMappingURL=analyticsRoutes.js.map