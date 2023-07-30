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

const needle = require('needle')
needle("get", `${process.env.API_BASE_URL}/current.json?q=Oslo&${process.env.API_KEY_NAME}=${process.env.API_KEY_VALUE}&aqi=no&alerts=no`)
    .then((data) => {
        console.log(`Data received needle ${JSON.stringify(data.body)}`)
    }).catch((error) => {
        console.log(`Error received ${error}`)
    })


// Automated test
fetch(`${process.env.API_BASE_URL}/current.json?q=Oslo&${process.env.API_KEY_NAME}=${process.env.API_KEY_VALUE}&aqi=no&alerts=no`)
    .then(res => res.json())
    .then((data) => {
        console.log(`Data received fetch ${JSON.stringify(data)}`)
    }).catch((error) => {
        console.log(`Error received ${error}`)
    })


process.on('uncaughtException', function (err) {
    console.log(err);
}); 