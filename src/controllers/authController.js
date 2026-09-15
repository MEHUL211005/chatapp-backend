const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(
      refreshToken
    );

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const result = await authService.logout(
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
    refreshAccessToken,
    logout,
};