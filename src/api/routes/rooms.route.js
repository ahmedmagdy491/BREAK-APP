const RoomControllers = require('../controllers/rooms.controller');
const { catchValidationError } = require('../middlewares/validationError');
const { validate } = require('../helpers/validationLayers/room.layers');

const router = require('express').Router();
const auth = require('./../middlewares/auth.middleware');

router
    .route('/')
    .get(RoomControllers.getAllRooms)
    .post(
        auth,
        validate('createRoom'),
        catchValidationError,
        RoomControllers.createRoom
    );

router
    .route('/:id')
    .get(RoomControllers.getRoomById)
    .put(
        auth,
        // validate('updateRoom'),
        catchValidationError,
        RoomControllers.updateRoomById
    )
    .delete(auth, RoomControllers.deleteRoomById);

router.route('/:id/add-members').put(
    auth,
    // validate('updateRoom'),
    catchValidationError,
    RoomControllers.addRoomMembers
);

router.route('/:id/remove-members').put(
    auth,
    // validate('updateRoom'),
    catchValidationError,
    RoomControllers.removeRoomMembers
);

module.exports = router;
