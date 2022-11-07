const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator')
const User = require('../../modles/User')
const Profile = require('../../modles/Profile')
const Post = require('../../modles/Post')
const  gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const auth = require('../../middleware/auth');


router.get('/', (req,res) => res.send('Users route'));

//route     POST api/users
//desc      Creat a user
//access    Public
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

//route     DELETE api/users
//desc      Remove a user and his profile
//access    Public
router.delete('/', auth, async(req,res) => {
    try {
        
        //remove user
        const user = await User.findOne({_id: req.user.id})

        if(!user)  return res.status(400).json({msg: 'there is no user'});
        await Post.deleteMany({user:req.user.id})
        await Profile.findOneAndRemove({user: req.user.id}) 
        await User.findOneAndRemove({_id: req.user.id})
        
        res.json({msg: 'User removed'})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;