const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        date: { type: String, require: true },
        email: { type: String, require: true, unique: true },
        phone: { type: String, require: true },
        password: { type: String, require: true },
        role: { type: Array, require: true, },
        //role[0] -> phường, role[1] -> quận
        // vd nếu là cb phường 7 quận 5-> 0: "P07" , 1: "Q01"
        // nếu là cb quận 5 -> 0: "-1", 1: "Q05"
        //nếu là cb sở : 0,1 : "-1"
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("Users", userSchema);
module.exports = User;