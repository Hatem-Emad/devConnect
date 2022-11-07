const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    location:{
        type: String
    },
    state:{
        type: String
    },
    skills:{
        type:[String]
    },
    bio:{
        type: String
    },
    githubusername:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile',ProfileSchema)