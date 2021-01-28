const router = require("express").Router()
const db = require('../db')

router.route('/settings').get(async(req,res) => {
  const uid = req.body.uid

  const response = await db.query('SELECT * FROM users WHERE uid = $1', [uid])
})

router.route('/create').post(async(req,res) => {
  const uid = req.body.uid
  const username = req.body.userName

  console.log(uid, username)  

  try{
    const addUser = await db.query('INSERT INTO users(uid, username) VALUES ($1,$2)', [uid, username])
    res.status(200).json(
      {
        status: 'Success'
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Something went wrong',
        message: err.message
      }
    )
  }
})


router.route('/follow/subreddit').post(async(req, res) => {
  const subreddit = req.body.subreddit
  const username = req.body.username

  try{
    const followSubreddit = await db.query('UPDATE users SET followed_subreddits = array_append(followed_subreddits , $1) WHERE username = $2', [subreddit, username])

    res.status(200).json(
      {
        status: 'Success'
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        status: 'Something went wrong',
        message: err.message
      }
    )
  }
})

module.exports = router 