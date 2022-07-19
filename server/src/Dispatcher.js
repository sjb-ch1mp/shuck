//Utilities
const path = require('path');
const { spawnSync } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const base64decoder = require('base64-arraybuffer');
const { createArtefactsFromFiles } = require('./Artefactory.js');

let Dispatcher = class{

    constructor(tool, artefact){
        //Save the path to the executable
        this.exe = path.join(__dirname, "..", "toolbox", tool.name);

        //Save the path for created artefacts
        this.createdArtefacts = path.join(__dirname, "..", "artefacts", "created");

        //Sort out the tool options
        this.toolOptions = tool.tool_options.map((option) => {
            if(option.selected){
                return option;
            }
        });
        //Check for locked tool options
        if(tool.locked_tool_options){
            let lockedToolOptions = tool.locked_tool_options.map((option) => {
                return option;
            });
            for(let i in lockedToolOptions){
                this.toolOptions.push(lockedToolOptions[i]);
            }
        }
        //clean up tool options
        let selectedToolOptions = [];
        for(let i in this.toolOptions){
            if(this.toolOptions[i]){
                selectedToolOptions.push(this.toolOptions[i]);
            }
        }
        this.toolOptions = selectedToolOptions;
        this.tool = tool;

        //Check if the user is invoking help
        if(this.toolOptions.map((option) => {return (option) ? option.flag: null}).includes(tool.help_flag)){
            this.helpFlag = tool.help_flag;
        }else{
            //Otherwise, generate the path to the artefact and save the artefact
            this.artefactOnDisc = path.join(__dirname, "..", "artefacts", artefact.id);
            this.artefact = artefact;   
        }

        this.saveTempFile = this.saveTempFile.bind(this);
        this.dispatchJob = this.dispatchJob.bind(this);
        this.deleteArtefact = this.deleteArtefact.bind(this);
        this.cleanOptionValue = this.cleanOptionValue.bind(this);
        this.checkURI = this.checkURI.bind(this);
        this.getToolHelp = this.getToolHelp.bind(this);
        this.prepareOptions = this.prepareOptions.bind(this);
    }

    saveTempFile(){
        let file = null;
        if(this.artefact.type === 'file'){
            file = base64decoder.decode(this.artefact.data);
        }else{
            //artefact is a URL - use the axios results
            file = base64decoder.decode(this.artefact.enrichment.info.body);
        }
        fs.writeFile(this.artefactOnDisc, new DataView(file), 'utf8', (error) => {
            if(error){
                console.log(`There was an error when saving the file: ${error}`);
            }else{
                console.log(`Saved file at location ${this.artefactOnDisc}`);
            }
            
        });
    }

    getToolHelp(){
        let exeResults = spawnSync(this.exe, [`${(this.helpFlag.length > 1) ? '--' : '-'}${this.helpFlag}`]);
        return exeResults;
    }

    prepareOptions(){
        let options = [];

        if(this.tool.uri_first){
            options.push(this.artefactOnDisc);
        }

        for(let i in this.toolOptions){
            let option = this.toolOptions[i];
            if(option){
                if(/^(string|static)/.test(option.type)){
                    let value = null;
                    if(/^__FILEOUT/.test(option.value)){
                        if(/::/.test(option.value)){
                            value = path.join(this.createdArtefacts, option.value.split(/::/)[1]);
                        }else{
                            value = this.createdArtefacts;
                        }
                    }else{
                        value = this.cleanOptionValue(option.value);
                    }
                    //let value = (/^__FILEOUT$/.test(option.value)) ? this.createdArtefacts : this.cleanOptionValue(option.value);
                    if(/nospace$/.test(option.type)){
                        options.push(`${ option.flag.length > 1 ? '--' : '-' }${option.flag}"${value}"`);
                    }else if(/oneswitch$/.test(option.type)){
                        options.push(`-${option.flag}`);
                        options.push(`"${value}"`);
                    }else{
                        options.push(`${ option.flag.length > 1 ? '--' : '-' }${option.flag}`);
                        options.push(`"${value}"`);
                    }
                }else if(/^boolean/.test(option.type)){
                    if(/noswitch$/.test(option.type)){
                        options.push(option.flag);
                    }else if(/oneswitch$/.test(option.type)){
                        options.push(`-${option.flag}`);
                    }else{
                        options.push(`${ option.flag.length > 1 ? '--' : '-' }${option.flag}`);
                    }
                }
            }
        }

        if(!this.tool.uri_first){
            options.push(this.artefactOnDisc);
        }

        return options;
    }

    dispatchJob(){
        //prepare options
        let options = this.prepareOptions();

        console.log(`Executing: ${this.exe} ${options.join(" ")}`);

        return new Promise((resolve, reject) => {

            //Write the file to disc temporarily
            let file = null;
            if(this.artefact.type === 'file'){
                file = new DataView(base64decoder.decode(this.artefact.data));
            }else{
                //artefact is a URL - use the axios results
                file = this.artefact.enrichment.info.body_raw;
            }

            fs.writeFile(this.artefactOnDisc, file, (error) => {
                if(error){
                    console.log(`There was an error when saving the file: ${error}`);
                }else{
                    console.log(`Saved file at location ${this.artefactOnDisc}`);

                    //If the write is successful - execute the tool on the temporary file
                    const executeTool = exec(`${this.exe} ${options.join(" ")}`, (error, stdout, stderr) => {

                        //After execution - delete the temporary file
                        this.deleteArtefact(this.artefactOnDisc);

                        if(error){
                            console.log('There was an error executing the file');
                            console.log(error);
                            console.log(stderr.toString('utf-8'));
                            reject({
                                'success':false, 
                                'results':stderr.toString('utf-8'),
                                'artefact':this.artefact,
                                'created_artefacts':null
                            });
                        }else{
                            //If successful - check for created artefacts and return them
                            fs.readdir(this.createdArtefacts, (err, files) => {

                                if(files.length > 0){
                                    
                                    let promisedArtefacts = createArtefactsFromFiles(path.join(__dirname, '..', 'artefacts', 'created'), files);
                                    Promise.all(promisedArtefacts)
                                    .then((createdArtefacts) => {
                                        resolve({
                                            'success':true,
                                            'results':stdout.toString('utf-8'),
                                            'artefact':this.artefact,
                                            'created_artefacts':createdArtefacts
                                        });
                                    })
                                    .catch((failedArtefacts) => {
                                        reject({
                                            'success':false, 
                                            'results':`The following error occurred when attempting to process created artefact ${failedArtefacts.name}:\n ${failedArtefacts.error}`,
                                            'artefact':this.artefact,
                                            'created_artefacts':null
                                        });
                                    });

                                }else{
                                    resolve({
                                        'success':true, 
                                        'results':stdout.toString('utf-8'),
                                        'artefact':this.artefact,
                                        'created_artefacts':null
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }

    deleteArtefact(artefact){
        fs.rm(artefact, {'force':true}, (err) => { 
            if(err){
                console.log(`There was an error when deleting ${artefact}: ${err}`)
            }else{
                console.log(`Deleted file ${artefact}`);
            }
        });
    }

    cleanOptionValue(value){
        value = value.replace(/"/g, '\\"'); //escape double quotes
        value = value.replace(/\\$/g, '\\\\'); //escape last character escapes
        return value;
    }

    checkURI(){
        //check the URI to ensure that it's not attempting to access anything funky
    }
}

module.exports = Dispatcher;