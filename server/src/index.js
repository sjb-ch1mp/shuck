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

//Utilities
const url = require('url');
const md5 = require('md5');
const { join } = require('path');

//ROUTING
app.get('/', (req, res) => {
    res.sendFile(build);
});

app.post('/api/url', (req, res) => {
    
    let artefacts = [];
    for(let i=0; i<req.body.urls.length; i++){
        let thisURL=new URL(req.body.urls[i]);

        artefacts.push({
            'id':md5(req.body.urls[i]),
            'name':thisURL.hostname,
            'data':req.body.urls[i],
            'type':'url',
            'enrichment':{}
        });
    }   

    res.json({
        'submission_id':req.body.submission_id,
        'artefacts':artefacts
    });

    res.send();
});

app.post('/api/file', (req, res) => {

    let artefacts = [];
    for(let i=0; i<req.body.files.length; i++){
        artefacts.push({
            'id':md5(req.body.files[i].content),
            'name':req.body.files[i].name,
            'data':req.body.files[i].content,
            'type':'file',
            'enrichment':{'size':req.body.files[i].size}
        });
    }

    res.json({
        'submission_id':req.body.submission_id,
        'artefacts':artefacts
    });

    res.send();
});

//START 
https.createServer(options, app).listen(port);