// server.js
const fs = require("fs");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const commonData = require("./common.js");

app.set("view engine", "ejs");

// Serve static files from the "public" folder
app.use(express.static("public"));

// Middleware to make common data accessible in all views
app.use((req, res, next) => {
  res.locals.commonData = commonData;
  next();
});

// Define routes
app.get("/all", (req, res) => {
  res.render("all");
});
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/student", (req, res) => {
  res.render("student");
});
app.get("/trainer", (req, res) => {
  res.render("trainer");
});
app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/clear", (req, res) => {  
  doTrainerCommand({name:"trainer",body:"clear"});
  // res.end();
  res.render("index");
});
app.get("/comments", (req, res) => {
  // res.sendFile(__dirname + "/comments.ejs");
  res.render("comments");
  
});

app.get("/comments/read", (req, res) => {
  fs.readFile("comments.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(data);
  });
});

app.get("/comments/delete", (req, res) => {

  fs.writeFile("comments.txt", "", { encoding: "utf8" }, (err) => {
    if (err) { throw err; }
  });
  res.send("File deleted");
});

// Handle form submission for comments
app.post("/submit", (req, res) => {
  let data = req.body;
  let comments = processComment(
    data.txtName,
    data.txtComment1,
    data.txtComment2
  );
  fs.appendFile("comments.txt", comments, { encoding: "utf8" }, (err) => {
    if (err) {
      throw err;
    }
  });
  res.send("Thank you 👍 Your comments are save.");
});


server.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is running!`);
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var writeJsonResponse = function (res, str) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(str));
};

function processComment(name, comment1, comment2) {
  const duration = "5";
  const courseTitle = "Web development";

  let firstname = name.split(" ")[0];
  let com1 = "";
  let com2 = "";
  if (comment1.trim() != "")
    com1 = `${firstname} made the following comments about the course: ${comment1.replace(
      "\n",
      "<br />"
    )}<br />`;
  if (comment2.trim() != "")
    com2 = `When I asked what to do after the course, ${firstname} told me: ${comment2.replace(
      "\n",
      "<br />"
    )}<br />`;

  return `${name}<br /> 
General comments:<br />
${firstname} did well in this course and I am happy with ${firstname}'s progress.<br />
${com1}<br />Punctuality & Engagement:<br />
${firstname} was always punctual during the ${duration} days of the course and was engaged during the lectures.<br /><br />
Recommendations for further learning:<br />
Practice implementing Web development code and design at work.<br /> ${com2}<br />--------------------------------<br />`;
}

//------------------------------------------------------------

var messages = [];

function doTrainerCommand(data) {
  if (data.body == "delete") {
    messages = [];
    return;
  }
  if (data.body == "clear") {
    messages.forEach((m) => (m.body = ""));
    return;
  }
  if (data.body.startsWith("deletename")) {
    const studentName = data.body.substring(11).toLowerCase();

    let index = messages.findIndex((m) => m.name.toLowerCase() == studentName);

    if (index != -1) messages.splice(index, 1);
  }
}

function saveMessage(data) {
  const found = messages.find(
    (m) => m.name.toLowerCase() == data.name.toLowerCase()
  );
  if (found) found.body = data.body;
  else messages.push({ name: data.name, body: data.body });
}

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    if (data.name.toLowerCase() == "trainer") {
      doTrainerCommand(data);
    } else {
      saveMessage(data);
    }

    io.sockets.emit("message", messages);
  });
});
