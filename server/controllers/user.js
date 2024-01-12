const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../models/user.js')

exports.signup = async(req,res)=>{

    try{
        const {username, email, password} = req.body;
        const usernameCheck = await User.findOne({username: username})
        if(usernameCheck){
            return res.status(401).json({
                "message" : "username are already used",
            })

        }

        const emailCheck = await User.findOne({email: email})
        if(emailCheck){
            return res.status(401).json({
                "message" : "email are already used",
            })

        }
        const cryptedPassword = await bcrypt.hash(password, 12)
        const user = await new User({
            username,
            password : cryptedPassword,
            email: email
        }).save();

        return res.status(200).json({
            "message" : "New user created successfully",
            user
        })

       


    }catch(error){
        res.status(500).json({
            "message" : "Internal Server Problem"
        })

    }
  

}

exports.signin = async(req,res)=> {
    try{
        const {email, password} = req.body;
        const validUser = await User.findOne({email: email});
        if(!validUser){
            return res.status(401).json({
                message: "Email is not found"
            })
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword){
            return res.status(401).json({
                message: "Incorrect Password"
            })
        } 

        const token = jwt.sign({id: validUser._id}, process.env.SECRET_KEY)

        return res.status(200).json({
            email: validUser.email,
            username: validUser.username,
            token: token
        })

    }catch(error){

    }
}