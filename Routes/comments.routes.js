const router = require('express').Router()
const db = require('../db')

router.route('/:postID').post(async(req,res) => {
  const postID = req.body.postID
  const username = req.body.username
  const content = req.body.content
  const createdAt = new Date()

  try{
    const createComment = await db.query('INSERT INTO comments (username,content,postid,createdAt) VALUES ($1,$2,$3,$4)', [username, content, postID,createdAt ])
    
    res.status(200).json(
      {
        status: "Success",
        data: {
          commentDetails: createComment.rows[0]
        }
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


router.route('/:postID').get(async(req,res) => {
  const postID = req.params.postID

  try{
    const comments = await db.query(`SELECT comments.content, comments.username,comments.createdat, comments.comment_id 
                                    FROM comments 
                                    JOIN posts ON posts.postid = comments.parent_postid 
                                    WHERE posts.postid = $1`, [postID])
    res.status(200).json(
      {
        status: "Success",
        numOfResults: comments.rows.length,
        data: {
          comments: comments.rows
        }
      }
    )
  } catch(err){
    res.status(400).json(
      {
        status:"Error",
        message: err.message
      }
    )
  }
})

router.route('/:commentID/update').put(async(req,res) => {
  const commentID = req.params.commentID
  const content = req.body.content
  try{
    const update = await db.query('UPDATE comments SET content = $1 WHERE comment_id = $2', [content, commentID])

    res.status(200).json(
      {
        status: "Success",
        data: {
          updatedContent: update.rows[0].content
        }
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

module.exports = router