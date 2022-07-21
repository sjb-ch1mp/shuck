import React from 'react';

import axios from 'axios';
import md5 from 'md5';
import { encode } from 'base64-arraybuffer';

//Style
import './style/components.css';

//Components
import { Sidebar }      from "./Sidebar.js";
import { Results }      from "./Results.js";
import { Toolbox }      from "./Toolbox.js";
import Tools            from "./Tools";

const Buffer = require('buffer').Buffer;

export class Workspace extends React.Component{

    constructor(props){
        super(props);
        this.props = props;


        this.state = {
            'clipboard':null,
            'message':this.welcomeMessage(),
            'submissionId':null,
            'submissionType':null,
            'submittedFiles':[],
            'submittedURLs':[],
            'artefactPackage':{'submission_ids':[],'artefacts':[]},
            'waitingForSubmission':false,
            'artefactView':false,
            'notify':{'active':false, 'message':'', 'type':''},
            'selectedArtefact':null,
            'selectedTool':null,
            'tools':Tools(),
            'results':'',
            'selectedResults':'',
            'showHelp':false,
            'newResult':null
        };

        this.reset = this.reset.bind(this);
        //this.submitURLs = this.submitURLs.bind(this);
        this.submitFiles = this.submitFiles.bind(this);
        this.reportCurrentFiles = this.reportCurrentFiles.bind(this);
        this.getTotalSubmissionSize = this.getTotalSubmissionSize.bind(this);
        this.updateSubmission = this.updateSubmission.bind(this);
        this.parseAndSaveURLs = this.parseAndSaveURLs.bind(this);
        this.getShuckin = this.getShuckin.bind(this);
        this.encodeFile = this.encodeFile.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.toggleNotification = this.toggleNotification.bind(this);
        this.toggleSelectedArtefact = this.toggleSelectedArtefact.bind(this);
        this.welcomeMessage = this.welcomeMessage.bind(this);
        this.toggleSelectedTool = this.toggleSelectedTool.bind(this);
        this.updateArtefactPackage = this.updateArtefactPackage.bind(this);
        this.getToolByName = this.getToolByName.bind(this);
        this.getArtefactById = this.getArtefactById.bind(this);
        this.updateSelectedToolOption = this.updateSelectedToolOption.bind(this);
        this.shuckIt = this.shuckIt.bind(this);
        this.addResultsToArtefact = this.addResultsToArtefact.bind(this);
        this.toggleSelectedResult = this.toggleSelectedResult.bind(this);
        this.submitTextAsURL = this.submitTextAsURL.bind(this);
        this.submitTextAsSnippet = this.submitTextAsSnippet.bind(this);
        this.submitText = this.submitText.bind(this);
    }

    welcomeMessage(){
      return '=== Welcome to Shuck ===\n\n' + 
      'Shuck will take a list of URLs or a set of files and allow you to analyse them with a collection of open source static analysis tools.\n\n' + 
      'To submit URLs, paste them into this INPUT portal. Shuck will automatically parse any text entered into this portal and extract valid URLs for you.\n\n' + 
      'To submit files, simply drag and drop them into this INPUT portal.\n\n' + 
      'Please note that Shuck will only accept up to 10 URLs at a time, and up to 35MB worth of files.';
    }

    toggleSelectedResult(){
      this.setState({'newResult':null});
    }

    updateSelectedToolOption(flag, changeType, value) {
      let tool = this.getToolByName(this.state.selectedTool);

      for(let i in tool.tool_options){
        if(tool.tool_options[i].flag === flag){
          if(changeType === 'toggle'){
            tool.tool_options[i].selected = !tool.tool_options[i].selected;
          }else if(changeType === 'change_value'){
            tool.tool_options[i].value = value;
          }
        }
      }

      this.updateTool(tool);
    }

    updateTool(tool){
      let tools = this.state.tools;
      let toolIdx = -1;
      for(let i=0; i<tools.length; i++){
        if(tool.name === tools[i].name){
          toolIdx = i;
          break;
        }
      }
      tools[toolIdx] = tool;
      this.setState({'tools':tools});
    }

    getToolByName(name){
      for(let i in this.state.tools){
        if(this.state.tools[i].name === name){
          return this.state.tools[i];
        }
      }
      return null;
    }

    toggleSelectedTool(name){
      let clickedTool = this.getToolByName(name);

      if(this.state.selectedTool && this.state.selectedTool === clickedTool.name){
        this.setState({'selectedTool':null});
      }else{
        this.setState({'selectedTool':clickedTool.name});
      }
    }

    getArtefactById(id){
      for(let i in this.state.artefactPackage.artefacts){
        if(this.state.artefactPackage.artefacts[i].id === id){
          return this.state.artefactPackage.artefacts[i];
        }
      }
      return null;
    }

    toggleSelectedArtefact(id){
      let clickedArtefact = this.getArtefactById(id);

      if(this.state.selectedArtefact && this.state.selectedArtefact === clickedArtefact.id){
        this.setState({'selectedArtefact':null, 'selectedResults':null, 'newResult':null, 'showHelp':false});
      }else{
        this.setState({'selectedArtefact':clickedArtefact.id, 'selectedResults':clickedArtefact.id, 'newResult':null, 'showHelp':false});
      }
    }

    toggleView(){
        this.setState({
          'artefactView':!this.state.artefactView
        }/*, () => {this.toggleNotification((this.state.artefactView) ? 'ARTEFACT MODE': 'SUBMIT MODE', 'info')}*/);
      }

    reset(full){
        this.setState({
            'submissionId':null,
            'submissionType':null,
            'submittedFiles':[],
            'submittedURLs':[],
            'message':(full) ? '' : this.state.message
        });
    };   

    submitText(e){
      e.preventDefault();
      this.setState({'clipboard':e.clipboardData.getData('text')}, () => {
        this.toggleNotification(
          'Submit text as...',
          'info',
          {
            'text':'URL',
            'callback':this.submitTextAsURL
          },
          {
            'text':'Snippet',
            'callback':this.submitTextAsSnippet
          }
        );
      });
    }

    submitTextAsSnippet(){
      let snippet = [{
        'name':`${Date.now()}.snippet`,
        'size':this.state.clipboard.length,
        'content':Buffer.from(this.state.clipboard).toString('base64')
      }];
      this.setState({'submissionType':'snippet','submittedFiles':snippet}, () => {
        this.reportCurrentFiles(this.state.submittedFiles)
      });
    }

    submitTextAsURL(){
      if(this.state.artefactView){
        this.toggleView();
      }

      this.parseAndSaveURLs(this.state.clipboard);
    }
    
    submitURLs(e){
        e.preventDefault();
        this.toggleNotification();
        let raw = e.clipboardData.getData('text');

        if(this.state.artefactView){
          this.toggleView();
        }

        this.parseAndSaveURLs(raw);
    }

    parseAndSaveURLs(raw){
        //Regex adapted from: https://regexr.com/39nr7
        let urls = raw.match(/http(s)?:\/\/(www\.)?[a-zA-Z0-9@:%\._\+~#=-]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\.~#?&\/=]*)/g);
        let unique_urls = [];
        for(let i in urls){
          if(!(unique_urls.includes(urls[i]))){
            unique_urls.push(urls[i]);
          }
        }
        unique_urls.sort();
    
        if(unique_urls.length > 0){
          this.reset(true);
          this.setState({
              'submissionType':(unique_urls.length > 1) ? 'url_multiple' : 'url_single',
              'submittedURLs':unique_urls,
              'submissionId':md5(unique_urls.join(':').toUpperCase())
          }, () => {console.log(this.state.submittedURLs);});
          this.setState({'message':`${unique_urls.join("\n")}`});
          this.toggleNotification(`Found ${unique_urls.length} valid URLs.`, 'info');
        }else{
          this.toggleNotification('No valid URLs were found.', 'error');
          this.setState({'message': raw });
        }
    }

    submitFiles(e){
        e.preventDefault();
        this.toggleNotification();
        if(this.state.artefactView){
          this.toggleView();
        }

        let files = [];
        let checkSize = 0;
        if(e.dataTransfer.items){
          for(let i in e.dataTransfer.items){
            if(e.dataTransfer.items[i].kind === 'file'){
              files.push(e.dataTransfer.items[i].getAsFile());
              checkSize = checkSize + parseInt(files[files.length - 1].size);
              if(checkSize >= 36700160){
                this.toggleNotification('Submission is too large. Maximum upload size is 35MB.', 'error');
                return;  
              }
            }
          }
          if(files.length > 0){
            this.reset(true);
            this.setState({
                'submissionType': (files.length > 1) ? 'file_multiple' : 'file_single',
                'submittedFiles': files
            });
            this.reportCurrentFiles(files);
          }
        }
    }

    reportCurrentFiles(files){
        let totalSize = this.getTotalSubmissionSize(files);
        let fileList = [];
        for(let i in files){
            fileList.push(files[i].name);
        }
        this.setState({
          'message': `${fileList.join('\n')}`,
          'submissionId':md5(`${fileList.join(':').toUpperCase()}::${totalSize}`)
        });
        if(/^snippet/.test(this.state.submissionType)){
          this.toggleNotification(`Got a snippet. Total size is ${totalSize} bytes.`, 'info');
        }else{
          this.toggleNotification(`Got ${(files.length > 1) ? `${files.length} files`: '1 file'}. Total size is ${totalSize} bytes.`, 'info');
        }
    }

    getTotalSubmissionSize(files){
        let totalSize = 0;
        for(let i in files){
          totalSize = totalSize + parseInt(files[i].size);
        }
        return totalSize;
    }

    toggleNotification(message, type, positiveResponse, negativeResponse){
      if(message){
        this.setState({
          'notify':{
            'active':true,
            'message':message,
            'type':type,
            'positiveResponse':positiveResponse,
            'negativeResponse':negativeResponse
          }
        });
      }else{
        this.setState({
          'notify':{ 
            'active':false,
            'message':'',
            'type':''
          }
        });
      }
    }

    updateSubmission(){
      this.toggleNotification();
      if(/^url/.test(this.state.submissionType)){
        let modifiedText = document.getElementById('portal').value;
        this.reset();
        this.parseAndSaveURLs(modifiedText);
      }else if(/^file/.test(this.state.submissionType)){
        let fileList = document.getElementById('portal').value.split(/\n/);
        let modifiedFiles = [];
        for(let i in fileList){
          if(fileList[i].trim().length > 0){
            for(let j in this.state.submittedFiles){
              if(this.state.submittedFiles[j].name === fileList[i].trim()){
                modifiedFiles.push(this.state.submittedFiles[j]);
              }
            }
          }
        }
        this.reset(true);
        if(modifiedFiles.length > 0){
          if(modifiedFiles.length === 1){
              this.setState({'submissionType':'file_single'});
          }else{
              this.setState({'submissionType':'file_multiple'});
          }
          this.setState({'submittedFiles':modifiedFiles});
          this.reportCurrentFiles(modifiedFiles);
        }
      }else{
        //Snippet
        let modifiedText = document.getElementById('portal').value;
        this.setState({'clipboard':modifiedText}, () => {
          this.submitTextAsSnippet();
        });
      }
    }

    updateArtefactPackage(newArtefacts, areCreatedArtefacts){

      //add null check for 'created_artefacts'
      if(!newArtefacts){
        console.log(`No artefacts detected. Returning...`);
        return this.state.artefactPackage;
      }

      let artefactPackage = this.state.artefactPackage;
      let previouslySubmittedIds = artefactPackage.artefacts.map((artefact) => {
        return artefact.id;
      });
      
      let duplicates = 0;
      for(let i in newArtefacts.artefacts){
        if(!previouslySubmittedIds.includes(newArtefacts.artefacts[i].id)){
          artefactPackage.artefacts.push(newArtefacts.artefacts[i]);

          //Need to remap previouslySubmittedIds each time in case the user submitted multiple files that are the same
          previouslySubmittedIds = artefactPackage.artefacts.map((artefact) => {
            return artefact.id;
          });

        }else{
          duplicates = duplicates + 1;
        }
      }

      if(!areCreatedArtefacts){
        artefactPackage.submission_ids.push(newArtefacts.submission_id);
      }

      if(duplicates > 0){
        this.toggleNotification(`${(duplicates > 1) ? `${areCreatedArtefacts ? 'New artefacts were created. ' : '' }${duplicates} duplicate artefacts were `: '1 duplicate artefact was '}ignored.`, 'info');
      }

      return artefactPackage;
    }

    addResultsToArtefact(artefactPackage, result){
      console.log(`Adding result ${result.id} to artefact ${result.artefact}`);
      for(let i in artefactPackage.artefacts){
        if(artefactPackage.artefacts[i].id === result.artefact){
          artefactPackage.artefacts[i].enrichment.results.push({
            'id':result.id,
            'timestamp':result.timestamp,
            'tool':result.tool,
            'result':result.result,
            'success':result.success
          });
        }
      }
      return artefactPackage;
    }

    getShuckin(){

      //Check if a tool is selected with the 'h' option
      if(this.state.selectedTool){
        let helpFlag = this.getToolByName(this.state.selectedTool).help_flag;
        let options = this.getToolByName(this.state.selectedTool).tool_options.map((option) => {
          if(option.selected){
            return option.flag;
          }
        });
        if(options.includes(helpFlag)){
          this.toggleNotification(`Showing help for ${ this.state.selectedTool }.`, 'info');
          this.shuckIt(true);
          return;
        }else if(this.state.selectedArtefact){
          //Check if a tool and an artefact is selected. If so - shuck it.
          this.toggleNotification(`Shucking artefact with ${ this.state.selectedTool }.`, 'info');
          this.shuckIt(false);
          return;
        }
      }

      //Toggle view if portal is in artefact mode, or if it's in input mode and there's no pending submissions
      if(this.state.artefactView || !this.state.submissionId){
        this.toggleView();
        return;
      }

      //Check if there's anything to submit
      if(this.state.submissionType == null){
        this.toggleNotification('Nothing to submit.', 'error');
        return;
      }else if(this.state.submissionType === 'url_multiple' && this.state.submittedURLs.length > 10){
        this.toggleNotification("Please submit only 10 URLs at a time.", 'error');
        return;
      }

      //Check if these artefacts have already been submitted
      if(this.state.artefactPackage.submission_ids.includes(this.state.submissionId)){
        this.toggleNotification(`These ${(/^url/.test(this.state.submissionType)) ? 'URLs' : 'files' } have already been submitted.`, 'error');
        return;
      }

      //Submit to server
      this.setState({'waitingForSubmission':true});

      //Submit URLs
      if(/^url/.test(this.state.submissionType)){
        this.postToServer('/api/url', this.state.submittedURLs);
        /*
        axios.post(
          '/api/url',
          {
            'submission_id':this.state.submissionId,
            'urls':this.state.submittedURLs
          }
        ).then((resp) => {
          this.toggleNotification();

          //Add all new artefacts to the artefact package
          let updatedArtefactPackage = this.updateArtefactPackage(resp.data, false);

          //And save it
          this.setState({'artefactPackage':updatedArtefactPackage}, () => {this.reset(true); this.toggleView()});
        }).catch((error) => {
          console.log(error);
          this.toggleNotification("Something went wrong. Please try again.", 'error');
        }).finally(() => {
          this.setState({'waitingForSubmission':false});
        });
        */
      }else if(/^file/.test(this.state.submissionType)){
        //Submit Files
        let filesToEncode = [];
        for(let i in this.state.submittedFiles){
          filesToEncode.push(this.encodeFile(this.state.submittedFiles[i]));
        }
        Promise.all(filesToEncode).then((encodedFiles) => {
          this.postToServer('/api/file', encodedFiles);
          /*
          axios.post(
              '/api/file',
            {
              'submission_id':this.state.submissionId,
              'files':encodedFiles
            }
          ).then((resp) => {
            this.toggleNotification();

            //Add all new artefacts to the artefact package
            let updatedArtefactPackage = this.updateArtefactPackage(resp.data, false);

            //And save it
            this.setState({'artefactPackage':updatedArtefactPackage}, () => {this.reset(true); this.toggleView()});
          }).catch((error) => {
              console.log(error);
              this.toggleNotification("Something went wrong. Please try again.", 'error');
          }).finally(() => {
            this.setState({'waitingForSubmission':false});
          });
          */
        });
      }else{
        //Submit snippet (as file)
        this.postToServer('/api/file', this.state.submittedFiles);
      }
    }

    postToServer(api, data){
      console.log(`Posting: ${data}`);
      axios.post(
        api,
        {
          'submission_id':this.state.submissionId,
          'submission':data
        }
      ).then((resp) => {
        this.toggleNotification();

        //Add all new artefacts to the artefact package
        let updatedArtefactPackage = this.updateArtefactPackage(resp.data, false);

        //And save it
        this.setState({'artefactPackage':updatedArtefactPackage}, () => {this.reset(true); this.toggleView()});
      }).catch((error) => {
          console.log(error);
          this.toggleNotification("Something went wrong. Please try again.", 'error');
      }).finally(() => {
        this.setState({'waitingForSubmission':false});
      });
    }

    encodeFile(file){
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = () => {
            resolve({
                'name':file.name,
                'size':file.size,
                'content':encode(reader.result)
            });
          };
          reader.onerror = () => {
            reject({
                'name':file.name,
                'error':reader.error
            });
          };
          reader.readAsArrayBuffer(file);
        });
    }

    shuckIt(help){
      let data = {
        'artefact':this.getArtefactById(this.state.selectedArtefact),
        'tool':this.getToolByName(this.state.selectedTool),
        'help':help
      };

      this.setState({'waitingForSubmission':true});
      axios.post(
        '/api/shuck', data
      ).then((response) => {

        //If isShowHelp, dump to Results textarea - otherwise append to the results of the current selectedArtefact
        if(response.data.isHelp){
          if(this.state.selectedArtefact){
            this.toggleSelectedArtefact(this.state.selectedArtefact);
          }
          this.setState({'results':response.data.result, 'showHelp':true});
        }else{
          console.log('Got result on client');
          //Update artefactPackage with any new artefacts
          let updatedArtefactPackage = this.updateArtefactPackage(response.data.created_artefacts, true);

          //Add the results to the appropriate artefact (by id)
          this.addResultsToArtefact(updatedArtefactPackage, response.data);
          console.log('Updated results in artefact');
          console.log(updatedArtefactPackage);

          //Save the artefactPackage
          this.setState({'artefactPackage':updatedArtefactPackage,'selectedResults':response.data.id, 'newResult':response.data.id, 'showHelp':false});
        }
      }).catch((error) => {
        console.log(error);
        this.toggleNotification("Something went wrong. Please try again.", 'error');
      }).finally(() => {
        this.setState({'waitingForSubmission':false});
      });
    }

    render(){
        return <div className={'Workspace not-scrollable terminal'}>
            <Sidebar
                artefactView={ this.state.artefactView }
                submitText={ this.submitText }
                //submitURLs={ this.submitURLs }
                submitFiles={ this.submitFiles }
                updateSubmission={ this.updateSubmission }
                toggleNotification={ this.toggleNotification }
                notify={ this.state.notify }
                message={ this.state.message }
                artefacts={ this.state.artefactPackage.artefacts }
                getShuckin={ this.getShuckin }
                waitingForSubmission={ this.state.waitingForSubmission }
                toggleSelectedArtefact={ this.toggleSelectedArtefact }
            />
            <Toolbox
              toggleSelected={ this.toggleSelectedTool }
              tools={ this.state.tools }
              toolOptions={ (this.state.selectedTool) ? this.getToolByName(this.state.selectedTool).tool_options : [] } 
              updateSelectedToolOption={ this.updateSelectedToolOption }
              waitingForSubmission={ this.state.waitingForSubmission }
            />
            <Results
              selectedArtefact={ this.getArtefactById(this.state.selectedArtefact) }
              results={ this.state.results }
              selectedOnRender={ this.state.selectedResults }
              showHelp={ this.state.showHelp }
              toggleSelectedResult={ this.toggleSelectedResult }
              newResult={ this.state.newResult }
            />
        </div>;
    }
}