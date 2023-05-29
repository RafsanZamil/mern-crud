const express = require("express");
const app = express();
const cors =require("cors");
const userRouter = require("./routes/user.route")

const bcrypt = require("bcrypt");
const saltRounds= 10;
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("./config/db");

app.use (cors());
app.use(express.urlencoded({extended:true}));
app.use (express.json());
app.use(passport.initialize());

require("./config/passport");

app.use ("/api/user", userRouter);

// api/users: GET
// api/users/:id :GET
// api/users/:POST
// api/users/:id : PATCH
// api/users/:id : DELETE



    

// home route
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/./views/index.html");
});


// register route
app.post("/register", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) return res.status(400).send("User already exists");
      bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        const newUser = new User({
          username: req.body.username,
          password: hash,
        });
        await newUser
          .save()
          .then((user) => {
            res.send({
              success: true,
              message: "User is created Successfully",
              user: {
                id: user._id,
                username: user.username,
              },
            });
          })
          .catch((error) => {
            res.send({
              success: false,
              message: "User is not created",
              error: error,
            });
          });
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // login route
  app.post("/login", async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User is not found",
      });
    }
  
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password",
      });
    }
  
    const payload = {
      id: user._id,
      username: user.username,
    };
  
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: 86400,
    });
  
    return res.status(200).send({
      success: true,
      message: "User is logged in successfully",
      token: "Bearer " + token,
    });
  });
  
  // profile route
  app.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    function (req, res) {
      return res.status(200).send({
        success: true,
        user: {
          id: req.user._id,
          username: req.user.username,
        },
      });
    }
  );
  

// route not found
app.use ((req,res,next)=>{
    res.status(404).json({
        message:"Route not found",
    });
});


// handling server error

app.use ((err,req,res,next)=>{
    res.status(500).json({
        message:"something broke",
    });
});






module.exports= app;