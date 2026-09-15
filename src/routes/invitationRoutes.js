const express = require("express");

const router = express.Router();

const {
  createInvitation,
  validateInvitation,
} = require("../controllers/invitationController");

const {
  createInvitationValidator,
} = require("../validators/invitationValidator");

const validate = require("../middleware/validationMiddleware");

const { authenticate } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post(
  "/",
  authenticate,
  authorize("admin"), // Only admins can create invitations
  createInvitationValidator,
  validate,
  createInvitation
);

module.exports = router;