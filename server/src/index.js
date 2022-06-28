const express = require('express');
const app = express();
const port = 443;

const path = require('path');
const build = path.join(__dirname, "..", "..", "app", "build");
app.use(express.static(build));

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '35mb'}));

//SSL
const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync(path.join(__dirname, "..", "ssl", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "ssl", "cert.pem"))
};

//ROUTING
app.get('/', (req, res) => {
    res.sendFile(build);
});

app.post('/api/url', (req, res) => {
    res.json({
        'count':req.body.urls.length,
        'type':'url',
        'urls':req.body.urls
    });
    res.send();
});

app.post('/api/file', (req, res) => {
    let files = req.body.files;
    let names = [];
    for(let i in files){
        names.push(files[i].name);
    }
    res.json({
        'count':req.body.files.length,
        'names':names,
        'files':files
    });
    res.send();
});

//START 
https.createServer(options, app).listen(port);