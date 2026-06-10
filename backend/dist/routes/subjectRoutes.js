"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectController_1 = require("../controllers/subjectController");
const unitController_1 = require("../controllers/unitController");
const practiceController_1 = require("../controllers/practiceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Subjects
router.get('/', auth_1.protect, subjectController_1.getSubjects);
router.post('/', auth_1.protect, auth_1.adminOnly, subjectController_1.createSubject);
router.put('/:id', auth_1.protect, auth_1.adminOnly, subjectController_1.updateSubject);
router.delete('/:id', auth_1.protect, auth_1.adminOnly, subjectController_1.deleteSubject);
// Units nested under subject
router.get('/:subjectId/units', auth_1.protect, unitController_1.getUnits);
router.post('/:subjectId/units', auth_1.protect, auth_1.adminOnly, unitController_1.createUnit);
// Practice units nested under subject
router.get('/:subjectId/practice', auth_1.protect, practiceController_1.getPracticeUnits);
router.post('/:subjectId/practice', auth_1.protect, auth_1.adminOnly, practiceController_1.createPracticeUnit);
exports.default = router;
//# sourceMappingURL=subjectRoutes.js.map