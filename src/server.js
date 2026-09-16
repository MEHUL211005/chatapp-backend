require("dotenv").config();

const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const app = require("./app");
const sequelize = require("./config/database");

const registerChatSocket = require("./sockets/chatSocket");
const registerPresenceSocket = require("./sockets/presenceSocket");

const PORT = process.env.PORT || 5000;

// Express app → HTTP server
const httpServer = http.createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Make Socket.IO available inside Express controllers
app.set("io", io);

// Socket authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    socket.user = decoded;

    next();
  } catch (error) {
    next(new Error("Invalid or expired access token"));
  }
});

// Socket connection
io.on("connection", (socket) => {
  const userId = socket.user.userId;

  console.log("User connected:", userId);
  console.log("Socket ID:", socket.id);

  // Personal user room
  socket.join(`user:${userId}`);

  // Register socket handlers
  registerPresenceSocket(io, socket);
  registerChatSocket(io, socket);
});

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully");

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message
    );
  }
};

startServer();