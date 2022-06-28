import logo from './img/logo.png';
import thinker_thinking from './img/thinking.png';
import thinker_hover from './img/thinking_hover.png';
import thinker_still from './img/thinking_still.png';
import './css/App.css';
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

    reset();

    let files = [];
    if(e.dataTransfer.items){
      for(let i in e.dataTransfer.items){
        if(e.dataTransfer.items[i].kind === 'file'){
          files.push(e.dataTransfer.items[i].getAsFile());
        }
      }
      if(files.length > 0){
        setSubmissionType((files.length > 1) ? 'file_multiple' : 'file_single');
        setSubmittedFiles(files);
        let fileList = [];
        for(let i in files){
          fileList.push(files[i].name);
        }
        document.getElementById('App-text-input').value = `Got ${(files.length > 1) ? `${files.length} files`: '1 file'}.\n\n${fileList.join("\n")}`;
      }
    }
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

  function getURLs(e){
    e.preventDefault();

    reset();

    let raw = e.clipboardData.getData('text');
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
      document.getElementById('App-notify').value = 'Nothing to submit. Please enter some URLs or drop some files.';
      return;
    }else if(submissionType === 'url_multiple' && submittedURLs.length > 10){
      document.getElementById('App-notify').value = `${(submittedURLs.length > 100) ? `Come on, dude... ${submittedURLs.length} is waaay too many URLs. `: ""}Please submit only 10 URLs at a time.`;  
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
    <div className="App" onDrop={dropHandler}>
      <header className="App-header">
        <a href="https://github.com/sjb-ch1mp/shuck/blob/master/README.md" target="_blank"><img src={logo} className="App-logo" alt="logo" /></a>
          <div className="App-input-container" id="input-container">
            <textarea onPaste={getURLs} id="App-text-input" className="App-input" placeholder="Shuck will extract URLs from text pasted here. You can also drop one or more files." />
            <img id="App-thinker" src={thinker_still} onMouseOver={turnThinker} onMouseLeave={returnThinker} onMouseDown={getShuckin} className="App-thinker" />
            <textarea id='App-notify' className="App-notify" disabled="true"></textarea>
          </div>
      </header>
    </div>
  );
}

export default App;
