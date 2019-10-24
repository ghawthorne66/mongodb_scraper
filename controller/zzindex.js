const axios = require('axios')
const cheerio = require('cheerio')
const db = require('../model')

module.exports = app => {
  app.get('/', (req, res) => {
    db.Article.find()
      .sort({ _id: -1 })
      .limit(20)
      .populate('comments')
      .then(dbArticles => res.render('home', { articles: dbArticles }))
      .catch(error => res.status(500).json(error))
  })

  app.get('/scrape', (req, res) => {
    const hackerRankUrl = 'https://hackernoon.com/tagged/javascript'
    axios
      .get(hackerRankUrl)
      .then(hackerRankResponse => {
        const $ = cheerio.load(hackerRankResponse.data)
        $('.title > a').each((i, element) => {
          db.Article.create({
            title: $(element).text(),
            url: 'https://hackernoon.com' + $(element).attr('href')
          }).catch(console.log)
        })

        res.send('done scraping')
      })
      .catch(error => {
        res.status(500).json(error)
      })
  })

  app.post('/articles/:articleId/comments', (req, res) => {
    const { articleId } = req.params
    // create a new note
    db.Comment.create(req.body)
      .then(dbComment => {
        // add the note to the article for the given articleId
        return db.Article.findByIdAndUpdate(articleId, {
          $push: { comments: dbComment }
        })
      })
      .then(() => {
        // send a response
        res.redirect('/')
      })
      .catch(error => {
        // handle errors
        res.status(400).json(error)
      })
  })

  // route to delete all the comments in case someone adds
  // something nasty
  app.delete('/comment', (req, res) => {
    db.Comment.deleteMany({})
      .then(({ deletedCount }) => {
        res.json({ deletedCount })
      })
      .catch(error => {
        console.log(error)
        res.status(500).send('An unexpected error occurred.')
      })
  })
}