 //Handle adding/registering,etc. users
  //we don't do app.get, app.post rather we use router.get

//--- IMPORTS
 const express = require('express');
 const router = express.Router();
 const { check, validationResult } = require('express-validator'); 
 const User = require('../../models/User'); 
 const gravatar = require('gravatar'); 
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken')
 const config = require('config');
 
 //@route   POST api/users
 //@desc    Register user
 //@access  Public

 // 01 --- Created our post route here, we made sure we have all our validation so the user has to enter the correct data when they make the request. 
 router.post('/', 
    [check('name', 'Name is required').not().isEmpty(), 
     check('email', 'Please include a valid email').isEmail(),
     check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })   
    ],
    async  (req,res)=> {
   
        //to check for validation errors
        const errors = validationResult(req); 
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() }); 
        }
        
        
    //02 --- If there are no validation errors, we can proceed with the user registration logic

        //destructuring the request body to get name, email and password
        const {name,email,password} = req.body; 
        
        try{

            // See if user already exists
            let user = await User.findOne({ email }); //findOne is a mongoose method to find a single document in the database
            if (user){
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }


            // Get users gravatar
            const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm' }); //gravatar is a package that generates a gravatar URL based on the user's email
            
                // Create new user instance, this is how we create a new user in mongoose
                // We are not saving the user to the database yet, we will do that after we encrypt the password
                user = new User({
                    name,
                    email,
                    avatar,
                    password
                });


            // Encrypt password using bcryot
            const salt = await bcrypt.genSalt(10); //generate a salt with 10 rounds
            user.password = await bcrypt.hash (password, salt); //hash the password with the salt
        

            // Save user to the database
            await user.save();


            //Return jsonwebtoken (because when user registers if we want the user to get logged in right away, we need to have a token and these tokens provide access to protected routes)  
                const payload = {
                    user:
                    {
                        id: user.id
                    }
                }

                //sign the token, this is how we create a token in jwt
                jwt.sign(
                    payload,
                    config.get('jwtSecret'), //get the jwtSecret from the config file
                    {expiresIn:36000},
                    (err,token)=> {
                        if(err)throw err; 
                        res.json({token})  //else return token
                    } 
                );    

        }catch(err){
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);
 
 module.exports = router;

