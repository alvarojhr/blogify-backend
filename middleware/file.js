const multer = require("multer");

const MIME_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file);
    const isValid = MIME_TYPES[file.mimetype];
    let error = new Error("El tipo de archivo no es válido");
    if (isValid) {
      error = null;
    }
    callback(error, "files");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPES[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: storage }).single("image");
