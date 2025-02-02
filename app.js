if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
console.log(process.env.SECRET) 


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const MongoStore = require('connect-mongo');


const AtlasDb_url = process.env.ATLASDB_URL

async function main() {
  try {
    await mongoose.connect(AtlasDb_url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
}

main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl : AtlasDb_url,
  crypto : {
secret:process.env.SECRET
  },
   touchAfter:24 * 3600,
});

store.on("error" , ()=>{
  console.log("Error occured in mongo session store", err);

});

const sessionOption = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie :{
    expires :Date.now() + 7 * 24 *60 * 60 *1000,
    maxAge   :  7 * 24 *60 * 60 *1000 ,
    httpOnly : true,
  }
}



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

// app.get("/demouser", async(req,res)=>{
//   let fakeUser = new User({
//     email:"sarthak25@gmail.com",
//     username:"sarthak25",
//   });
//   let registeredUser = await User.register(fakeUser , "helloworld")
//   res.send(registeredUser);
// })


app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found !!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went Wrong !!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("server is running on port 8080");
});