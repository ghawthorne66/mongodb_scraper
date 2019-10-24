const mongoose = require('mongoose')

// Save a reference to the Schema constructor
const Schema = mongoose.Schema

// Define a schema for an Article
const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
})

// This creates our model from the above schema, using mongoose's model method
const Comment = mongoose.model('Comment', CommentSchema)

// Export the Article model
module.exports = Comment