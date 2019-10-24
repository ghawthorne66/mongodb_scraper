const mongoose = require('mongoose')

// Save a reference to the Schema constructor
const Schema = mongoose.Schema

// Define a schema for an Article
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  url: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: myURL => {
      const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + //port
        '(\\?[;&amp;a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      )
      return pattern.test(myURL)
    }
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model('Article', ArticleSchema)

// Export the Article model
module.exports = Article