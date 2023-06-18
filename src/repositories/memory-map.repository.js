const path = require("path");
const fs = require("fs");

const map = new Map();

const tmpPath = path.resolve(process.cwd(), "tmp");

module.exports = {
  debug: function () {
    console.log(map);
  },
  add: function (key, value) {
    map.set(key, value);
    return this;
  },
  has: function (key) {
    return map.has(key);
  },
  get: function (key) {
    return map.get(key);
  },
  delete: function (key) {
    map.delete(key);
    return this;
  },
  checkFolder: function () {
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }
    return this;
  },
  loadFromFile: async function (fileName) {
    return new Promise((resolve) => {
      try {
        this.checkFolder();
        const filePath = path.resolve(tmpPath, fileName);
        const fileAsString = fs.readFileSync(filePath, { encoding: "utf-8" });
        const fileAsObject = JSON.parse(fileAsString);
        Object.entries(fileAsObject).forEach(([key, value]) =>
          this.add(key, value)
        );
        return resolve(this);
      } catch (error) {
        console.error(error);
        resolve(this);
      }
    });
  },
  saveAsFile: async function (fileName) {
    return new Promise((resolve) => {
      try {
        this.checkFolder();
        const filePath = path.resolve(tmpPath, fileName);
        const mapAsString = JSON.stringify(Object.fromEntries(map));
        fs.writeFileSync(filePath, mapAsString, { encoding: "utf-8" });
        return resolve(this);
      } catch (error) {
        console.error(error);
        resolve(this);
      }
    });
  },
};
