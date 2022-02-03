const mongoose = require('mongoose');

const idRef = mongoose.Schema.Types.ObjectId;

const roomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: [true, 'you must provide a number for the room'],
        unique: true,
        maxlength: [7, "the roomId can't be greater than 7 digits"],
    },
    room_name: {
        type: String,
        unique: [true, 'the name must be uniqe'],
        required: [true, 'you must provide a name for the room'],
    },
    announcement: {
        type: String,
        default: 'Welcome to my room',
    },
    room_BG: {
        type: String,
    },
    room_avatar: {
        type: String,
    },
    room_owner: {
        type: idRef,
        ref: 'User',
        required: [true, 'the room must have owner'],
    },
    room_admins: [
        {
            type: idRef,
            ref: 'User',
        },
    ],
    // room_voice_owner: {
    //     type: idRef,
    //     ref: 'User',
    // },
    room_members: [
        {
            type: idRef,
            ref: 'User',
        },
    ],
    generas: [
        {
            type: String,
        },
    ],
    private: {
        type: Boolean,
        default: false,
    },
    room_password: {
        type: String,
    },
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
