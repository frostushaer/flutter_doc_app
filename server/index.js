const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const authRouter = require("./routes/auth");
const documentRouter = require("./routes/document");
const Document = require("./models/document");

const PORT = process.env.PORT | 3001;

const app = express();
var server = http.createServer(app);

// create socket 
var io = require("socket.io")(server);

// middleware
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(documentRouter);

const DB =
  "mongodb+srv://tushar:tushar981@cluster0.10h2xtq.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB).then(() => {
    console.log("connection successfull");
}).catch((err) => {
    console.log(err);
});

// sockets is used to sed continious data from server to client, once the client requested
io.on("connection", (socket) => {
    console.log("socket connected");
  socket.on("join", (documentId) => {
    socket.join(documentId);
    console.log("joined Room");
  });

  socket.on("typing", (data) => {
    socket.broadcast.to(data.room).emit("changes", data);
  });

  socket.on("save", (data) => {
    saveData(data);
  });
});

const saveData = async (data) => {
  let document = await Document.findById(data.room);
  document.content = data.delta;
  document = await document.save();
};

server.listen(PORT, "0.0.0.0", () => {
    console.log(`connected at port: ${PORT}`);
});