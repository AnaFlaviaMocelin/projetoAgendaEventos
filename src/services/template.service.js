const path = require("node:path");
const ejs = require("ejs");

module.exports = {
  renderAsHtmlString: function (templateName, data) {
    const templatePath = path.resolve(
      process.cwd(),
      "src",
      "templates",
      templateName
    );
    return new Promise((resolve, reject) => {
      ejs.renderFile(templatePath, data, (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  },
};
