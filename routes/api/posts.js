const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../modles/User');
const Post = require('../../modles/Post');

//route     POST api/posts
//desc      Create a post
//access    Private
router.post('/', 
    [auth,
        [
            check('text', 'text is required').not().isEmpty(),
        ]
    
    ],
    async (req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post ({
                text: req.body.text,
                user: req.user.id,
                name: user.name,
                avatar: user.avatar
            })

            const post = await newPost.save()

            res.json(post);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error')
        }
})

//route     GET api/posts
//desc      Get all posts
//access    Private
router.get('/', auth, async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password')
        const posts = await Post.find({user}).sort({date:-1})
        res.json(posts);

    } catch (error) {
        console.error(error.message).json('Server Error')
    }
});

//route     GET api/posts/:id
//desc      Get a post by id
//access    Private
router.get('/:id', auth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

         //check post
        if(!post) return res.status(404).json({msg: 'Post not found'});

        //Check user
        if(post.user.toString() !== req.user.id)  return res.status(401).json({msg: 'user not authorized'})
        
        res.json(post);

    } catch (error) {
        console.error(error.message)
        if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:'Post not found'})
        }
        res.status(500).send('Server Error')
    }
});

//route     DELETE api/posts
//desc      Delete a post by id
//access    Private
router.delete('/:id',auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        //check post
        if(!post) return res.status(404).json({msg: 'Post not found'});

        //Check user
        if(post.user.toString() !== req.user.id) return res.status(401).json({msg: 'user not authorized'})
       
        await post.remove();

        res.json({msg: 'Post removed'})

    } catch (error) {
        console.error(error.message).json('Server Error')
    }
})

//route     PUT api/posts/like/:id
//desc      Like a post
//access    Private
router.put('/like/:id', auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

         //Check post
        if(!post) return res.status(404).json({msg: 'Post not found'});

        //Check user
        if(post.user.toString() !== req.user.id)  return res.status(401).json({msg: 'user not authorized'})
        
        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
           post.likes.shift({user: req.user.id});
           res.json({msg:'unliked the post'})
            // return res.status(400).json({msg: 'This post has already been liked'})
        }else {
            post.likes.unshift({user: req.user.id});
            res.json(post.likes);
        }
        // console.log(post.likes.filter(like => like.user.toString() === req.user.id).length>0)
        await post.save();
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

//route     POST api/posts/comment/:id
//desc      Add comment on a post
//access    Private
router.post('/comment/:id', 
    [auth,
        [
            check('text', 'text is required').not().isEmpty(),
        ]
    ],
    async (req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const post = await Post.findById(req.params.id);
            const user = await User.findById(req.user.id).select('-password');

            //check post
            if(!post) return res.status(404).json({msg: 'Post not found'});

            //Check user
            if(post.user.toString() !== req.user.id) return res.status(401).json({msg: 'user not authorized'})

            const newComment = {
                text: req.body.text,
                user: req.user.id,
                name: user.name,
                avatar: user.avatar
            };

            post.comments.unshift(newComment);

            await post.save()

            res.json(post.comments);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error')
        }
});

//route     DELETE api/posts/comment/:id/comment_id
//desc      Delete a comment by id
//access    Private
router.delete('/comment/:id/:comment_id', auth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        //check comment
        if(!comment) return res.status(404).json({msg: 'Comment not found'});

        //Check user
        if(comment.user.toString() !== req.user.id) return res.status(401).json({msg: 'user not authorized'})
       
        const removeIndex = post.comments
            .map(comment => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save()

        res.json({msg: 'Comment removed'})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;