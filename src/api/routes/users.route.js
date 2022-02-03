const { Router } = require('express');

const { UserController } = require('../controllers/users.controller');
const validate = require('../helpers/validationLayers/user.layer');
const auth = require('../middlewares/auth.middleware');
const { catchValidationError } = require('../middlewares/validationError');
const router = Router();

router
	.route('/register')
	.post(validate('addUser'), catchValidationError, UserController.register);
router.route('/login').post(UserController.login);
router.route('/delete/:id').delete(UserController.delete);
router.route('/logout').post(auth, UserController.logout);
router.route('/follow').post(auth, UserController.FollowSomeOne);
router.route('/unfollow').post(auth, UserController.UnfollowSomeOne);
router.route('/get_followers').get(auth, UserController.getFollowers);
router.route('/add_visit').post(auth, UserController.addVisitor);
router.route('/buy_product').post(auth, UserController.buyProduct);
router.route('/send_gift').post(auth, UserController.sendGift);
router.route('/convert_currence').post(auth, UserController.convertCurrence);

module.exports = router;
