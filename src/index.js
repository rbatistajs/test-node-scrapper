require('dotenv').config()

const express = require('express')
const { tuitionScrapper } = require('./scrapper')

const app = express()
const PORT = 3333 || process.env.PORT

const initScrape = async () => {
    console.log('Init Scrape')
    await tuitionScrapper.getData()
    console.log('Finish Scrape')
}

initScrape()

app.get('/items', async (req, res) => {
    try {
        const result = await tuitionScrapper.getData()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }    
})


app.get('/', async (req, res) => {
    res.status(200).end('Access http://localhost:${PORT}/items to scrape')
})


app.listen(PORT, () => {
    console.log(`Scrape http://localhost:${PORT}/scrape`)
})