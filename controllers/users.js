const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    //Si el usuario no existe
    if (!user) {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const newUser = new User({
          username: req.body.name,
          email: req.body.email,
          password: hash,
        });

        newUser
          .save()
          .then((result) => {
            console.log(result);
            res
              .status(201)
              .json({ message: "Usuario creado", userId: result._id });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      });
    } else {
      res.status(201).json({ message: "Usuario existente", userId: user._id });
    }
  });
};

exports.login = (req, res) => {
  let userGet;
  User.findOne({ email: req.body.email })
    .then((user) => {
      // user !== null  --> null != null => !False => not False => True
      if (!user) {
        return res.status(401).json({ message: "Autenticación fallida" });
      }
      userGet = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({ message: "Autenticación fallida" });
      }

      //res.status(200).json({ message: "Autenticación exitosa" });

      const token = jwt.sign(
        { email: userGet.email, userId: userGet._id },
        "MisionTic2021_secret_for_Blogify",
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({ token: token, expiresIn: 3600, userId: userGet._id });
    })
    .catch((err) => {
      return res.status(401).json({ message: "Autenticación fallida" });
    });
};

exports.getToken = (req, res) => {
  const tokenGoogle = jwt.decode(req.body.token);
  const exp = new Date(tokenGoogle.exp * 1000);
  const now = new Date();

  if (
    tokenGoogle.azp === process.env.CLIENT_ID_GOOGLE &&
    tokenGoogle.aud === process.env.CLIENT_ID_GOOGLE &&
    exp > now
  ) {
    const token = jwt.sign(
      { email: tokenGoogle.email, userId: req.body.userId },
      "MisionTic2021_secret_for_Blogify",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token: token, expiresIn: 3600 });
  }
};

exports.getUser = (req, res) => {
  User.findById(req.params.userId).then((user) => {
    res.status(200).json({ username: user.username });
  });
};
