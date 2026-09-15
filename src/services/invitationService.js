const { User, Invitation } = require("../models");

const {
  generateInvitationToken,
  hashInvitationToken,
} = require("../utils/invitationToken");

const {
  sendInvitationEmail,
} = require("./emailService");
const { hashPassword } = require("../utils/password");

const createInvitation = async ({
  name,
  email,
  invitedBy,
}) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  // 2. Generate secure token
  const rawToken = generateInvitationToken();

  // 3. Hash token before storing in DB
  const tokenHash = hashInvitationToken(rawToken);

  // 4. Invitation expiry
  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  // 5. Create invitation record
  await Invitation.create({
    name,
    email,
    tokenHash,
    expiresAt,
    status: "pending",
    invitedBy,
  });

  // 6. Create frontend invitation URL
  const invitationLink =
    `${process.env.FRONTEND_URL}/invite/${rawToken}`;
console.log("\n========================================");
console.log("INVITATION LINK");
console.log(invitationLink);
console.log("========================================\n");
  // 7. Send invitation email
  await sendInvitationEmail({
    email,
    name,
    invitationLink,
  });

  return {
    message: "Invitation sent successfully",
  };
};
const validateInvitation = async (token) => {
  // 1. Hash the token received from frontend
  const tokenHash = hashInvitationToken(token);

  // 2. Find invitation using hashed token
  const invitation = await Invitation.findOne({
    where: {
      tokenHash,
    },
  });

  // 3. Invitation doesn't exist
  if (!invitation) {
    throw new Error("Invalid invitation link");
  }

  // 4. Check if already used/revoked
  if (invitation.status !== "pending") {
    throw new Error("This invitation is no longer valid");
  }

  // 5. Check expiry
  if (new Date() > new Date(invitation.expiresAt)) {
    throw new Error("This invitation link has expired");
  }

  // 6. Return only safe information
  return {
    name: invitation.name,
    email: invitation.email,
  };
};
const acceptInvitation = async (token, password) => {
  // 1. Hash the token received from frontend
  const tokenHash = hashInvitationToken(token);

  // 2. Find invitation
  const invitation = await Invitation.findOne({
    where: {
      tokenHash,
    },
  });

  // 3. Check invitation exists
  if (!invitation) {
    throw new Error("Invalid invitation link");
  }

  // 4. Check invitation status
  if (invitation.status !== "pending") {
    throw new Error("This invitation is no longer valid");
  }

  // 5. Check expiry
  if (new Date() > new Date(invitation.expiresAt)) {
    throw new Error("This invitation link has expired");
  }

  // 6. Check if email already has an account
  const existingUser = await User.findOne({
    where: {
      email: invitation.email,
    },
  });

  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  // 7. Hash password
  const hashedPassword = await hashPassword(password);

  // 8. Create user
  const user = await User.create({
    name: invitation.name,
    email: invitation.email,
    password: hashedPassword,
    role: "user",
    isActive: true,
  });

  // 9. Mark invitation as used
  invitation.status = "used";
  invitation.usedAt = new Date();

  await invitation.save();

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
module.exports = {
  createInvitation,
  validateInvitation,
    acceptInvitation,
};