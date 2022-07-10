//Utilities
const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');
const base64decoder = require('base64-arraybuffer');

let Dispatcher = class{

    constructor(tool, artefact){
        this.exe = path.join(__dirname, "..", "toolbox", tool.name);
        this.artefactOnDisc = path.join(__dirname, "..", "artefacts", artefact.id);
        this.artefact = artefact;
        this.toolOptions = tool.tool_options.map((option) => {
            if(option.selected){
                return option;
            }
        });

        this.saveTempFile = this.saveTempFile.bind(this);
        this.dispatchJob = this.dispatchJob.bind(this);
        this.deleteTempFile = this.deleteTempFile.bind(this);
        this.cleanOptionValue = this.cleanOptionValue.bind(this);
        this.checkURI = this.checkURI.bind(this);
    }

    saveTempFile(){
        let file = null;
        if(this.artefact.type === 'file'){
            file = base64decoder.decode(this.artefact.data);
        }else{
            //artefact is a URL - use the CURL results
            file = this.artefact.enrichment.curl.body;
        }
        fs.writeFile(this.artefactOnDisc, file, {'encoding':'utf8'});

        console.log(`Saved file at location ${this.artefactOnDisc}`);
    }

    dispatchJob(){
        //prepare options
        let options = [];
        for(let i in this.toolOptions){
            let option = this.toolOptions[i];
            options.push(`${option.flag.length > 1 ? '--': '-'}${option.flag}`);
            if(option.type !== 'boolean'){
                options.push(`"${this.cleanOptionValue(option.value)}"`);
            }
        }

        //add file path at the end of the options
        options.push(`"${this.artefactOnDisc}"`);
        //Save file
        this.saveTempFile();

        console.log(`Executing tool ${this.exe} with options: ${options.join(" ")}`);

        //Execute 
        let exeResults = spawnSync(this.exe, options);
        this.deleteTempFile();
        console.log(`stdout:${exeResults.output[1].toString('utf-8')}`);
        console.log(`stderr:${exeResults.output[2].toString('utf-8')}`);
    }

    deleteTempFile(){
        fs.rm(this.artefactOnDisc.toString, {'force':true}, (err) => { console.log(`There was an error when deleting ${this.artefactOnDisc.toString}: ${err.message}`) });
        console.log(`File ${this.artefactOnDisc.toString} was deleted`);
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

function initialDispatch (tool, data) {

}

module.exports = Dispatcher;