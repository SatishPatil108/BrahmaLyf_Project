import multer from "multer";

// Use memory storage
const storage = multer.memoryStorage();

// No fileFilter or size validation now
const universalUpload = multer({
  storage
});

export default universalUpload;
