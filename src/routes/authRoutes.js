const express = require("express");

const router = express.Router();

const { login ,  refreshAccessToken, logout } = require("../controllers/authController");

const {
  loginValidator,
  refreshTokenValidator,
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");
const { authenticate } = require("../middleware/authMiddleware");

router.post(
  "/login",
  loginValidator,
  validate,
  login
);
router.post(
  "/refresh",
  refreshTokenValidator,
  validate,
  refreshAccessToken
);
router.post(
  "/logout",
  authenticate,
  logout
);
module.exports = router;