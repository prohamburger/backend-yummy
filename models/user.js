const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type:String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    favourite: {
      type: Array,
      required: false
    }
});

module.exports = mongoose.model('User', UserSchema);