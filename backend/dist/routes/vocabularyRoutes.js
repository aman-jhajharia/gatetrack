"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vocabularyController_1 = require("../controllers/vocabularyController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.protect, vocabularyController_1.getVocabulary);
router.post('/', auth_1.protect, auth_1.adminOnly, vocabularyController_1.createVocabulary);
router.put('/:id', auth_1.protect, auth_1.adminOnly, vocabularyController_1.updateVocabulary);
router.delete('/:id', auth_1.protect, auth_1.adminOnly, vocabularyController_1.deleteVocabulary);
router.get('/progress', auth_1.protect, vocabularyController_1.getVocabularyProgress);
router.put('/:wordId/progress', auth_1.protect, vocabularyController_1.updateWordProgress);
exports.default = router;
//# sourceMappingURL=vocabularyRoutes.js.map