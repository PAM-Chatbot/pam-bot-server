const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, dropDups: true },
    telephone: { type: String, required: true, unique: true, dropDups: true },
    messages: [Object]
});

module.exports = mongoose.model("User", UserSchema);  