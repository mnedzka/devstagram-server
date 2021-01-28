const express = require("express")
const cors = require("cors")
const morgan = require('morgan')
const app = express()

require("dotenv").config()

app.use(cors())
app.use(express.json())

morgan('dev')

const usersRouter = require("./Routes/user.routes")
const postRoutes = require("./Routes/posts.routes")
const subredditsRoutes = require('./Routes/subreddits.routes')
const commentRoutes = require("./Routes/comments.routes")
const likeRoutes = require("./Routes/likes.routes")

app.use("/posts", postRoutes)
app.use('/subreddits', subredditsRoutes)
app.use('/comments', commentRoutes)
app.use('/likes', likeRoutes)
app.use('/user', usersRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Listening to port', PORT)
})