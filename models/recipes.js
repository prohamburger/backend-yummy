const mongoose = require('mongoose');


const recipesSchema = mongoose.Schema({
    // recipesId:{
    //     type:String,
    //     required: true
    // },
    categoryId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: Date.now
    },
    photo_url:{
        type:String,
        required: true
    },
    time: {
        type:Number,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    step: {
        type: Array,
        required: true
    },
});

module.exports = mongoose.model('Recipes', recipesSchema);

