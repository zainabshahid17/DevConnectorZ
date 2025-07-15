//Handle getting a json webtoken for authentication

const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); // Importing the auth middleware
const User = require('../../models/User'); // Importing the User model
const { check, validationResult } = require('express-validator'); // Importing express-validator for input validation
const config = require('config'); // Importing config to get the jwtSecret
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for creating tokens
const bcrypt = require('bcryptjs'); // Importing bcrypt for password hashing

//@route   GET api/auth
//@desc    Test route
//@access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Find the user by ID and exclude the password field
        res.json(user); // Send the user data as a response
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
);

//@route   POST api/auth
//@desc    Authenticate user & get token
//@access  Public

// 01 --- Created our post route here, we made sure we have all our validation so the user has to enter the correct data when they make the request. 
router.post('/',
    [check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
    ],
    async (req, res) => {

        //to check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        //02 --- If there are no validation errors, we can proceed with the user registration logic

        //destructuring the request body to get name, email and password
        const { email, password } = req.body;

        try {

            // See if no user
            let user = await User.findOne({ email }); //findOne is a mongoose method to find a single document in the database
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            // Check if password matches
            const isMatch = await bcrypt.compare(password, user.password); //compare the password entered by the user with the hashed password in the database
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
            }


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
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })  //else return token
                }
            );

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;