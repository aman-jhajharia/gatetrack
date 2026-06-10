"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lectureController_1 = require("../controllers/lectureController");
const lectureProgressController_1 = require("../controllers/lectureProgressController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.put('/:id', auth_1.protect, auth_1.adminOnly, lectureController_1.updateLecture);
router.delete('/:id', auth_1.protect, auth_1.adminOnly, lectureController_1.deleteLecture);
// Progress
router.get('/:lectureId/progress', auth_1.protect, lectureProgressController_1.getLectureProgress);
router.put('/:lectureId/progress', auth_1.protect, lectureProgressController_1.upsertLectureProgress);
exports.default = router;
//# sourceMappingURL=lectureRoutes.js.map