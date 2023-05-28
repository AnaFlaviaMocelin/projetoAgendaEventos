const bcrypt = require('bcrypt');


module.exports = { 
    hash: function(password) {
        return bcrypt.hashSync(password, 10);
    }
};

