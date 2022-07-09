//Core
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
app.get('/', (request, response) => {
    response.sendFile(build);
});

app.post('/api/url', (request, response) => {
    
    let artefacts = [];
    for(let i=0; i<request.body.urls.length; i++){
        let thisURL=new URL(request.body.urls[i]);

        artefacts.push({
            'id':md5(request.body.urls[i]),
            'name':thisURL.hostname,
            'data':request.body.urls[i],
            'type':'url',
            'enrichment':{}
        });
    }   

    response.json({
        'submission_id':request.body.submission_id,
        'artefacts':artefacts
    });

    response.send();
});

app.post('/api/file', (request, response) => {

    let artefacts = [];
    for(let i=0; i<request.body.files.length; i++){
        artefacts.push({
            'id':md5(request.body.files[i].content),
            'name':request.body.files[i].name,
            'data':request.body.files[i].content,
            'type':'file',
            'enrichment':{'size':request.body.files[i].size}
        });
    }

    response.json({
        'submission_id':request.body.submission_id,
        'artefacts':artefacts
    });

    response.send();
});

app.post('/api/shuck', (request, response) => {

    let tool = request.body.tool;
    let artefact = request.body.artefact;

    console.log(`Running ${tool.name} on ${artefact.type} ${artefact.name}`);

    response.json({
        'tool':tool.name,
        'artefact':artefact.id,
        'result':`Tool: ${tool.name}\nArtefact: ${artefact.name} (${artefact.type})\nResults: Success!`
    });

    response.send();
});

//START 
https.createServer(options, app).listen(port);