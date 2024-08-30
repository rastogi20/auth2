const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoute = require('./routes/user');
const { checkForAuthenticationCookie } = require('./middleware/auth');

// Connect to MongoDB
mongoose.connect('mongodb+srv://rastogisahil20:TgKN1rF9TDVx9f4m@cluster0.3cojm.mongodb.net/mydb')
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.error('mongodb connection error:', err));

// Middleware configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

const mongoStore = MongoStore.create({
  mongoUrl: 'mongodb+srv://rastogisahil20:TgKN1rF9TDVx9f4m@cluster0.3cojm.mongodb.net/mydb'
});

app.use(session({
  secret: "$uperMan@123",
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(checkForAuthenticationCookie('token'));
app.use('/user', userRoute);

app.post('/user/logout', (req, res) => {
  if (!req.session || !req.session.authenticated) {
    return res.status(401).send('Not authenticated');
  }
  
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.clearCookie('connect.sid'); 
    res.status(200).send('Logout successful');
  });
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));