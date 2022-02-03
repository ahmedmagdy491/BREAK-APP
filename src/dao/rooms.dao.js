// - CRUD Room -> userId, roomInfo
// - addMembers -> memberId, roomId
// - addAdmins -> memberId, roomId
// - removeMembers -> memberId, roomId
// - removeAdmins -> memberId, roomId
// - addGeneras -> memberId, roomId
// - removeGeneras -> memberId, roomId
// - goinMembers -> memberId, roomId
// - search -> searchInfo

const checkDataExist = require('../api/helpers/notFoundData');
const verifyUpdates = require('../api/helpers/verifyUpdates');
const Room = require('../schemas/rooms.schema');
const { ObjectId } = require('bson');

class RoomDAO {
    static async createRoom(roomInfo) {
        try {
            const room = await Room.create(roomInfo);
            return room;
        } catch (error) {
            throw error;
        }
    }
    static async updateRoomInfoById(roomId, roomInfo) {
        const whiteList = ['room_name', 'private', 'password', 'announcement'];
        try {
            const room = await Room.findByIdAndUpdate(roomId, {
                $set: verifyUpdates(roomInfo, whiteList),
            });
            checkDataExist(room);
            return;
        } catch (error) {
            throw error;
        }
    }
    static async addRoomMembers(roomId, membersArray = []) {
        try {
            const room = await Room.findByIdAndUpdate(roomId, {
                $addToSet: { room_members: { $each: membersArray } },
            });
            checkDataExist(room);
            return;
        } catch (error) {
            throw error;
        }
    }
    static async removeRoomMembers(roomId, membersArray = []) {
        try {
            const room = await Room.findByIdAndUpdate(roomId, {
                $pullAll: { room_members: membersArray },
            });
            checkDataExist(room);
            console.log(room);
            return;
        } catch (error) {
            throw error;
        }
    }
    static async addRoomAdmins(roomId, adminsArray) {
        try {
            const room = await Room.updateOne(
                { _id: roomId },
                { $push: adminsArray }
            );

            return room;
        } catch (error) {
            throw error;
        }
    }
    static async removeRoomAdmins(roomId, adminsArray) {
        try {
            const room = await Room.updateOne(
                { _id: roomId },
                { $pull: adminsArray }
            );

            return room;
        } catch (error) {
            throw error;
        }
    }

    static async getRoomById(roomId) {
        const pipeline = [
            { $match: { _id: ObjectId(roomId) } },
            {
                $lookup: {
                    from: 'users',
                    let: { userMembers: '$room_members' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$userMembers'] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                avatar: 1,
                            },
                        },
                    ],
                    as: 'room_members',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userAdmins: '$room_admins' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$userAdmins'] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                avatar: 1,
                            },
                        },
                    ],
                    as: 'room_admins',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userOwner: '$room_owner' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userOwner'] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                avatar: 1,
                            },
                        },
                    ],
                    as: 'room_owner',
                },
            },
            { $unwind: '$room_owner' },
        ];
        try {
            const room = await Room.aggregate(pipeline);
            checkDataExist(room);
            return room[0];
        } catch (error) {
            throw error;
        }
    }
    static async getAllRooms() {
        const pipeline = [
            { $match: {} },
            {
                $lookup: {
                    from: 'users',
                    let: { userIds: '$room_members' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$userIds'] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                avatar: 1,
                            },
                        },
                    ],
                    as: 'room_members',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userAdmins: '$room_admins' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$_id', '$$userAdmins'] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                avatar: 1,
                            },
                        },
                    ],
                    as: 'room_admins',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { userOwner: '$room_owner' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$userOwner'] },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                                avatar: 1,
                            },
                        },
                    ],
                    as: 'room_owner',
                },
            },
            { $unwind: '$room_owner' },
        ];
        try {
            const room = await Room.aggregate(pipeline);
            return room;
        } catch (error) {
            throw error;
        }
    }
    static async searchForRooms(roomInfo) {
        const pipeline = [{ $match: { roomInfo } }];
        try {
            const room = await Room.aggregate(pipeline);
            return room;
        } catch (error) {
            throw error;
        }
    }
    static async deleteRoomById(roomId) {
        try {
            const room = await Room.findByIdAndDelete(roomId);
            checkDataExist(room);
            return;
        } catch (error) {
            throw error;
        }
    }
}

// exports.createRoom = (roomInfo) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const room = await Room.create(roomInfo);

//             resolve(room);
//         } catch (error) {
//             error.status = error.status || 400;
//             reject(error);
//         }
//     });
// };

module.exports = RoomDAO;
