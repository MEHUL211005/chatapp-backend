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

const {
  invitationRateLimiter,
} = require("../middleware/rateLimitMiddleware");

router.post(
  "/",
  authenticate,
  authorize("admin"),
  invitationRateLimiter,
  createInvitationValidator,
  validate,
  createInvitation
);

module.exports = router;