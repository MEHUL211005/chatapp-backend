const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const invitationRoutes = require("./routes/invitationRoutes");
const invitationAuthRoutes = require("./routes/invitationAuthRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Chat App Backend is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin/invitations", invitationRoutes);
app.use("/api/auth", invitationAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

// Global error handler
app.use(errorMiddleware);

module.exports = app;