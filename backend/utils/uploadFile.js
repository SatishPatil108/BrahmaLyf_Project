import fs from "fs";
import path from "path";

/**
 * Save uploaded multer file to disk.
 *
 * @param {Object} file - Multer file object (req.file or req.files[n])
 * @param {string} destFolder - Folder inside /uploads
 * @param {string} newName - Base name (without extension)
 * @returns {string} - Relative stored file path
 */
const saveUploadedFile = (file, destFolder, newName) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const buffer = file.buffer;
  const mimeType = file.mimetype;

  const ext = mimeType.includes("/")
    ? mimeType.split("/")[1]
    : "bin";

  const timestamp = Date.now();
  const finalName = `${timestamp}_${newName}.${ext}`;

  const uploadDir = path.join("uploads", destFolder);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fullPath = path.join(uploadDir, finalName);

  fs.writeFileSync(fullPath, buffer);

  return path.join("uploads", destFolder, finalName).replace(/\\/g, "/");
};

export default saveUploadedFile;