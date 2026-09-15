const { User } = require("../models");

const userSockets = new Map();

const registerPresenceSocket = (io, socket) => {
  const userId = socket.user.userId;

  // User ke sockets initialize karo
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }

  const sockets = userSockets.get(userId);

  // Current socket add karo
  sockets.add(socket.id);

  // User online
  User.update(
    {
      isOnline: true,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  // Notify other users
  socket.broadcast.emit("user_online", {
    userId,
  });

  socket.on("disconnect", async () => {
    try {
      const userSocketsSet = userSockets.get(userId);

      if (!userSocketsSet) {
        return;
      }

      // Current socket remove
      userSocketsSet.delete(socket.id);

      // Agar koi socket nahi bacha
      if (userSocketsSet.size === 0) {
        userSockets.delete(userId);

        await User.update(
          {
            isOnline: false,
            lastSeen: new Date(),
          },
          {
            where: {
              id: userId,
            },
          }
        );

        socket.broadcast.emit("user_offline", {
          userId,
          lastSeen: new Date(),
        });

        console.log(
          `User ${userId} is offline`
        );
      }
    } catch (error) {
      console.error(
        "Presence update error:",
        error
      );
    }
  });
};

module.exports = registerPresenceSocket;