const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

// Import de las routes

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/files", express.static(path.join("files")));

// Configuracion de la conexion a la bd
mongoose
  .connect(
    "mongodb+srv://dbUser:BWn65Euo8jT5QGik@cluster0.h306v.mongodb.net/Blogify?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Estamos conectados a nuestra BD");
  })
  .catch(() => {
    console.log("Houston tenemos un problema");
  });

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
