const User = require('../model/user.model.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// register Controller
const registerUser = async (req, res)=> {
    try {
        const { username, email, password, role} = req.body;

        // check if user already exists in the database or not

        const checkExistingUser = await User.findOne({$or: [{username}, {email}]})
        if(checkExistingUser){
            res.status(400).json({
                success: false,
                message: "Username or email already exixts try another username or email"
            })
        }else{
                // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user ans store in database
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        await newUser.save()

        if(newUser){
            res.status(201).json({
                success: true,
                message: "user registed successfully"
            })
        }else {
            res.status(400).json({
                success: false,
                message: "unable to register user try again"
            })
        }}

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occur while registering user"
        })        
    }
}

// login User

const loginUser = async (req, res)=>{
    try {
        const {username, password} = req.body;
        // if user doesn't exist in database 

        const existingUser = await User.findOne({username});

        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: 'Invaled credentials'
            })
        }

        const isPasswordmatch = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordmatch){
            return res.status(400).json({
                success: false,
                message: "Invaled password"
            })
        }

        // create user token
        const accessToken = jwt.sign({
            userId: existingUser._id,
            username: existingUser.username,
            role: existingUser.role
        }, process.env.JWT_SECRET_KEY,
        {expiresIn: '15m'})

        res.status(200).json({
            success: true,
            message: "Logged in success",
            accessToken
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured! Please try again",
        })
    }
}

const changePassword = async (req, res)=> {
    try {
        const userId = req.info.userId;

        // extract old and new password
        const {oldPassword, newPassword} = req.body;

        // find the current use which user want to change the password

        const user = await User.findById(userId)

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        // check if old password correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Old is not correct please try again"
            })
        }

        // hash the password now

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        //update user password
        const updatedPassword = await User.updateOne({_id: user}, {$set: {password: hashedPassword}})

        console.log(updatedPassword)
        // user.password = hashedPassword
        // await user.save()

        if(updatedPassword){
            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            })
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured! Please try again",
        })
    }
}

module.exports = { registerUser, loginUser, changePassword}