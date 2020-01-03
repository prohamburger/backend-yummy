const express = require('express')
const app = express()
const mongoose = require ('mongoose')
const bodyParse = require('body-parser')
const User = require('./models/user');
const bcrypt = require('bcrypt')
require('dotenv').config();

app.use(bodyParse.json());


// import routes
const recipesRoute = require('./routes/recipes');
const categoryRoute = require('./routes/category');
const userRoute = require('./routes/user');

app.use('/recipes', recipesRoute);
app.use('/category', categoryRoute);
app.use('/user', userRoute);

app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const user = new User({username: req.body.username, password: hashedPassword})
  try {
    const username = req.body.username
    const password = req.body.password
    if (username.length >= 4)
      if(password.length >= 4)
      User.find({username: req.body.username})
        .then(data => {
          if (data.length !== 0) {
            res.status(400).send({
              message: 'Đã trùng!'
           });
          }
          else {
            user.save()
            res.json({ message: 'success', user })
          }
        })
      else {
        res.status(400).send({message: 'Password tối thiểu 4 ký tự'})
      }
    else {
      res.status(400).send({message: 'Username tối thiểu 4 ký tự'})
    }
  }
  catch (err) {
      res.json({
          message: err
      });
  }
});

//connect DB
mongoose.connect (
    'mongodb://localhost:27017/yummy',
        { useUnifieordTopology: true },
        () => console.log('connected to DB'))
app.listen(3000)




