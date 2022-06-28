import logo from './img/logo.png';
import thinker_thinking from './img/thinking.png';
import thinker_hover from './img/thinking_hover.png';
import thinker_still from './img/thinking_still.png';
import './css/App.css';
import './css/dynamic.css';
import { useState } from "react";
const base64encoder = require('base64-arraybuffer');

function App() {

  const [submissionType, setSubmissionType] = useState(null);
  const [submittedFiles, setSubmittedFiles] = useState([]);
  const [submittedURLs, setSubmittedURLs]   = useState([]);
  const axios = require('axios').default;

  function reset(full){
    setSubmissionType(null);
    setSubmittedFiles([]);
    setSubmittedURLs([]);
    if(full){
      document.getElementById('App-text-input').value = "";
    }
  };

  function dropHandler(e){
    e.preventDefault();
    reset(true);
    let files = [];
    let checkSize = 0;
    if(e.dataTransfer.items){
      for(let i in e.dataTransfer.items){
        if(e.dataTransfer.items[i].kind === 'file'){
          files.push(e.dataTransfer.items[i].getAsFile());
          checkSize = checkSize + parseInt(files[files.length - 1].size);
          if(checkSize >= 36700160){
            document.getElementById('App-notify').value = 'Submission is too large. Maximum upload size is 35MB.';
            return;  
          }
        }
      }
      if(files.length > 0){
        setSubmissionType((files.length > 1) ? 'file_multiple' : 'file_single');
        setSubmittedFiles(files);
        reportCurrentFiles(files);
      }
    }
  }

  function getTotalSubmissionSize(files){
    let totalSize = 0;
    for(let i in files){
      totalSize = totalSize + parseInt(files[i].size);
    }
    return totalSize;
  }

  function reportCurrentFiles(files){
    let totalSize = getTotalSubmissionSize(files);
    let fileList = [];
    for(let i in files){
      fileList.push(files[i].name);
    }
    document.getElementById('App-text-input').value = `Got ${(files.length > 1) ? `${files.length} files`: '1 file'}. Total size is ${totalSize} bytes.\n\n${fileList.join("\n")}`;
  }

  function encodeFile(file){
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve({
          'name':file.name,
          'content':base64encoder.encode(reader.result)
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

  function updateSubmission(){
    if(/^url/.test(submissionType)){
      let modifiedText = document.getElementById('App-text-input').value;
      reset();
      parseAndSaveURLs(modifiedText);
    }else if(/^file/.test(submissionType)){
      let fileList = document.getElementById('App-text-input').value.split(/\n/);
      console.log(fileList);
      let modifiedFiles = [];
      for(let i in fileList){
        if(fileList[i].trim().length > 0){
          for(let j in submittedFiles){
            if(submittedFiles[j].name === fileList[i].trim()){
              modifiedFiles.push(submittedFiles[j]);
            }
          }
        }
      }
      reset(true);
      if(modifiedFiles.length > 0){
        if(modifiedFiles.length === 1){
          setSubmissionType('file_single');
        }else{
          setSubmissionType('file_single');
        }
        setSubmittedFiles(modifiedFiles);
        reportCurrentFiles(modifiedFiles);
      }
    }
  }

  function parseAndSaveURLs(raw){
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
      setSubmissionType((unique_urls.length > 1) ? 'url_multiple' : 'url_single');
      setSubmittedURLs(unique_urls);
      document.getElementById('App-text-input').value = `Found ${unique_urls.length} valid URLs.\n\n${unique_urls.join("\n")}`;
    }else{
      document.getElementById('App-text-input').value = `No valid URLs were found in the text!\n\n${raw}` ;
    }
  }

  function submitURLs(e){
    e.preventDefault();
    reset();
    let raw = e.clipboardData.getData('text');
    parseAndSaveURLs(raw);
  }

  function turnThinker(){
    document.getElementById('App-notify').value = '';
    let thinker = document.getElementById('App-thinker');
    if(!thinker.classList.contains("thinking")){
      thinker.classList.remove("thinking-mouseleave");
      thinker.src = thinker_hover;
      thinker.classList.add("thinking-mouseover");
    }
  }

  function returnThinker(force){
    document.getElementById('App-notify').value = '';
    let thinker = document.getElementById('App-thinker');
    if(force || !thinker.classList.contains("thinking")){
      if(force){
        thinker.classList.remove("thinking");
      }
      document.getElementById('App-thinker').classList.remove("thinking-mouseover");
      thinker.src = thinker_still;
      document.getElementById('App-thinker').classList.add("thinking-mouseleave");
    }
  }

  function getShuckin(){
    //Check if there's anything to submit
    if(submissionType == null){
      document.getElementById('App-notify').value = 'Nothing to submit.';
      return;
    }else if(submissionType === 'url_multiple' && submittedURLs.length > 20){
      document.getElementById('App-notify').value = `${(submittedURLs.length > 300) ? `Come on, dude... ${submittedURLs.length} is waaay too many URLs. `: ""}Please submit only 20 URLs at a time.`;  
      return;
    }

    //If a submission is being made - start the thinker icon rotating
    let thinker = document.getElementById('App-thinker');
    if(!thinker.classList.contains("thinking")){
      document.getElementById('App-thinker').classList.remove("thinking-mouseover");
      thinker.src = thinker_thinking;
      document.getElementById('App-thinker').classList.add("thinking");
    }

    //Submit to server
    if(/^url/.test(submissionType)){
      axios.post(
        '/api/url',
        {
          'urls':submittedURLs
        }
      ).then((resp) => {
        returnThinker(true);
        document.getElementById('App-text-input').value = `The following URLs were successfully submitted:\n\n${resp.data.urls.join("\n")}`;
      }).catch((error) => {
        console.log(error);
        document.getElementById('App-notify').value = "Something went wrong. Please try again.";
      });
    }else{
      let filesToEncode = [];
      for(let i in submittedFiles){
        filesToEncode.push(encodeFile(submittedFiles[i]));
      }
      Promise.all(filesToEncode).then((encodedFiles) => {
        axios.post(
          '/api/file',
          {
            'files':encodedFiles
          }
        ).then((resp) => {
          returnThinker(true);
          document.getElementById('App-text-input').value = `The following files were successfully submitted:\n\n${resp.data.names.join("\n")}`;
        }).catch((error) => {
          console.log(error);
          document.getElementById('App-notify').value = "Something went wrong. Please try again.";
        });
      });
    }
  }

  return (
    <div className="App">
      <div className={"App-header App-header-landing"}>
          <div className={"App-input-container App-input-container-landing"} id="input-container">
            <a href="https://github.com/sjb-ch1mp/shuck/blob/master/README.md" target="_blank"><img src={logo} className={"App-logo App-logo-landing"} alt="logo" /></a>
            <div className={'App-input-subcontainer App-input-subcontainer-landing'}>
              <textarea spellCheck="false" onDrop={dropHandler} onChange={updateSubmission} onPaste={submitURLs} id="App-text-input" className={"App-input App-input-landing"} placeholder="Shuck will extract URLs from text pasted here. You can also drop one or more files." />
              <textarea id='App-notify' className={"App-notify App-notify-landing"} disabled="true"></textarea>
            </div>
            <div className={'App-thinker-container'}>
              <img id="App-thinker" src={thinker_still} onMouseOver={turnThinker} onMouseLeave={returnThinker} onMouseDown={getShuckin} className={"App-thinker App-thinker-landing"} />
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
