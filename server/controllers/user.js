const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../models/user.js')

exports.signup = async(req,res)=>{

    try{
        const {username, email, password} = req.body;
        const cryptedPassword = await bcrypt.hash(password, 12)
        const user = await new User({
            username,
            password : cryptedPassword,
            email: email
        }).save();

        res.send(user);

    }catch(error){
        res.status(500).json({
            message: error.message
        })

    }
  

}