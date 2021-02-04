const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const db = require('./db')

const app = express();
const jsonParser = bodyParser.json()
const html = './public/html';
const port = 3030;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    res.sendFile(path.resolve(html + '/index.html'));
});

app.post('/check', jsonParser, function (req, res) {
    if (req.body.link == "") res.send({
        "data": null
    });

    let data = db.search(req.body.link);
    if (data == null) {
        res.send({
            "data": null
        });
    } else {
        res.send({
            "data": data
        })
    }
})


app.post('/new', jsonParser, function (req, res) {
    function make_short_link(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    if (req.body.link == "") res.send({
        "status": "Ссылка не может быть пустой"
    });

    let short_link = make_short_link(5)
    let date_now = new Date;

    let data = db.create_obj("links",{
        "link": req.body.link,
        "key": short_link,
        "time": date_now.toString().split('GMT')[0],
        "transitions": 0
    });

    res.send({
        "status": "ok",
        "shortlink": short_link
    });
})


app.listen(port, () => {
    console.log(`Server started port:${port}`);
});