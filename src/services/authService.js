const { User , Useression } = require("../models");

const { comparePassword } = require("../utils/password");
const {
  hashRefreshToken,
} = require("../utils/refreshToken");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");

const login = async (email, password) => {
  // Find user
  const user = await User.findOne({
    where: {
      email,
    },
  });

  // Generic error for security
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check account status
  if (!user.isActive) {
    throw new Error("Your account is inactive");
  }

  // Check password
  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
const refreshTokenHash = hashRefreshToken(refreshToken);

await UserSession.create({
  userId: user.id,
  refreshTokenHash,
  expiresAt: new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ),
});
  return {
    accessToken,
    refreshToken,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await UserSession.findOne({
    where: {
      refreshTokenHash,
      revokedAt: null,
    },
  });

  if (!session) {
    throw new Error("Invalid or revoked refresh token");
  }

  if (new Date() > new Date(session.expiresAt)) {
    throw new Error("Refresh token has expired");
  }

  const user = await User.findByPk(decoded.userId);

  if (!user || !user.isActive) {
    throw new Error("User account is inactive");
  }

  const accessToken = generateAccessToken(user);

  return {
    accessToken,
  };
};
const logout = async (userId) => {
  await UserSession.update(
    {
      revokedAt: new Date(),
    },
    {
      where: {
        userId,
        revokedAt: null,
      },
    }
  );

  return {
    message: "Logout successful",
  };
};
module.exports = {
  login,
    refreshAccessToken, 
    logout,
};