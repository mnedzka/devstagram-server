const router = require("express").Router();
const db = require("../db");

//* FOR GETTING ALL ALL POSTS
router.route("/").get(async (req, res) => {
  try {
    const posts = await db.query("SELECT * FROM posts ORDER BY createdat DESC");
    res.status(200).json({
      status: "Success",
      numOfResults: posts.rows.length,
      data: {
        posts: posts.rows,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      data: {
        message: err.message,
      },
    });
  }
});

//* POSTS FROM ONE SUBREDDIT
router.route("/subreddit/:subreddits").get(async (req, res) => {
  const subreddits = req.params.subreddits;
  console.log(subreddits);

  try {
    const posts = await db.query(
      "SELECT * FROM posts WHERE subreddit ILIKE $1 ORDER BY createdat DESC",
      [subreddits]
    );
    res.status(200).json({
      status: "Success",
      data: {
        numOfResults: posts.rows.length,
        posts: posts.rows,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Error",
      messageL: err.message,
    });
  }
});

//* ADDING POST
router.route("/add").post(async (req, res) => {
  const userName = req.body.userName;
  const title = req.body.title;
  const content = req.body.content;
  const subreddit = req.body.subreddit;
  const createdAt = new Date();


  try {
    const response = await db.query(
      "INSERT INTO posts(username, title, content, subreddit, createdat) VALUES ($1,$2,$3,$4,$5) returning *",
      [userName, title, content, subreddit, createdAt]
    );

    res.status(200).json({
      status: "Success",
      postID: response.rows[0].postid,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
});

//* GET A SINGLE POST
router.route("/:postID").get(async (req, res) => {
  const postID = req.params.postID;
  try {
    const post = await db.query("SELECT * FROM posts WHERE postid = $1", [
      postID,
    ]);
    res.status(200).json({
      status: "Success",
      data: {
        post: post.rows[0],
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      data: {
        message: err.message,
      },
    });
  }
});

module.exports = router;
