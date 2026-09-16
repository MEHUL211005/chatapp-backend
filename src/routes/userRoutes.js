const express = require("express");

const router = express.Router();

const { getUsers } = require("../controllers/userController");

const { authenticate } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
  paginationValidator,
} = require("../validators/paginationValidator");

router.get(
  "/",
  authenticate,
  paginationValidator,
  validate,
  getUsers
);

module.exports = router;