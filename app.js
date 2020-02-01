const express = require('express')
const port = 8000
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

//Init app
const app = express()

//Setting Up database name shopify
const mongoose = require('mongoose');
// const product = require('./models/productschema');
const db = mongoose.connect('mongodb://localhost:27017/expresspro1', {useNewUrlParser: true, useUnifiedTopology: true});

if (db) {
	console.log('Database connected')
}

//Passpost session
app.use(require('express-session')({
 secret : 'Today is',
 resave : false,
 saveUninitialized : false
}))


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())




//Setting Up Home Route
app.get('/',(req,res)=>{
	console.log('Login Page accessed')
	res.render('index')
})

//Setting Up register page
app.get('/register',(req,res)=>{
	console.log('Register Page accessed')
	res.render('register');
})

// Admin page
//Setting Up register page
app.get('/admin',isLoggedIn,(req,res)=>{
	console.log('Admin Page accessed')
	res.render('admin');
})


//bodyparser middleware 
app.use(bodyParser.urlencoded({extended : true}));

//Setting Up view engine ejs
app.set('view engine' , 'ejs');


//Sign Up logic 
app.post('/register' , (req,res)=>{
	var newUser = new User({username : req.body.username});
	User.register(newUser , req.body.password , (err,user)=>{
		if (err) {
			console.log('err')
			res.redirect('/register')
		}
		else{
			passport.authenticate('local')(req,res,()=>{
				res.redirect('/');
				console.log(user)
			})
		}
	})
})


// Handling Login setup
app.post('/login',passport.authenticate('local',{
	successRedirect : '/admin',
	failureRedirect : '/'
}),(req,res)=>{
	console.log('Login Happens Here')
}
);

//Logout
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/')
}


//Logout Route
app.post('/logout',(req,res)=>{
  req.logout();
  console.log('Logout')
  res.redirect('/');
});


//Setting up Ports
app.listen(port , ()=>console.log("app listening on port 3000"))
