const express = require('express'); 
const router = express.Router();
const professionController = require('../controllers/professionController');
const auth = require('../config/authorization');


router.route('/get_professions')
    .get(professionController.getProfessions)

router.route('/get_profession/:profession_id')
    .get(professionController.getProfession)

    
router.use(auth.adminAuth);
router.route('/create_profession')
    .post(professionController.createProfession)



module.exports = router