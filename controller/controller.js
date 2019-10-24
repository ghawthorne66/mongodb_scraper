
const request = require("request");
const cheerio = require("cheerio");
const axios = require ("axios")
const Comment = require("../models/Comment.js");
const Article = require("../models/Article.js");

module.exports = app => {
  app.get("/", function(req, res) {
  res.redirect("/articles");
});

app.get("/scrape", function(req, res) {
    axios
    .get("http://www.theverge.com")
    .then(html => {
      var $ = cheerio.load(html.data);
      var titlesArray = [];

      $(".c-entry-box--compact__title").each(function(i, element) {
        var result = {};

        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        if (result.title !== "" && result.link !== "") {
          if (titlesArray.indexOf(result.title) == -1) {
            titlesArray.push(result.title);

            Article.count({ title: result.title }, function(err, test) {
              if (test === 0) {
                var entry = new Article(result);

                entry.save(function(err, doc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(doc);
                  }
                });
              }
            });
          } else {
            console.log("Article already exists.");
          }
        } else {
          console.log("Not saved to DB, missing data");
        }
      });
      res.redirect("/");
  })
  .catch(error => {
    res.status(500).json(error)
  })
  });

app.get("/articles", function(req, res) {
  Article.find()
    .sort({ _id: -1 })
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        var artcl = { article: doc };
        res.render("index", artcl);
      }
    });
});

app.get("/articles-json", function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

app.get("/clearAll", function(req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed all articles");
    }
  });
  res.redirect("/articles-json");
});

app.get("/readArticle/:id", function(req, res) {
  var articleId = req.params.id;
  var hbsObj = {
    article: [],
    body: []
  };

  Article.findOne({ _id: articleId })
    .populate("comment")
    .exec(function(err, doc) {
      if (err) {
        console.log("Error: " + err);
      } else {
        hbsObj.article = doc;
        var link = doc.link;
        request(link, function(error, response, html) {
          var $ = cheerio.load(html);

          $(".l-col__main").each(function(i, element) {
            hbsObj.body = $(this)
              .children(".c-entry-content")
              .children("p")
              .text();

            res.render("article", hbsObj);
            return false;
          });
        });
      }
    });
});
app.post("/comment/:id", function(req, res) {
  var user = req.body.name;
  var content = req.body.comment;
  var articleId = req.params.id;

  var commentObj = {
    name: user,
    body: content
  };

  var newComment = new Comment(commentObj);

  newComment.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);

      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: doc._id } },
        { new: true }
      ).exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/readArticle/" + articleId);
        }
      });
    }
  });
});

}