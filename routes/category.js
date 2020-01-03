const express = require('express');
const router = express.Router();
const Category = require('../models/category');

//get back
router.get('/', async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        photo_url: req.body.photo_url,
    });
    try {
        const saveCategory = await category.save();
        res.json(saveCategory);
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
