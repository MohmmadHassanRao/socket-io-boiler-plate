// Necessary for application

var express = require("express");
var path = require("path");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var http = require("http");
var socketIO = require("socket.io");

var app = express();
var PORT = process.env.PORT || 5000;
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/signup", (req, res) => {
  res.send("signup response");
});

app.get("/login", (req, res) => {
  res.send("login response");
});

app.use("/", express.static(path.resolve(path.join(__dirname, "public"))));

var server = http.createServer(app);

var io = socketIO(server);

var users = [];

// for server we use connection and and for client side we use connect
io.on("connection", (user) => {
  console.log("user id: ", user.id);
  user.emit("NOTIFICATION", "data sent");

  users.push(user);
  console.log("user count: ", users.length);

  setTimeout(function () {
    users[0].emit("NOTIFICATION", "hi");
  }, 5000);
  console.log("a user connected");
});

setInterval(() => {
  io.emit("COMMON_TOPIC", `some common data: ${new Date().getSeconds()}`);
}, 1000);

server.listen(PORT, () => {
  console.log("server is running on port : ", PORT);
});
