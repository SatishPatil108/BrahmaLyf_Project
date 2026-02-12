import fs from "fs/promises";
import path from "path";

const removeFiles = async (filePaths) => {
  let allDeleted = true;
  for (const filePath of filePaths) {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.unlink(absolutePath);
      console.log(`✅ Deleted: ${absolutePath}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.warn(`⚠️ File not found, skipping: ${filePath}`);
        continue;
      }
      console.error(`❌ Error deleting ${filePath}: ${error.message}`);
      allDeleted = false;
    }
  }

  return allDeleted;
};
export default removeFiles;