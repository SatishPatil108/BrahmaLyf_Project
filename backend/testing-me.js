import Cryptr from "cryptr";
const cryptr = new Cryptr("#1@ETIS2@#");
console.log(cryptr.encrypt("Bramhneuro@123"))
console.log(cryptr.decrypt("1af2dfc388de939faa7439f88c423c21f7d547ed4ef3eb6bb04d1a788e3e2c58b70e5ad603f3cba5c5f03844a155e77cc15ce3dda27d5ede57b86c5ca304841b07d1a28b7f1dec85a3f22990035713c8314e3aa6ed1b789951a32afa1cc1bde7abc0fcdd0a35239ec826"))