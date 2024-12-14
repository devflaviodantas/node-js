const crypto = require("crypto");

function hash(login, password, hash) {
  const data = login + password;
  switch (hash) {
    case "0x.md5":
      return "0x" + crypto.createHash("md5").update(data).digest("hex");
    case "md5":
      return crypto.createHash("md5").update(data).digest("hex");
    case "base64":
      return Buffer.from(data).toString("base64");
    case "base64+md5":
      return Buffer.from(
        crypto.createHash("md5").update(data).digest()
      ).toString("base64");
    default:
      return Buffer.from(
        crypto.createHash("md5").update(data).digest()
      ).toString("base64");
  }
}

module.exports = hash;
