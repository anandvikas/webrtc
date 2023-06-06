const {
  createRoom,
  joinRoom,
  addAnswer,
  removeUser
} = require("./roomActions");
const { eventEmitters } = require("./emitters");


const eventListeners = async (socket) => {
  socket.on("startNew", async (data) => {
    const { offer } = data;
    if (!offer) {
      return;
    }
    let roomId = createRoom(offer, socket.id);

    // send roomId to socket.id
    await eventEmitters.returnRoomId(socket.id, { roomId });
  });

  socket.on("joinExisting", async (data) => {
    let { roomId } = data;
    if (!roomId) {
      return;
    }

    let offer = joinRoom(roomId, socket.id);

    // send offer to socket.id
    await eventEmitters.returnOffer(socket.id, { offer, roomId });
  });

  socket.on("sendAnswer", async (data) => {
    let { roomId, answer } = data;
    if (!roomId || !answer) {
      return;
    }
    let sidOfStarter = addAnswer(roomId, answer, socket.id);

    // send answer to sidOfStarter
    await eventEmitters.returnAnswer(sidOfStarter, { answer });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    return;
  });

};

module.exports = {
  eventListeners,
};
