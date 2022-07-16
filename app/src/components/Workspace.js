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

export class Workspace extends React.Component{

    constructor(props){
        super(props);
        this.props = props;


        this.state = {
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
            'results':[]
        };

        this.reset = this.reset.bind(this);
        this.submitURLs = this.submitURLs.bind(this);
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
    }

    welcomeMessage(){
      return '=== Welcome to Shuck ===\n\n' + 
      'Shuck will take a list of URLs or a set of files and allow you to analyse them with a collection of open source static analysis tools.\n\n' + 
      'To submit URLs, paste them into this INPUT portal. Shuck will automatically parse any text entered into this portal and extract valid URLs for you.\n\n' + 
      'To submit files, simply drag and drop them into this INPUT portal.\n\n' + 
      'Please note that Shuck will only accept up to 10 URLs at a time, and up to 35MB worth of files.';
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
        this.setState({'selectedArtefact':null});
      }else{
        this.setState({'selectedArtefact':clickedArtefact.id});
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
        let urls = raw.match(/http(s)?:\/\/(www\.)?[a-zA-Z0-9@:%\._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\.~#?&\/=]*)/g);
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
          });
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
        this.toggleNotification(`Got ${(files.length > 1) ? `${files.length} files`: '1 file'}. Total size is ${totalSize} bytes.`, 'info');
    }

    getTotalSubmissionSize(files){
        let totalSize = 0;
        for(let i in files){
          totalSize = totalSize + parseInt(files[i].size);
        }
        return totalSize;
    }

    toggleNotification(message, type){
      if(message){
        this.setState({
          'notify':{
            'active':true,
            'message':message,
            'type':type
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
          this.shuckIt(true);
          return;
        }else if(this.state.selectedArtefact){
          //Check if a tool and an artefact is selected. If so - shuck it.
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
      }else{
      
        //Submit Files
        let filesToEncode = [];
        for(let i in this.state.submittedFiles){
          filesToEncode.push(this.encodeFile(this.state.submittedFiles[i]));
        }
        Promise.all(filesToEncode).then((encodedFiles) => {
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
        });
      }
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
        let results = this.state.results;

        //Keep only the last 50 results as a navigable history for the analyst
        if(results.length === 50){
          results.shift();
        }

        let updatedArtefactPackage = this.updateArtefactPackage(response.data.created_artefacts, true);
        console.log(`updatedArtefactPackage`);
        console.log(updatedArtefactPackage);

        results.push({
          'timestamp':Date.now(),
          'tool':response.data.tool,
          'artefact':response.data.artefact ? `${this.getArtefactById(response.data.artefact).name} (${response.data.artefact})` : null,
          'result':response.data.result,
          'success':response.data.success
        });

        this.setState({'results':results, 'artefactPackage':updatedArtefactPackage}, () => {
          console.log(`this.state.artefactPackage has been set to:`);
          console.log(this.state.artefactPackage);
        });
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
                submitURLs={ this.submitURLs }
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
            />
            <Results
              results={ this.state.results }
            />
        </div>;
    }
}