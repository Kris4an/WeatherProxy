const express = require("express")
const cors = require("cors")
require('dotenv').config()
const rateLimit = require('express-rate-limit')

const PORT = process.env.PORT || 5000;

const app = express()

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100
})
app.use(limiter)
app.set('trust proxy', 1)
app.use('/current', require('./routes/current'))
app.use('/forecast', require('./routes/forecast'))

app.use(cors())

app.listen(PORT, () => console.log('Server is running on port '+PORT))

process.on('uncaughtException', function (err) {
    console.log(err);
}); 