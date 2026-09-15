const invitationService = require("../services/invitationService");

const createInvitation = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const result = await invitationService.createInvitation({
      name,
      email,
      invitedBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
const validateInvitation = async (req, res, next) => {
  try {
    const { token } = req.params;

    const invitation =
      await invitationService.validateInvitation(token);

    return res.status(200).json({
      success: true,
      message: "Invitation is valid",
      data: invitation,
    });
  } catch (error) {
    next(error);
  }
};
const acceptInvitation = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await invitationService.acceptInvitation(
      token,
      password
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createInvitation,
  validateInvitation,
    acceptInvitation,
};