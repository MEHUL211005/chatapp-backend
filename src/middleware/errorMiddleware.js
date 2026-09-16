const errorMiddleware = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "MulterError") {
    return res.status(err.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "File size must not exceed 10 MB"
          : "Invalid file upload",
    });
  }

  if (
    err.message === "Unsupported file type" ||
    err.message === "Message content or attachment is required"
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = errorMiddleware;