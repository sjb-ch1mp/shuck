import React from 'react';
import axios from 'axios';
import { encode } from 'base64-arraybuffer';

//Style
import './style/components.css';

//Components
import { Thinker }      from "./Thinker.js";
import { Portal }       from "./Portal.js";
import { Banner }       from "./Banner.js";

export class Sidebar extends React.Component{

    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            'message':'',
            'submissionType':null,
            'submittedFiles':[],
            'submittedURLs':[],
            'waitingForSubmission':false
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
    }

    reset(full){
        this.setState({
            'submissionType':null,
            'submittedFiles':[],
            'submittedURLs':[]
        });
        if(full){
            document.getElementById('portal').value = '';
        }
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
                'submittedURLs':unique_urls
            });
          document.getElementById('portal').value = `Found ${unique_urls.length} valid URLs.\n\n${unique_urls.join("\n")}`;
        }else{
          document.getElementById('portal').value = `No valid URLs were found in the text!\n\n${raw}` ;
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
                this.toggleNotification(true, 'Submission is too large. Maximum upload size is 35MB.', 'error');
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
        document.getElementById('portal').value = `Got ${(files.length > 1) ? `${files.length} files`: '1 file'}. Total size is ${totalSize} bytes.\n\n${fileList.join('\n')}`;
    }

    getTotalSubmissionSize(files){
        let totalSize = 0;
        for(let i in files){
          totalSize = totalSize + parseInt(files[i].size);
        }
        return totalSize;
    }

    toggleNotification(active, message, type){
        let notifier_container = document.getElementById('notifier-container');
        if(active){
            notifier_container.classList.add(`${type}-border`);
            notifier_container.classList.remove('hidden');
        }else{
            notifier_container.classList.remove('info-border');
            notifier_container.classList.remove('error-border');
            notifier_container.classList.add('hidden');
        }

        let notifier = document.getElementById('notifier');
        if(active){
            notifier.classList.add(type);
            notifier.value = message;
        }else{
            notifier.value = '';
            notifier.classList.remove('info');
            notifier.classList.remove('error');
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
        //Check if there's anything to submit
        if(this.state.submissionType == null){
          this.toggleNotification(true, 'Nothing to submit.', 'error');
          return;
        }else if(this.state.submissionType === 'url_multiple' && this.state.submittedURLs.length > 20){
          this.toggleNotification(true, "Please submit only 20 URLs at a time.", 'error');  
          return;
        }
    
        //Submit to server
        this.setState({'waitingForSubmission':true});
        if(/^url/.test(this.state.submissionType)){
          axios.post(
            '/api/url',
            {
              'urls':this.state.submittedURLs
            }
          ).then((resp) => {
            this.setState({'waitingForSubmission':false});
            this.toggleNotification(true, 'The URLs above were successfully submitted.', 'info');
            document.getElementById('portal').value = `${resp.data.urls.join("\n")}`;
          }).catch((error) => {
            this.setState({'waitingForSubmission':false});
            console.log(error);
            this.toggleNotification(true, "Something went wrong. Please try again.", 'error');
          }).finally(() => {
            this.setState({'waitingForSubmission':false});
          });
        }else{
          let filesToEncode = [];
          for(let i in this.state.submittedFiles){
            filesToEncode.push(this.encodeFile(this.state.submittedFiles[i]));
          }
          Promise.all(filesToEncode).then((encodedFiles) => {
            axios.post(
                '/api/file',
              {
                'files':encodedFiles
              }
            ).then((resp) => {
                this.setState({'waitingForSubmission':false});
                this.toggleNotification(true, 'The files above were successfully submitted.', 'info');
                document.getElementById('portal').value = `${resp.data.names.join("\n")}`;
            }).catch((error) => {
                this.setState({'waitingForSubmission':false});
                console.log(error);
                this.toggleNotification(true, "Something went wrong. Please try again.", 'error');
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
        return <div className={`Sidebar default-margins`}>
            <Banner/>
            <Portal submitURLs={ this.submitURLs } submitFiles={ this.submitFiles } toggleNotification={ this.toggleNotification } updateSubmission={ this.updateSubmission }/>
            <Thinker getShuckin={ this.getShuckin } waitingForSubmission={ this.state.waitingForSubmission }/>
        </div>;
    }
}