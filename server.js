const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const dbConnection = require('./database')
const MongoStore = require('connect-mongo')(session)
const passport = require('./config/passport');
const app = express()
const PORT = process.env.PORT || 3001
// Route requires
// const user = require('./routes/user')
const routes = require('./routes')
// const tasklist = require ('./routes/api/tasklist')

app.use(bodyParser.json())
// MIDDLEWARE
app.use(morgan('dev'))
app.use(
	bodyParser.urlencoded({
		extended: false
	})
)
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
  }

// Sessions
app.use(
	session({
		secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
		store: new MongoStore({ mongooseConnection: dbConnection }),
		resave: false, //required
		saveUninitialized: false //required
	})
)

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser


// Routes
app.use(routes)
// app.use('/user', user)
// app.use('/jobpost', tasklist)

// Starting Server 
app.listen(PORT, () => {
	console.log(`>>> App listening on PORT: ${PORT}`)
})
