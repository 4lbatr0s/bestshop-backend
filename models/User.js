const mongoose = require('mongoose');

//INFO:how to create a mongoose schema.
const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required:true },
        isAdmin: { type: Boolean, default: false },

    },
    { timestamps: true } //INFO: timestamps creates CreatedAt and UpdatedAt properties.
)

module.exports = mongoose.model("User", UserSchema); //INFO: how to import a mongoose schema.