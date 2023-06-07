const { randomBytes, scryptSync } = require("crypto");

module.exports = {
  hash: function (text, incomingSalt) {
    const salt = incomingSalt ? incomingSalt : randomBytes(64).toString("hex");
    const buffer = scryptSync(text, salt, 64);
    return { hash: buffer.toString("hex"), salt };
  },
  compare: function (text, incomingHash, incomingSalt) {
    const { hash: targetHash } = this.hash(text, incomingSalt);
    return incomingHash === targetHash;
  },
};
