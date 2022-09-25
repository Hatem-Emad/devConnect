const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator')

router.get('/', (req,res) => res.send('Users route'));

router.post('/',
[
    check('name', 'Name is required')
    .not().isEmpty(),
    check('email', 'please enter a valid email').isEmail(),
    check('password', 'please enter a password with at least 6 chars').isLength({min: 6})
], 
(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    res.send('User route');
});

module.exports = router;