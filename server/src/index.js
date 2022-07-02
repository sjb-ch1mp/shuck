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
const { url } = require('inspector');
const options = {
    key: fs.readFileSync(path.join(__dirname, "..", "ssl", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "ssl", "cert.pem"))
};

//ROUTING
app.get('/', (req, res) => {
    res.sendFile(build);
});

app.post('/api/url', (req, res) => {

    let enrichment_packages = [];
    for(let i in req.body.urls){
        enrichment_packages.push({
            'id':req.body.urls[i],
            'type':'url',
            'enrichment_package':{}
        });
    }

    res.json({
        'submissionId':req.body.submissionId,
        'enrichment_packages':enrichment_packages
    });

    res.send();
});

app.post('/api/file', (req, res) => {

    let enrichment_packages = [];
    for(let i in req.body.files){
        enrichment_packages.push({
            'id':req.body.files[i].name,
            'type':'file',
            'enrichment_package':{
                'size':req.body.files[i].size
            }
        });
    }

    res.json({
        'submissionId':req.body.submissionId,
        'enrichment_packages':enrichment_packages
    });

    res.send();
});

//START 
https.createServer(options, app).listen(port);