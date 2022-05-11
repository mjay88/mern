//define all of our auth routes here
const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const bycrypt = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
const validateRegisterInput = require("../validation/registerValidation");
// const jwt = require("jsonwebtoken");
// const requiresAuth = require("../middleware/permissions");

//@route GET /api/auth/test
//@desc test the auth route
//@access Public , private means you need to be authorized
router.get("/test", (req, res) => {
  res.send("Auth route working!");
});

//@route POST /api/auth/register
//@desc Create a new user
//@access Public

router.post("/register", async (req, res) => {
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    //check for existing user via email,
    const existingEmail = await User.findOne({
        // case sensitive regex
      email: new RegExp("^" + req.body.email + "$", "i"),
    });

    if (existingEmail) {
      return res
        .status(400)
        .json({ error: "There is already a user with this email!" });
    }
    //hash the password w/ bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    //create a new user
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    //save the user to the database, add cookie upon register
    const savedUser = await newUser.save();
  
//     //return the new user
    return res.json(savedUser);
  } catch (err) {
    //error here
    console.log(err);
    //internal server error
    res.status(500).send(err.message);
  }
});

// //@route  Post/api/auth/loggin
// //@desc Login user and return a access token
// //@access Public

// router.post("/login", async (req, res) => {
//   try {
//     //check for the user
//     const user = await User.findOne({
//       //check if email already exists in database
//       email: new RegExp("^" + req.body.email + "$", "i"),
//     });
//     if (!user) {
//       return res.status(400).json({ error: "login credentials invalid" });
//     }
//     //if there is a user check password, passwordMatch is boolean
//     const passwordMatch = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!passwordMatch) {
//       return res.status(400).json({ error: "login credentials invalid" });
//     }

//     const payload = { userId: user._id };

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "7d"
//     });

//     res.cookie("access-token", token, {

//       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//       httpOnly : true,
//       secure: process.env.NODE_ENV === "production"
//     });

//    const userToReturn = { ...user._doc};
//    delete userToReturn.password;
//    return res.json({
//      token: token,
//      user: userToReturn,
//    });

//   } catch (err) {
//     console.log(err);

//     return res.status(500).send(err.message);
//   }
// });



// //@route  GET/api/auth/current
// //@desc return currently authed user
// //@access private

// router.get("/current", requiresAuth, (req, res) => {
//   if(!req.user){
//     return res.status(401).send("Unauthorized");
//   }
//   return res.json(req.user);
// });
 

// //@route  PUT/api/auth/logout
// //@desc log out user and clear cookie
// //@access private

// router.put("/logout", requiresAuth, async(req, res) => {
//   try{
//      res.clearCookie("access-token")
//      return res.json({success : true})
//   }
//   catch (err) {
//     console.log(err);

//     return res.status(500).send(err.message);
//   }
 

module.exports = router;
