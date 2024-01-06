const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: {type: String, require: true},
        date: {type: String, require: true},
        email: {type: String, require:true, unique: true},
        phone: {type: String, require: true},
        password: {type: String, require: true},

        role: {
            type: String,
            enum: ['Ward', 'District', 'Department'],
            default: 'Customer',
            require: true,
        },

        access_token: {type: String, require: true},
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("Users", userSchema);
module.exports = User;