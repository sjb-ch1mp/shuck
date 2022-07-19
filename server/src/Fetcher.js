const axios = require('axios');
const commonUserAgents = require('./CommonUserAgents.js');

function resolveURL (url) {
    return new Promise((resolve, reject) => {
        let options = {
            'method':'get',
            'headers':{
                'User-Agent':commonUserAgents.getRandomUserAgent()
            },
            'maxRedirects':0
        };
        if(/https/.test(url.protocol)){
            //Treat as HTTPs
            options['port'] = url.port ? url.port : 443;
        }else{
            //Treat as HTTP
            options['port'] = url.port ? url.port : 80;
        }
        
        axios.get(url.href, options)
        .then((response) => {
            resolve({
                'url':url,
                'success':true,
                'response':response
            });
        })
        .catch((error) => {
            if(error.response && error.response.status && /^[0-9]{3}$/.test(error.response.status)){
                resolve({
                    'url':url,
                    'success':true,
                    'response':error.response
                });
            }else{
                reject({
                    'url':url,
                    'success':false,
                    'error':error
                })
            }
        });
    });
}

module.exports.resolveURL = resolveURL;