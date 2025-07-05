// 01 Bringing in express
const express = require('express');
const app = express() ; //initializing app variable with express
//endpoint to test if server is running
app.get('/',(req,res)=>res.send('API Running')  );
//02 taking the app variable and we want to listen
const PORT = process.env.PORT || 5000; //if process.env.PORT is not defined, use 5000(locally)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //callback function to log the message when server starts
