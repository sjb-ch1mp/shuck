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
const Dispatcher = require('./Dispatcher.js');
const fetcher = require('./Fetcher.js');
const tools = require('./CommonTools.js');
const useragents = require('./CommonUserAgents.js');

//ROUTING
app.get('/', (request, response) => {
    response.sendFile(build);
});

app.post('/api/url', (request, response) => {

    let requests = [];
    for(let i=0; i<request.body.urls.length; i++){
        requests.push(fetcher.resolveURL(new URL(request.body.urls[i])));
    }

    Promise.all(requests)
    .then((resolvedURLs) => {
        let artefacts = resolvedURLs.map((result) => {
            let enrichment = null;
            if(result.success){
                enrichment = {
                    'info':{
                        'success':true,
                        'status':result.response.status,
                        'headers':result.response.headers,
                        'body':result.response.data
                    }
                };
            }else{
                enrichment = {
                    'info':{
                        'success':false,
                        'error':result.error
                    }
                };
            }

            return {
                'id':md5(result.url.href),
                'name':result.url.hostname,
                'data':result.url.href,
                'type':'url',
                'enrichment': enrichment
            };
        });

        response.json({
            'submission_id':request.body.submission_id,
            'artefacts':artefacts
        });

        response.send();
        
    })
    .catch((error) => {
        console.log(error);

        response.send();
    });
});

app.post('/api/file', (request, response) => {

    let artefacts = [];
    for(let i in request.body.files){
        artefacts.push({
            'id':md5(request.body.files[i].content),
            'name':request.body.files[i].name,
            'data':request.body.files[i].content,
            'type':'file',
            'enrichment':{
                'info':{
                    'size':request.body.files[i].size,
                    'file_type':null
                }
            }
        });
    }

    let dispatchedJobs = [];
    for(let i in artefacts){
        let fileTool = tools.getToolByName('file');
        dispatchedJobs.push(new Dispatcher(fileTool, artefacts[i]).dispatchJob());
    }

    Promise.all(dispatchedJobs)
    .then((results) => {
        for(let i in results){
            console.log(`Got result ${results[i].results} for artefact ${results[i].artefact.name}.`);
            results[i].artefact.enrichment.info.file_type = results[i].results.replace(/^[^:]+:\s+/g, "");
        }
        artefacts = results.map((result) => {return result.artefact});


        response.json({
            'submission_id':request.body.submission_id,
            'artefacts':artefacts
        });

        response.send();
    })
    .catch((err) => {
        console.log(err);

        response.send();
    });
});

app.post('/api/shuck', (request, response) => {

    let tool = request.body.tool;
    if(request.body.help){
        
        let help = new Dispatcher(tool, null).getToolHelp();

        response.json({
            'tool':tool.name,
            'artefact':null,
            'result':help.output[1].toString('utf-8')
        });

    }else{
        let artefact = request.body.artefact;

        new Dispatcher(tool, artefact).dispatchJob()
        .then((stdout) => {
            response.json({
                'tool':tool.name,
                'artefact':artefact.id,
                'result':stdout.results,
                'success':stdout.success
            });
        })
        .catch((stderr) => {
            response.json({
                'tool':tool.name,
                'artefact':artefact.id,
                'result':stderr.results,
                'success':stderr.success
            });
        })
        .finally(() => {
            response.send();
        });
    }
});

//START 
https.createServer(options, app).listen(port);