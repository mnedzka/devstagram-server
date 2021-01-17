const router = require("express").Router()
const db = require('../db')

router.route('/settings').get(async(req,res) => {
  const uid = req.body.uid

  const response = await db.query('SELECT * FROM users WHERE uid = $1', [uid])
})