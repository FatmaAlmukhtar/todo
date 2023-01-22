const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:3000"
  }
});

let todoList = [];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('disconnect', () => {
    socket.disconnect()
    console.log('🔥: A user disconnected');
  });
  socket.on('send_message', (data) => {
    todoList = data.todo
    socket.broadcast.emit("receive_message", data)
  });
  socket.on('personal', (data) => {
    if (typeof window !== 'undefined') localStorage.setItem(`${data.username}_todoList`, JSON.stringify(data.todo))
  });
  // socket.on("addTodo", (todo) => {
  //   //👇🏻 Adds the to-do object to the list of to-dos
  //   todoList.push(todo);
  //   //👇🏻 Sends all the to-dos to the React app
  //   socket.emit("todos", todoList);
  // });
  // socket.on("deleteTodo", (id) => {
  //   todoList = todoList.filter((todo, i) => i !== id);
  //   //👇🏻 Sends the updated to-do to the React app
  //   socket.emit("todos", todoList);
  // });
  // socket.on("editTodo", (data) => {
  //   todoList[data.id] = data.todo
  //   socket.emit("todos", todoList);
  // });
})

app.get("/api", (req, res) => {
    res.json(todoList);
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});