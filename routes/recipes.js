const express = require('express');
const router = express.Router();
const Recipes = require('../models/recipes');
const mongoose = require('mongoose');

//get back
router.get('/', paginatedResults(Recipes), async (req, res) => {
    try {
      res.json(res.paginatedResults)
    } catch (err) {
        res.json({ message: err });
    }
});
router.get('/:categoryid', (req, res) => {
  Recipes.find({category_id: req.params.categoryid})
  .then(data =>{
    if (!data) { return res.status(404).end(); }

    return res.status(200).json(data)
  })
  .catch (err => next(err))

});
router.get('/recipe/:recipeId', (req, res) => {
  Recipes.find({_id: req.params.recipeId})
  .then(data =>{
    if (!data) { return res.status(404).end(); }

    return res.status(200).json(data[0])
  })
  .catch (err => next(err))

});
router.get('/search/:keyword', (req, res) => {
  const regex = req.params.keyword
  Recipes.find({title: new RegExp(regex, 'i')})
  .then(data => {
    if (!data) {return res.status(404).end(); }
    return res.status(200).json(data)
  })
  .catch (err => next(err))
})

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await model.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

//submit a post
router.post('/', async (req, res) => {
    const recipes = new Recipes({
        title: req.body.title,
        category_id: req.body.categoryId,
        photo_url: req.body.photo_url,
        time: req.body.time,
        ingredients: req.body.ingredients,
        step: req.body.step,
    });
    try {
        const saveRecipes = await recipes.save();
        res.json(saveRecipes);
    }
    catch (err) {
        res.json({
            message: err
        });
    }
});

//specific post
// router.get('/:postId', async (req, res) => {
//     try {
//         const ppost = await Post.findById(req.params.postId);
//         res.json(post);
//     } catch (err) {
//         res.json({ message: err });
//     }
// })

// //delete
// router.delete('/:postId', async (req, res) => {
//     try {
//         const removePost = await Post.remove({ _id: req.params.postId })
//         res.json(removePost);
//     } catch (err) {
//         res.json({ message: err });
//     }
// });

// //update
// router.patch('/:postId', async (req, res) => {
//     try {
//         const updatedPost = await Post.updateOne(
//             { _id: req.params.postId },
//             {
//                 $set: { title: req.body.title }
//             });
//         res.json(updatedPost);
//     }
//     catch (err) {
//         res.json({ message: err })
//     }

// })
module.exports = router;
