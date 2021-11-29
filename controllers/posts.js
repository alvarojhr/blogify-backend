const Post = require("../models/post");

const posts = [
  {
    title: "Primer post",
    summary: "Esto es un post",
    content: "Nuestro primer post desde el servidor",
  },
  {
    title: "Segundo post",
    summary: "Esto es un post",
    content: "Felicitaciones",
  },
];

exports.getMessage = (req, res) => {
  res.send("Hola Mundo!");
};

exports.getPosts = (req, res) => {
  Post.find().then((postResult) => {
    res.status(200).json(postResult);
  });
};

exports.addPost = (req, res) => {
  const url = req.protocol + "://" + req.get("host") + "/files/";
  //posts.push(req.body);
  const postAdd = new Post({
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    imageUrl: url + req.file.filename,
    author: req.userData.userId,
  });

  postAdd.save().then((createdPost) => {
    console.log(createdPost);
    res.status(201).json({ message: "Post creado" });
  });
};

exports.deletePost = (req, res) => {
  Post.deleteOne({ _id: req.params.id, author: req.userData.userId }).then(
    (result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post eliminado" });
      } else {
        res.status(200).json({ message: "Autenticación fallida" });
      }
    }
  );
};

exports.updatePost = (req, res) => {
  const id = req.params.id;
  let image = "";
  if (req.file) {
    const url = req.protocol + "://" + req.get("host") + "/files/";
    image = url + req.file.filename;
  } else {
    image = req.body.imageUrl;
  }

  const post = new Post({
    _id: id,
    title: req.body.title,
    summary: req.body.summary,
    content: req.body.content,
    imageUrl: image,
    author: req.userData.userId,
  });

  Post.updateOne({ _id: id, author: req.userData.userId }, post).then(
    (result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Actualización exitosa" });
      } else {
        res.status(200).json({ message: "Autenticación fallida" });
      }
    }
  );
};

exports.getPost = (req, res) => {
  const id = req.params.id;

  Post.findById(id).then((result) => {
    console.log(result);
    res.status(200).json(result);
  });
};
