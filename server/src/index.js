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

//ROUTING
app.get('/', (req, res) => {
    res.sendFile(build);
});

app.post('/api/url', (req, res) => {
    
    let enrichment_packages = [];
    for(let i=0; i<req.body.urls.length; i++){
        let thisURL=new URL(req.body.urls[i]);

        enrichment_packages.push({
            'key':i + 1,
            'id':md5(req.body.urls[i]),
            'url':req.body.urls[i],
            'type':'url',
            'enrichment_package':{
                'hostname':thisURL.hostname
            }
        });
    }   

    res.json({
        'submissionId':req.body.submissionId,
        'artefacts':enrichment_packages
    });

    res.send();
});

app.post('/api/file', (req, res) => {

    let enrichment_packages = [];
    for(let i=0; i<req.body.files.length; i++){
        enrichment_packages.push({
            'key':i + 1,
            'id':md5(req.body.files[i].content),
            'name':req.body.files[i].name,
            'type':'file',
            'enrichment_package':{
                'size':req.body.files[i].size,
                'content':req.body.files[i].content
            }
        });
    }

    res.json({
        'submissionId':req.body.submissionId,
        'artefacts':enrichment_packages
    });

    res.send();
});

//START 
https.createServer(options, app).listen(port);