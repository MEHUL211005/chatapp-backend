const express = require("express");

const router = express.Router();

const {
  validateInvitation,
  acceptInvitation,
} = require("../controllers/invitationController");

const {
  acceptInvitationValidator,
} = require("../validators/invitationValidator");

const validate = require("../middleware/validationMiddleware");

router.get(
  "/invitations/:token",
  validateInvitation
);

router.post(
  "/invitations/:token/accept",
  acceptInvitationValidator,
  validate,
  acceptInvitation
);

module.exports = router;