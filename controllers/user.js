const User = require("../models/user.js");


module.exports.signupFormRender = (req,res) =>{
    res.render("users/signup.ejs");
};

module.exports.postingSignupForm = async (req,res) =>{
  try{
      let {username , email , password} = req.body;
    const newUser = new User({email , username});
    const registerUser = await User.register(newUser,password);
     req.login(registerUser,(err) =>{
      if(err){
        return next(err);
      }
      req.flash("success","Welcome to Wanderlust");
      res.redirect("/listings");
     });  
  } catch(e) {
    req.flash("error",e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginform = (req,res) =>{
    res.render("users/login.ejs");
};

module.exports.postingLoginForm = async (req,res) =>{
    req.flash("success","Welcome back to Wanderlust");
    //yeh condition likhne ka tarika hai
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next) =>{
 req.logout((err) =>{
  if(err){
    return next(err);
  }
  req.flash("success","you are logged out");
  res.redirect("/listings");
 });
};