const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Socket conectado:${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`Id do usuario: ${socket.id} Sala do usuario: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuario Desconectado", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello, world");
});

server.listen(3001, () => {
  console.log("Back-end rodando");
});
