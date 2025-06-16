const multer = require('multer');
const storage = multer.memoryStorage(); // simpan sementara di memori
const upload = multer({ storage: storage });

module.exports = upload;
