const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../modles/User')
const  gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

router.get('/', (req,res) => res.send('Users route'));

router.post('/',
[
    check('name', 'Name is required')
    .not().isEmpty(),
    check('email', 'please enter a valid email').isEmail(),
    check('password', 'please enter a password with at least 6 chars').isLength({min: 6})
], 
async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(user){
           return res.status(400).json({errors: [{msg: 'User already exits'}]});
        }

        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        
        await user.save();

        const payload = {
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'), 
            {expiresIn: 360000},
            (err, token) => {
                if(err) throw err;
                res.json({token});
            }
        );

        // res.send('User registered');

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
  
});

module.exports = router;