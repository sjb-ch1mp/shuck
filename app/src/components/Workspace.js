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
            'artefacts':{},
            'waitingForSubmission':false,
            'artefactView':false,
            'notify':{'active':false, 'message':'', 'type':''},
            'selectedArtefact':null,
            'selectedTool':null
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
    }

    welcomeMessage(){
      return '=== Welcome to Shuck ===\n\n' + 
      'Shuck will take a list of URLs or a set of files and allow you to analyse them with a collection of open source static analysis tools.\n\n' + 
      'To submit URLs, paste them into this INPUT portal. Shuck will automatically parse any text entered into this portal and extract valid URLs for you.\n\n' + 
      'To submit files, simply drag and drop them into this INPUT portal.\n\n' + 
      'Please note that Shuck will only accept up to 20 URLs at a time, and up to 35MB worth of files.';
    }

    toggleSelectedTool(name){
      let clickedTool = null;
      let tools = Tools();
      for(let i in tools){
        if(tools[i].name === name){
          clickedTool = tools[i];
        }
      }

      if(this.state.selectedTool && this.state.selectedTool.name === clickedTool.name){
        this.setState({'selectedTool':null});
      }else{
        this.setState({'selectedTool':clickedTool});
      }
    }

    toggleSelectedArtefact(key){
      let clickedArtefact = null;
      for(let i in this.state.artefacts.artefacts){
        if(this.state.artefacts.artefacts[i].key === key){
          clickedArtefact = this.state.artefacts.artefacts[i];
        }
      }

      if(this.state.selectedArtefact && this.state.selectedArtefact.id === clickedArtefact.id){ 
          this.setState({'selectedArtefact':null});
      }else{
        this.setState({'selectedArtefact':clickedArtefact});
      }
    }

    toggleView(){
        this.setState({
          'artefactView':!this.state.artefactView
        }/*, () => {this.toggleNotification((this.state.artefactView) ? 'ARTEFACT MODE': 'SUBMIT MODE', 'info')}*/);
      }

    reset(full){
        this.setState({
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
                'newSubmission':true,
                'submissionId':md5(unique_urls.join(':').toUpperCase())
            });
            this.setState({'message':`${unique_urls.join("\n")}`});
            this.toggleNotification(`Found ${unique_urls.length} valid URLs.`, 'info');
        }else{
          this.setState({
            'message': `No valid URLs were found in the text!\n\n${raw}`
          });
        }
    }

    submitFiles(e){
        e.preventDefault();
        this.toggleNotification();
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
                'submittedFiles': files,
                'newSubmission':true
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

    getShuckin(){
      if(this.state.artefacts.length > 0 && this.state.submissionId !== this.state.artefacts.submissionId){
        this.toggleView();
        return;
      }

      //Check if there's anything to submit
      if(this.state.submissionType == null){
        this.toggleNotification('Nothing to submit.', 'error');
        return;
      }else if(this.state.submissionType === 'url_multiple' && this.state.submittedURLs.length > 20){
        this.toggleNotification("Please submit only 20 URLs at a time.", 'error');  
        return;
      }

      //Submit to server
      this.setState({'waitingForSubmission':true});

      //Submit URLs
      if(/^url/.test(this.state.submissionType)){
        axios.post(
          '/api/url',
          {
            'submissionId':this.state.submissionId,
            'urls':this.state.submittedURLs
          }
        ).then((resp) => {
          this.toggleNotification();
          this.setState({'artefacts':resp.data, 'message':this.welcomeMessage()}, () => {this.toggleView()});
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
              'submissionId':this.state.submissionId,
              'files':encodedFiles
            }
          ).then((resp) => {
            this.toggleNotification();
            this.setState({'artefacts':resp.data, 'message':this.welcomeMessage()}, () => {this.toggleView()});
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
                artefacts={ this.state.artefacts.artefacts }
                getShuckin={ this.getShuckin }
                waitingForSubmission={ this.state.waitingForSubmission }
                toggleSelectedArtefact={ this.toggleSelectedArtefact }
            />
            <Toolbox
              toggleSelected={ this.toggleSelectedTool }
            />
            <Results/>
        </div>;
    }
}