/**
 * Universal file validator
 *
 * @param {Object|null} file - Multer file object (req.file or req.files[n])
 * @param {boolean} isRequired - Whether the file is mandatory
 * @param {Array<string>} allowedTypes - Array of accepted MIME types
 * @param {number} maxSize - Max size in bytes
 * @param {string} fieldName - Name to display in error messages
 * @returns {string|null} - Returns error message or null if valid
 */
 const validateFile = (file, isRequired, allowedTypes, maxSize, fieldName) => {

  // required but missing
  if (isRequired && !file) {
    return `${fieldName} is required`;
  }

  // not required and not provided
  if (!file) return null;

  // type check
  if (!allowedTypes.includes(file.mimetype)) {
    return `${fieldName} has invalid type. Allowed types: ${allowedTypes.join(", ")}`;
  }

  // size check
  if (file.size > maxSize) {
    return `${fieldName} exceeds size limit of ${Math.round(maxSize / (1024 * 1024))} MB`;
  }

  return null;
};
export default validateFile;