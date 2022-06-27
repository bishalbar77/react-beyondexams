const express = require("express");
const router = require('express').Router();
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const http = require("http");
const https = require("https");
const socketio = require("socket.io");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");
const formatMessage = require("./utils/messages");
const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();
var cors = require('cors');
const corsOpts = {
  origin: '*',
  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

router.use(cors(corsOpts));

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());

// const enforce = require('express-sslify');


// app.use(express.static(__dirname, { dotfiles: "allow" }));
// app.use(express.static(path.resolve(__dirname, "..", "build")));
// app.use(enforce.HTTPS({ trustProtoHeader: true }));

/*
app.use(function(req, res, next) {
  if ((req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
      } else
        next();
  /*if(!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.baseUrl].join(''));
  }
  next();
  */
/*
});
*/
app.get('/get-razorpay-key', (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

app.post('/create-order', async (req, res) => {
  
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  const payment_capture = 1;
  const amount = 500;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: 'WDD85W552',
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard/course/:slug", async (req, res) => {
  const filePath = path.resolve(__dirname, "..", "build", "index.html");
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return console.log(err);
    }
    var myHeaders = new fetch.Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    await fetch(
      `https://api.beyondexams.org/api/v1/get_course_meta_data?course_slug=${req.params.slug}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        data = data
          .replace(/BeyondExams/g, result.data.title)
          .replace(/Best educational videos on your fingertips. Start learning now!/g, result.data.description)
          .replace(/https:\/\/api.beyondexams.org\/images\/instgram%20profile.jpg/g, result.data.image_url);
      })
      .catch((error) => console.log("error", error));
    res.send(data);
    res.end();
  });
});

app.get("/dashboard/videos/:url", async (req, res) => {
  const filePath = path.resolve(__dirname, "..", "build", "index.html");
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return console.log(err);
    }
    var myHeaders = new fetch.Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    await fetch(`https://api.beyondexams.org/api/v1/get_video_meta_data?url=${req.params.url}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        data = data
          .replace(/BeyondExams/g, result.data.title)
          .replace(/Best educational videos on your fingertips. Start learning now!/g, result.data.description)
          .replace(/https:\/\/api.beyondexams.org\/images\/instgram%20profile.jpg/g, result.data.thumbnails);
      })
      .catch((error) => console.log("error", error));
    res.send(data);
    res.end();
  });
});

app.get("/*", async (req, res) => {
  const filePath = path.resolve(__dirname, "..", "build", "index.html");
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      return console.log(err);
    }

    res.send(data);
  });
});

// const privateKey1 = fs.readFileSync("/var/www/html/privkey_new.pem", "utf8");
// const certificate1 = fs.readFileSync("/var/www/html/cert_new.pem", "utf8");
// const ca1 = fs.readFileSync("/var/www/html/chain_new.pem", "utf8");
// const credentials = {
//   key: privateKey1,
//   cert: certificate1,
//   ca: ca1,
// };

// const httpServer = http.createServer(app);

// const io = socketio(httpsServer);
// io.on("connection", (socket) => {
//   socket.on("joinRoom", ({ username, room }) => {
//     const user = userJoin(socket.id, username, room);

//     socket.join(user.room);

//     // Welcome current user
//     // socket.emit("message", formatMessage("BOT", "Welcome!"));

//     // Broadcast when a user connects
//     // socket.broadcast.to(user.room).emit("message", formatMessage("BOT", `${user.username} has joined the chat`));

//     // Send users and room info
//     // io.to(user.room).emit("roomUsers", {
//     //   room: user.room,
//     //   users: getRoomUsers(user.room),
//     // });
//   });

//   // Listen for chatMessage
//   socket.on("chatMessage", (data) => {
//     // const user = getCurrentUser(socket.id);
//     // let msgData = {};
//     // msgData.message = data.message;
//     io.to(data.room).emit("message", data);
//   });
//   socket.on("leave", () => {
//     const user = userLeave(socket.id);

//     // if (user) {
//     //   io.to(user.room).emit("message", formatMessage("BOT", `${user.username} has left the chat`));

//     // Send users and room info
//     // io.to(user.room).emit("roomUsers", {
//     //   room: user.room,
//     //   users: getRoomUsers(user.room),
//     // });
//     // }
//   });

//   // Runs when client disconnects
//   socket.on("disconnect", () => {
//     userLeave(socket.id);

//     // if (user) {
//     //   io.to(user.room).emit("message", formatMessage("BOT", `${user.username} has left the chat`));

//     // Send users and room info
//     // io.to(user.room).emit("roomUsers", {
//     //   room: user.room,
//     //   users: getRoomUsers(user.room),
//     // });
//     // }
//   });
// });

// httpServer.listen(PORT, () => {
//   console.log("HTTP Server running on port 80");
// });

// httpsServer.listen(443, () => {
//   console.log("HTTPS Server running on port 443");
// });

app.listen(PORT, () =>
  console.log(`server started on http://localhost:${PORT}`)
);