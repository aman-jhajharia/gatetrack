"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const revisionController_1 = require("../controllers/revisionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.protect, revisionController_1.getAllRevisions);
router.get('/:unitId', auth_1.protect, revisionController_1.getRevision);
router.put('/:unitId', auth_1.protect, revisionController_1.upsertRevision);
exports.default = router;
//# sourceMappingURL=revisionRoutes.js.map