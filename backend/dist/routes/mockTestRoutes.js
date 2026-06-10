"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mockTestController_1 = require("../controllers/mockTestController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.get('/', mockTestController_1.getMockTests);
router.post('/', mockTestController_1.createMockTest);
router.get('/analytics', mockTestController_1.getMockTestAnalytics);
router.put('/:id', mockTestController_1.updateMockTest);
router.delete('/:id', mockTestController_1.deleteMockTest);
exports.default = router;
//# sourceMappingURL=mockTestRoutes.js.map