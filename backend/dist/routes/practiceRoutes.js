"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const practiceController_1 = require("../controllers/practiceController");
const questionProgressController_1 = require("../controllers/questionProgressController");
const questionLogController_1 = require("../controllers/questionLogController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.put('/:id', auth_1.protect, auth_1.adminOnly, practiceController_1.updatePracticeUnit);
router.delete('/:id', auth_1.protect, auth_1.adminOnly, practiceController_1.deletePracticeUnit);
// Question progress (aggregate unit stats)
router.get('/:practiceUnitId/progress', auth_1.protect, questionProgressController_1.getQuestionProgress);
router.put('/:practiceUnitId/progress', auth_1.protect, questionProgressController_1.upsertQuestionProgress);
// Granular Question Logs
router.get('/:practiceUnitId/question-logs', auth_1.protect, questionLogController_1.getQuestionLogs);
router.post('/:practiceUnitId/question-logs', auth_1.protect, questionLogController_1.createOrUpdateQuestionLog);
router.delete('/question-logs/:id', auth_1.protect, questionLogController_1.deleteQuestionLog);
exports.default = router;
//# sourceMappingURL=practiceRoutes.js.map