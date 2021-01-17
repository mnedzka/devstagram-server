const router = require('express').Router()
const db = require('../db')

router.route('/add').post(async(req, res) => {
  const userName = req.body.userName
  const postID = req.body.postID

  try{
    const likePost = await db.query('INSERT INTO likes(username,postID) VALUES ($1, $2) returning *', [userName, postID])

    res.status(200).json(
      {
        status: "Success",
        message: "Liked Post successfully"
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