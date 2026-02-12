import Cryptr from "cryptr";
import bcrypt from "bcrypt";
const cryptr = new Cryptr("#1@ETIS2@#");

const encryptedPassword = cryptr.decrypt("8b875d7b437766ddf0cbf6cef4a312dece34b22dd0909b576276e76e9e8dcecc322d72d3c958047f3cbe5ab4cd2f7ffe469a246266694ddda2dddf6ecee5a9ae142a5cb4a5d59639743e9e8952cd666c96099f6da49be1446b65a178a2af0a6dcd1bb0fe3f2fc7ade29d4f");
console.log("Encrypted Password:", encryptedPassword);

const password = "Bramhneuro@123";  // original password
const saltRounds = 10;

const hashPassword = async () => {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("Bcrypt Hash:", hash);
};

hashPassword();
