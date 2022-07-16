const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const base64decoder = require('base64-arraybuffer');

//Returns an array of promises that will return an array of artefacts upon resolving
//Is recursive upon directories
function createArtefactsFromFiles(currentPath, fileNames){

    let promisedArtefacts = [];

    for(let i in fileNames){
        let filePath = path.join(currentPath, fileNames[i]);
        let fileInfo = fs.statSync(filePath);
        if(fileInfo.isDirectory()){
            let dirFiles = fs.readdirSync(filePath);
            let morePromisedArtefacts = createArtefactsFromFiles(filePath, dirFiles);
            for(let i in morePromisedArtefacts){
                promisedArtefacts.push(morePromisedArtefacts[i]);
            }
            fs.rmdir(filePath, (err) => {
                if(err){
                    console.log(`The following error occurred when trying to delete directory ${filePath}:\n${err}`);
                }else{
                    console.log(`Successfully deleted created subdirectory ${filePath}`);
                }
            });
        }else{
            promisedArtefacts.push(
                new Promise((resolve, reject) => {
                    fs.readFile(filePath, (err, data) => {
                        if(err){
                            fs.rm(filePath, {'force':true}, (rm_err) => { 
                                if(rm_err){
                                    console.log(`There was an error when deleting ${filePath}: ${err}`)
                                }else{
                                    console.log(`Deleted file ${filePath}`);
                                    reject({
                                        'error':err,
                                        'name':path.basename(filePath)
                                    });
                                }
                            });
                        }else{
                            fs.rm(filePath, {'force':true}, (rm_err) => { 
                                if(rm_err){
                                    console.log(`There was an error when deleting ${filePath}: ${err}`)
                                }else{
                                    console.log(`Deleted file ${filePath}`);
                                    resolve(
                                        {
                                            'id':md5(data),
                                            'name':path.basename(filePath),
                                            'data':base64decoder.encode(data),
                                            'type':'file',
                                            'enrichment':{
                                                'info':{
                                                    'size':data.length,
                                                    'file_type':null
                                                }
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    });
                })
            );
        }
    }

    return promisedArtefacts;
}

module.exports.createArtefactsFromFiles = createArtefactsFromFiles;