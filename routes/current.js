const express = require('express')
const router = express.Router()
const needle = require('needle')
const url = require('url')
const apicache = require('apicache')

const API_BASE_URL = process.env.API_BASE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

let cache = apicache.middleware

router.get('/', cache("30 minutes"), async (req, res) => {
    try {
        console.log(`Received request with url '${req.url}' and query '${url.parse(req.url, true).query}'`)
        let params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            "aqi":"no",
            "alerts":"no",
            ...url.parse(req.url, true).query
        })
        
        if(req.param("byip") !== undefined){
            params = new URLSearchParams({
                [API_KEY_NAME]: API_KEY_VALUE,
                "aqi":"no",
                "alerts":"no",
                "q":req.ip
            })
            res.send(req.ip)
        }
        const apiRes = await needle('get', API_BASE_URL+'/current.json?'+params)
        const data = apiRes.body

        res.status(200).json(data)
    } catch (error) {
        console.log(`Error encountered ${error}`)
        res.status(500).json({error})
    }
})

module.exports = router