const mongoose= require("mongoose");

//The file contains the schema that the user data documents will follow

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    }
});

//A collection named "users" will be formed in the user database.
const User = mongoose.model('user', userSchema);
module.exports = User;
