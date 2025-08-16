import fs from "node:fs";
import path from "node:path";
import multer from "multer";

export const fileValidation = {
    image:['image/jpeg', 'image/gif'],
    document:['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}

export const localFileUpdate = ({ customPath = "general" , validation=[], maxFileSizeMB=2} = {}) => {
  let basePath = `uploads/${customPath}`;

  const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        if(req.user?._id) {
            basePath += `/${req.user._id}`
        }
          const fullPath = path.resolve(`./src/${basePath}`);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath,{ recursive:true});
  }
      callback(null, path.resolve(fullPath));
    },
    filename: function (req, file, callback) {
      const uniqueFileName =
        Date.now() + "___" + Math.random() + "___" + file.originalname;
        file.finalPath = basePath + "/" + uniqueFileName
      callback(null, uniqueFileName);
    },
  });

const fileFilter = function(req, file, callback) {
if(validation.includes(file.mimetype)) {
    return callback(null, true)
}
else {
    return callback("Invalid file format", false)
}
}

  return multer({
    dest: "./temp",
    fileFilter,
    storage,
    limits:{
      // file size in bytes
      fileSize: maxFileSizeMB * 1024 * 1024
    }
  });
};
