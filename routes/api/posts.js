// we'll create a posts dot JS because we're gonna have a little forum area where we can add posts, you can like comment things like that. 
 const express = require('express');
 const router = express.Router();

 
 //@route   GET api/post
 //@desc    Test route
 //@access  Public
 router.get('/', (req,res)=>res.send('Posts route'));

 module.exports = router;