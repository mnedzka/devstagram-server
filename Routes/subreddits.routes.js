const router = require('express').Router()
const db = require('../db')

router.route('/').get(async(req, res) => {
  try{
    const subreddits = await db.query('SELECT * FROM subreddits')
    res.status(200).json(
      {
        status: "Success",
        subreddits: subreddits.rows
      }
    )
  } catch(err) {
    res.status(400).json(
      {
        stauts: "Success",
        message: err.message
      }
    )
  }
})

module.exports = router