//username mjay88
//mongo pw dJAfecjXa5Vbi4a
require("dotenv").config();
//initiallize express server
const express = require("express");
// var bodyParser = require('body-parser');
//mongoose is how we use mongo in our app
const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const path = require("path");
//import routes
const authRoute = require("./routes/auth")
// const toDosRoute = require("./routes/todos")

//intialize express server
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

app.get("/api", (req, res) => {
  res.send("Pet App Server running mother Fuckers!!!");
});

//further test our server that it is recieving form url encoded data
app.post("/name", (req, res) => {
  if (req.body.name) {
    return res.json({ name: req.body.name });
  } else {
    return res.status(400).json({ error: "No name provided" });
  }
});

 app.use("/api/auth", authRoute);
//  app.use("/api/todos", toDosRoute);

// app.use(express.static(path.resolve(__dirname, "./client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
// })

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${Number(process.env.PORT)}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
