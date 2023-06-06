const { getIO } = require("./socket");

const eventEmitters = {

  returnRoomId: async (sid, data) => {
    const io = getIO();
    io.to(sid).emit("returnRoomId", data);
  },

  returnOffer: async (sid, data) => {
    const io = getIO();
    io.to(sid).emit("returnOffer", data);
  },

  returnAnswer: async (sid, data) => {
    const io = getIO();
    io.to(sid).emit("returnAnswer", data);
  },

  errorEvent: async (sid, data) => {
    const io = getIO();
    io.to(sid).emit("errorEvent", data);
  },
};

module.exports = {
  eventEmitters,
};
