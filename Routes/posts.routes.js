const router = require("express").Router()
const db = require('../db')

router.route('/').get(async(req, res) => {
  try{

    const posts = await db.query('SELECT * FROM posts ORDER BY createdat DESC')
    res.status(200).json(
      {
        status: "Success",
        numOfResults: posts.rows.length,
        data: {
          posts: posts.rows
        }
      }
    )
  } catch(err){
    res.status(400).json(
      {
        status: "Failed",
        data: {
          message: err.message
        }
      }
    )
  }
  
})



router.route('/add').post(async(req, res) => {
  const userName = req.body.userName;
  const title = req.body.title;
  const content = req.body.content;
  const subreddit = req.body.subreddit;
  const createdAt = new Date();

  console.log(req.body)

  try{

    
    const response = await db.query('INSERT INTO posts(username, title, content, subreddit, createdat) VALUES ($1,$2,$3,$4,$5) returning *', [userName,title,content,subreddit,createdAt])
    
    res.status(200).json(
      {
        status: "Success",
        postID: response.rows[0].postid
      }
      )
  } catch(err) {
    res.status(400).json(
      {
        status: "Failed",
        message: err.message
      }
    )
  }

})

router.route('/:postID').get(async(req, res) => {
  const postID = req.params.postID
  try{
    const post = await db.query("SELECT * FROM posts WHERE postid = $1", [postID])
    res.status(200).json(
      {
        status: "Success",
        data: {
          post: post.row[0] 
        }
      }
    )
  
  } catch(err){
    res.status(400).json(
      {
        status: "Failed",
        data: {
          message: err.message
        }
      }
    )
  }
})

module.exports = router