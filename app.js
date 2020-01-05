const express = require('express')
const app = express()
const mongoose = require ('mongoose')
const bodyParse = require('body-parser')
const User = require('./models/user');
const bcrypt = require('bcrypt')
require('dotenv').config()

var port = process.env.PORT || 3000

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
  const username = req.body.username
  const password = req.body.password
  const vegetarian = req.body.vegetarian

  const user = new User({username: username, password: hashedPassword, vegetarian: vegetarian})
  try {
    const reg = RegExp(/[^A-Za-z0-9]/, 'i')
    let valid = !reg.test(username)

    if (username.length >= 4 && valid){
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
    }
    else {
      if (!valid) {
        res.status(400).send({message: 'Tên tài khoản không hợp lệ'})
      } else {
        res.status(400).send({message: 'Tên tài khoản tối thiểu 4 ký tự'})
      }
    }
  }
  catch (err) {
      res.json({
          message: err
      });
  }
});

//connect DB
mongoose.connect (`${process.env.MONGO_URI}`, { useNewUrlParser: true }, () => console.log('connected to DB'))
app.listen(port)




