// app.js
const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const dotenv = require("dotenv");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());



app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


//  ​‌‌‍𝗱͟𝗲͟𝗽͟𝗹͟𝗼͟𝘆͟𝗺͟𝗲͟𝗻͟𝘁 𝗰͟𝗼͟𝗱͟𝗲 ​---------->


const __dirname1=path.resolve();
if(process.env.NODE_ENV==="production"){

  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );

}
else{
  app.get("/",(req,res)=>{
    res.send("API is Running Successfully");
  })
}





//  ​‌‍‌‍*************************************************​

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
