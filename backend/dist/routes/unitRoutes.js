"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unitController_1 = require("../controllers/unitController");
const lectureController_1 = require("../controllers/lectureController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.put('/:id', auth_1.protect, auth_1.adminOnly, unitController_1.updateUnit);
router.delete('/:id', auth_1.protect, auth_1.adminOnly, unitController_1.deleteUnit);
// Lectures nested under unit
router.get('/:unitId/lectures', auth_1.protect, lectureController_1.getLectures);
router.post('/:unitId/lectures', auth_1.protect, auth_1.adminOnly, lectureController_1.createLecture);
exports.default = router;
//# sourceMappingURL=unitRoutes.js.map