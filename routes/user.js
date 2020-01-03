const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt')
const Recipes = require('../models/recipes');

router.use(async function (req, res, next) {
  let reqAuth = req.get('Authorization').split(' ')

  let Auth = Buffer.from(reqAuth[1], 'base64').toString()

  let userAuth = Auth.split(':');

  const user2 = new User({
      username: userAuth[0],
      password: userAuth[1],
  });
  try {
    const user = await User.find({username: user2.username})

    if(await bcrypt.compare(user2.password, user[0].password)) {
      next()
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
})

router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
});
router.post('/login', async (req, res) => {
  let reqAuth = req.get('Authorization').split(' ')

  let Auth = Buffer.from(reqAuth[1], 'base64').toString()

  let userAuth = Auth.split(':');

  const user2 = new User({
      username: userAuth[0],
      password: userAuth[1],
  });

  try {
    let user = await User.find({username: user2.username})
    res.send({user, state: 'Success'})
  } catch {
    res.status(500).send()
  }
})

router.put('/favourite', async (req, res) => {
  let reqAuth = req.get('Authorization').split(' ')

  let Auth = Buffer.from(reqAuth[1], 'base64').toString()

  let userAuth = Auth.split(':');

  const user2 = new User({
      username: userAuth[0],
      password: userAuth[1],
  });
  let user = await User.find({username: user2.username})

  if (!user[0].favourite.includes(req.body.favourite)) {
    user[0].favourite.push(req.body.favourite)
  }
  else {
    const temp = user[0].favourite.indexOf(req.body.favourite)
    user[0].favourite.splice(temp, 1)
  }

  try {
      const saveUser = await user[0].save();
      res.json(saveUser);
  }
  catch (err) {
      res.json({
          message: err
      });
  }
})

module.exports = router;
