//Utilities
const path = require('path');
const { spawnSync } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const base64decoder = require('base64-arraybuffer');

let Dispatcher = class{

    constructor(tool, artefact){
        this.exe = path.join(__dirname, "..", "toolbox", tool.name);
        this.toolOptions = tool.tool_options.map((option) => {
            if(option.selected){
                return option;
            }
        });
        if(this.toolOptions.map((option) => {return (option) ? option.flag: null}).includes(tool.help_flag)){
            this.helpFlag = tool.help_flag;
        }else{
            this.artefactOnDisc = path.join(__dirname, "..", "artefacts", artefact.id);
            this.artefact = artefact;   
        }

        this.saveTempFile = this.saveTempFile.bind(this);
        this.dispatchJob = this.dispatchJob.bind(this);
        this.deleteTempFile = this.deleteTempFile.bind(this);
        this.cleanOptionValue = this.cleanOptionValue.bind(this);
        this.checkURI = this.checkURI.bind(this);
        this.getToolHelp = this.getToolHelp.bind(this);
    }

    saveTempFile(){
        let file = null;
        if(this.artefact.type === 'file'){
            file = base64decoder.decode(this.artefact.data);
        }else{
            //artefact is a URL - use the axios results
            file = this.artefact.enrichment.info.body;
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

    dispatchJob(){
        //prepare options
        let options = [];
        for(let i in this.toolOptions){
            let option = this.toolOptions[i];
            if(option){
                options.push(`${option.flag.length > 1 ? '--': '-'}${option.flag}`);
                if(option.type !== 'boolean'){
                    options.push(`"${this.cleanOptionValue(option.value)}"`);
                }
            }
        }

        //add file path at the end of the options
        options.push(`${this.artefactOnDisc}`);
        //Save file
        //this.saveTempFile();

        console.log(`Executing: ${this.exe} ${options.join(" ")}`);

        return new Promise((resolve, reject) => {

            //Write the file to disc temporarily
            let file = null;
            if(this.artefact.type === 'file'){
                file = new DataView(base64decoder.decode(this.artefact.data));
            }else{
                //artefact is a URL - use the axios results
                file = this.artefact.enrichment.info.body;
            }
            fs.writeFile(this.artefactOnDisc, file, 'utf8', (error) => {
                if(error){
                    console.log(`There was an error when saving the file: ${error}`);
                }else{
                    console.log(`Saved file at location ${this.artefactOnDisc}`);

                    //If the write is successful - execute the tool on the temporary file
                    const executeTool = exec(`${this.exe} ${options.join(" ")}`, (error, stdout, stderr) => {

                        //After execution - delete the temporary file
                        this.deleteTempFile();
                        if(error){
                            reject({
                                'success':false, 
                                'results':stderr.toString('utf-8'),
                                'artefact':this.artefact
                            });
                        }else{
                            resolve({
                                'success':true, 
                                'results':stdout.toString('utf-8'),
                                'artefact':this.artefact
                            });
                        }
                    });
                }
            });
        });
    }

    deleteTempFile(){
        fs.rm(this.artefactOnDisc, {'force':true}, (err) => { 
            if(err){
                console.log(`There was an error when deleting ${this.artefactOnDisc}: ${err}`)
            }else{
                console.log(`Deleted file ${this.artefactOnDisc}`);
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