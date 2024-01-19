const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const User = require('../models/user.js')

exports.signup = async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username: username })
        if (usernameCheck) {
            return res.status(401).json({
                "message": "username are already used",
            })

        }

        const emailCheck = await User.findOne({ email: email })
        if (emailCheck) {
            return res.status(401).json({
                "message": "email are already used",
            })

        }
        const cryptedPassword = await bcrypt.hash(password, 12)
        const user = await new User({
            id,
            username,
            password: cryptedPassword,
            email: email
        }).save();

        return res.status(200).json({
            "message": "New user created successfully",
            user
        })




    } catch (error) {
        res.status(500).json({
            "message": "Internal Server Problem"
        })

    }


}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validUser = await User.findOne({ email: email });
        if (!validUser) {
            return res.status(401).json({
                message: "Email is not found"
            })
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(401).json({
                message: "Incorrect Password"
            })
        }

        const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY)

        return res.status(200).json({
            id: validUser._id,
            email: validUser.email,
            username: validUser.username,
            avatar: validUser.avatar,
            token: token
        })

    } catch (error) {
        res.status(500).json({
            "message": "Internal Server Problem"
        })

    }
}

exports.google = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY)
            const { password: pass, ...rest } = user._doc;

            return res.status(200).json({
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                token
            })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword = bcrypt.hashSync(generatedPassword, 10);

            const newUser = await new User({
                username: req.body.name.split("").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashPassword,
                avatar: req.body.photo
            }).save();

            const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);
            return res.status(200).json({
                email: newUser.email,
                username: newUser.username,
                avatar: newUser.avatar,
                token
            })
        }



    } catch (error) {
        res.status(500).json({
            "message": "Internal Server Problem"
        })
    }
}

exports.updateUser = async (req, res) => {
    try {

        let tmp = req.header("Authorization");

        const token = tmp ? tmp.slice(7, tmp.length) : "";

        const userId = req.user.id;
        
        const { username, email, password, avatar } = req.body;
        let cryptedPassword;
        if(password){
            cryptedPassword = await bcrypt.hash(password, 12)
        }
        
        const updateUser = await User.findByIdAndUpdate(userId, { username, email, avatar, password:cryptedPassword }, { new: true })
        
        console.log(updateUser);

        if (!updateUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            id: updateUser._id,
            email: updateUser.email,
            username: updateUser.username,
            avatar: updateUser.avatar,
            token: token,
            message: 'User information updated'
        }) 

    


    } catch (error) {
        res.status(500).json({
            "message": "Internal Server Problem"
        })

    }
}