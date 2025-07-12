//------------------------BASIC EXPRESS SETUP

// 01 Bringing in express
const express = require('express');
const app = express() ; //initializing app variable with express

//03endpoint to test if server is running
// app.get('/'): This defines a route handler for an HTTP GET request to the root URL (/).Example: If your server is running on http://localhost:5000, visiting that in the browser will trigger this route.
// (req, res) => { ... } : This is an arrow function. req is the request object. res is the response object used to send data back to the client.
// res.send('API is running')
// This sends the response back to the client (browser/Postman/React frontend) so you see something when you visit localhost:5000/.
app.get('/',(req,res)=>res.send('API Running'));


//02 taking the app variable and we want to listen
const PORT = process.env.PORT || 5000; //if process.env.PORT is not defined, use 5000(locally)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //callback function to log the message when server starts
// starts your Express server, and when it’s successfully running, it calls your callback function to log: Server running on port 500

//------------------------MIDDLEWARES
//04
const connectDB = require('./config/db'); //importing the connectDB function from db.js
//connect Database
connectDB(); //calling the connectDB function to connect to MongoDB


//Init Middleware
app.use (express.json({ extended: false }));
 //This line allows your Express app to parse incoming JSON requests.
 //It’s essential for handling POST requests where the body contains JSON data. 
 // The extended: false option means you’re using the classic body-parser library, which is sufficient for most cases. If you need to handle nested objects in the request body, you might set it to true.


//------------------------ROUTES
//05 Registering / Mounting the Routes
//app.use Use it to Mount Route Files
app.use('/api/users', require('./routes/api/users'));  
app.use('/api/auth', require('./routes/api/auth'));  
app.use('/api/profile', require('./routes/api/profile'));  
app.use('/api/posts', require('./routes/api/posts'));  
