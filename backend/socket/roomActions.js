const { eventEmitters } = require("./emitters");

rooms = {
  // roomId : [{ sid : "", description : "", type : ""}]
}

sockets = {
  // sid : roomId 
}

const getUniqueId = () => {
  const makeId = () => {
    return Math.floor(100000 + Math.random() * 900000);
  }
  let id;
  let searchCount = 0;
  for (id = makeId(); rooms[id]; id = makeId()) {
    console.log("id exists ...");
    if (searchCount >= 500) {
      id = null
      console.log("server limit reached ...");
      break;
    }
  };
  return id
}

const getRoom = (roomId) => {
  return rooms[roomId] || null;
}

const createRoom = (offer, socketId) => {
  let id = getUniqueId();
  if (!id) { return };

  try {
    rooms[id] = [{
      sid: socketId,
      description: offer,
      type: "offer"
    }]
    sockets[socketId] = id;
  } catch (error) {
    eventEmitters.errorEvent(socketId, { message: "Something went wrong while establishing the connection!" });
    return
  }

  // send back the id to same user ----
  return id
}

const joinRoom = (roomId, socketId) => {
  let offer;

  try {
    if (rooms[roomId]) {
      offer = rooms[roomId].find(elem => elem.type === "offer").description;
      rooms[roomId].push({
        sid: socketId,
      })
    }
  } catch (error) {
    eventEmitters.errorEvent(socketId, { message: "Something went wrong while establishing the connection!" });
    return
  }

  // return the offer to joiner ----
  return offer
}

const addAnswer = (roomId, answer, socketId) => {
  if (rooms[roomId]) {
    let sidOfStarter;
    try {
      rooms[roomId] = rooms[roomId].map(elem => {
        if (elem.sid == socketId) {
          return {
            sid: socketId,
            description: answer,
            type: "answer"
          }
        } else {
          sidOfStarter = elem.sid;
          return elem;
        }
      })
    } catch (error) {
      eventEmitters.errorEvent(socketId, { message: "Something went wrong while establishing the connection!" });
      return
    }

    // return the socketId of starter ---
    return sidOfStarter
  }
}

const removeUser = async (socketId) => {
  let roomId = sockets[socketId];
  if (!rooms[roomId]) { return };

  rooms[roomId] = rooms[roomId].filter(elem => elem.sid != socketId);
  if (rooms[roomId].length <= 0) {
    delete rooms[roomId];
  }
  delete sockets[socketId];
};



module.exports = {
  rooms,
  sockets,
  createRoom,
  joinRoom,
  addAnswer,
  removeUser
};
