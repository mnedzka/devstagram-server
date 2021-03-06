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

//* DELETE POST
router.route('/delete/:postID').delete(async(req, res) => {
  const postID = req.params.postID

  try{
    const deleteLikes = await db.query('DELETE FROM likes WHERE parent_postid = $1', [postID])
    const deleteComments = await db.query('DELETE FROM comments WHERE parent_postid = $1', [postID])
    const deletePost = await db.query('DELETE FROM posts WHERE postID = $1', [postID])
    res.status(200).json(
      {
        status: 'Success',
        message: 'Post deleted successfully'
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Failed',
        message: err.message
      }
    )
  }
})

//* UPDATE POST
router.route('/update/:postID').put(async(req, res) => {
  const postID = req.params.postID
  const content = req.body.content
  try{
    const update = await db.query('UPDATE posts SET content = $1 WHERE postID = $2', [content, postID])

    res.status(200).json(
      {
        status: 'Success',
        message: 'Post Edited successfullly',
        content: update.rows
      }
    )


  } catch(err) {
    res.status(400).json(
      {
        status: 'Failed kar gaya bsdk',
        message: err.message
      }
    )
  }
})

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

//* POSTS FROM A SINGLE PERSON
router.route('/feed/:username').get(async(req, res) => {
  const username = req.params.username

  try{
    const feedPosts = await db.query(`SELECT posts.postid, posts.username, posts.content, posts.title, posts.subreddit, posts.createdat, users.uid FROM posts, users
                                      WHERE posts.subreddit = ANY(users.followed_subreddits)
                                      AND users.username = $1
                                      ORDER BY createdat DESC`, [username])
                                      
  
    res.status(200).json(
      {
        status: 'Success',
        data: {
          posts: feedPosts.rows
        }
      }
    )
  
  } catch (err) {
    res.status(400).json(
      {
        status: 'Something went wrong',
        message: err.message
      }
    )
  }
})

module.exports = router;
