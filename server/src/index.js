process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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
const base64decoder = require('base64-arraybuffer');
const str2ab = require('string-to-arraybuffer');

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

                let headers = '';
                for(let i in result.response.headers){
                    let header = result.response.headers[i];
                    headers = headers + `${i}: ${typeof header == 'object' ? JSON.stringify(header): header}\n\n`;
                }

                let body = base64decoder.encode(result.response.data);

                enrichment = {
                    'info':{
                        'success':true,
                        'status':result.response.status,
                        'headers':headers,
                        'body':body,
                        'file_type':null
                    },
                    'results':[]
                };
            }else{
                enrichment = {
                    'info':{
                        'success':false,
                        'status':'Failed',
                        'error':result.error
                    }
                };
            }

            return {
                'id':md5(result.response.data),
                'name':result.url.hostname,
                'data':result.url.href,
                'type':'url',
                'enrichment': enrichment
            };
        });

        //enrich url responses - get mime type of response
        let promisedEnrichedArtefacts = [];
        let file = tools.getToolByName('file');
        for(let i in artefacts){
            promisedEnrichedArtefacts.push(new Dispatcher(file, artefacts[i]).dispatchJob());
        }

        Promise.all(promisedEnrichedArtefacts)
        .then((enrichedArtefacts) => {
            let urlsWithMimeType = enrichedArtefacts.map((result) => {
                result.artefact.enrichment.info.file_type = result.results.replace(/^[^:]+:\s+/g, "");
                return result.artefact;
            });

            response.json({
                'success':true,
                'submission_id':request.body.submission_id,
                'artefacts':urlsWithMimeType
            });
            response.send();
        })
        .catch((err) => {
            console.log(err);
            response.json({
                'success':true,
                'submission_id':request.body.submission_id,
                'artefacts':artefacts
            });
            response.send();
        });        
    })
    .catch((error) => {

        let artefacts = null;
        if(error.url){
            artefacts = [
                {
                    'id':md5(error.url.href),
                    'name':error.url.hostname,
                    'data':error.url.href,
                    'type':'url',
                    'enrichment':{
                        'info':{
                            'success':false,
                            'status':error.error.code
                        },
                        'results':[]
                    }
                }
            ]
        }

        response.json({
            'success':false,
            'submission_id':request.body.submission_id,
            'error':error,
            'artefacts':artefacts
        });
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
                },
                'results':[]
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
            results[i].artefact.enrichment.info.file_type = results[i].results.replace(/^[^:]+:\s+/g, "");
        }
        artefacts = results.map((result) => {return result.artefact});

        response.json({
            'submission_id':request.body.submission_id,
            'artefacts':artefacts,
            'success':true
        });
        response.send();
    })
    .catch((err) => {
        console.log(err);
        response.json({
            'success':false,
            'submission_id':request.body.submission_id,
            'err':err
        });
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
            'result':help.output[1].toString('utf-8'),
            'isHelp':true
        });

    }else{
        let artefact = request.body.artefact;

        new Dispatcher(tool, artefact).dispatchJob()
        .then((stdout) => {
            console.log('Success.');
            if(stdout.created_artefacts){
                console.log('Created artefacts.');
                let fileTool = tools.getToolByName('file');
                let promisedEnrichedCreatedArtefacts = [];
                for(let i in stdout.created_artefacts){
                    promisedEnrichedCreatedArtefacts.push(
                        new Dispatcher(fileTool, stdout.created_artefacts[i]).dispatchJob()
                    );
                }
                Promise.all(promisedEnrichedCreatedArtefacts)
                .then((results) => {
                    for(let i in results){
                        results[i].artefact.enrichment.info.file_type = results[i].results.replace(/^[^:]+:\s+/g, "");
                        results[i].artefact.enrichment.info.created_by = tool.name;
                    }
                    let createdArtefacts = results.map((result) => {return result.artefact});
                    let now = Date.now();
                    response.json({
                        'id':md5(`${now}-${tool.name}-${artefact.id}`),
                        'timestamp':now,
                        'tool':tool.name,
                        'artefact':artefact.id,
                        'result':stdout.results,
                        'success':stdout.success,
                        'created_artefacts':{
                            'artefacts':createdArtefacts
                        }
                    });
                    response.send();
                })
                .catch((error) => {
                    console.log('Failed to create artefacts.');
                    let now = Date.now();
                    response.json({
                        'id':md5(`${now}-${tool.name}-${artefact.id}`),
                        'timestamp':now,
                        'tool':tool.name,
                        'artefact':artefact.id,
                        'result':error,
                        'success':false,
                        'created_artefacts':null
                    });
                    response.send();
                });
            }else{
                console.log('No created artefacts.');
                let now = Date.now();
                response.json({
                    'id':md5(`${now}-${tool.name}-${artefact.id}`),
                    'timestamp':now,
                    'tool':tool.name,
                    'artefact':artefact.id,
                    'result':stdout.results,
                    'success':stdout.success,
                    'created_artefacts':null
                });
                response.send();
            }
        })
        .catch((stderr) => {
            response.json({
                'tool':tool.name,
                'artefact':artefact.id,
                'result':stderr.results,
                'success':stderr.success
            });
            response.send();
        });
    }
});

//START 
https.createServer(options, app).listen(port);