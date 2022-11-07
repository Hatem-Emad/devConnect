const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../modles/Post')
const Profile = require('../../modles/Profile');
const User = require('../../modles/User')

// route    GET api/profile/me
// desc     Get current user's profile
// access   Private
router.get('/me', auth, async(req,res) => {
    
    try {
        const profile = await Profile
                            .findOne({user: req.user.id})
                            .populate('user',['name', 'avatar']);

        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'})
        }
        res.json(profile)
        // console.log(profile.id)
        // console.log(req)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

// route    POST api/profile
// desc     Create or update user's profile
// access   Private
router.post('/', auth, async(req,res) => {

    const {location, state, skills, bio, githubusername} = req.body;
    const profileFields = {}
    profileFields.user = req.user.id;
    if(location) profileFields.location = location
    if(state) profileFields.state = state
    if(skills) profileFields.skills = skills
    if(bio) profileFields.bio = bio
    if(githubusername) profileFields.githubusername = githubusername

    try {
        let profile = await Profile.findOne({user: req.user.id})
        
        if(profile){
            //update
            profile  = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            );
            
            return res.json(profile);
        }

        //create
        profile = new Profile(profileFields)
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
    
})

// route    GET api/profile
// desc     Get all profiles
// access   Public
router.get('/', async(req,res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

// route    GET api/profile/user/:user_id
// desc     Get profile by user id
// access   Public
router.get('/user/:user_id', async(req,res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) return res.status(400).json({msg: 'There is no profile for this user'});

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

// route    DELETE api/profile
// desc     Delete profile
// access   Private
router.delete('/', auth, async(req,res) => {
    try {
        // remove posts
        await Post.deleteMany({user: req.user.id})

        // remove profile
        const profile = await Profile.findOne({user: req.user.id});
        if(!profile) return res.status(400).json({msg:'There is no profile for this user'})
        
        await Profile.findOneAndRemove({id: profile.id})

        res.json({msg: 'Profile removed'})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;