const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
// const users = require('./database');
const fs = require('fs');
const {csparser} = require('./csparser.js')

const app = express();
const PORT = 8080;
let codes = ['1', '33']

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/public'));



// Middleware для разрешения CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('', async (req, res) => {
    res.sendFile(path.join(__dirname, 'site.html'))
})



app.get('/account', async (req, res) => {
    const { code } = req.query;
    console.log(code)
    try {
        if (codes.includes(code)) { // code check logic should be here
            res.json({ message: 'Access granted'})  
        } else {
            res.json({ error: 'Wrong code' })
        }
    } catch (e) {
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/min-price', async (req, res) => {
    const {code, goodsId, minProfit, stickerOverpay } = req.query;

    if (!codes.includes(code)) return res.json({ error: 'ACTIVATE SUBSCRIPTION' }) // code check logic should be here
 
    const data = await csparser(goodsId, minProfit, stickerOverpay);
    if (data) {
        res.json({ data });
    } else {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});