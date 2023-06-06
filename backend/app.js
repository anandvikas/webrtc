require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { eventListeners } = require("./socket/listeners");

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(
  cors()
);

const server = app.listen(PORT, console.log("listning", PORT));
const io = require("./socket/socket").init(server);
io.on("connection", (socket) => {
  eventListeners(socket);
});

