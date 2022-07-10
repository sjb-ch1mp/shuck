const axios = require('axios');
const commonUserAgents = require('./CommonUserAgents.js');

function resolveURL (url) {
    return new Promise((resolve, reject) => {
        let options = {
            'headers':{
                'User-Agent':commonUserAgents.getRandomUserAgent()
            }
        };
        if(/https/.test(url.protocol)){
            //Treat as HTTPs
            options['rejectUnauthorized'] = false;
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
            reject({
                'url':url,
                'success':false,
                'error':error
            })
        });
    });
}

module.exports.resolveURL = resolveURL;
//UP TO HERE - Need to return a promise so that all the URLs can be fetched and then resolved in a Promise.all().
//use the protocol to determine which type of request should be made (http or https)?
//ignore certificates