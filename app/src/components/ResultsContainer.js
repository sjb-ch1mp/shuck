import React from "react";

//Style
import './style/components.css';

//Utilities
import { decode } from 'base64-arraybuffer';

//Components
import Selectable from './Selectable.js';

//Resources
import download from '../img/download.png';
import download_hover from '../img/download_hover.png'

export class ResultsContainer extends React.Component {

    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            'selected':this.props.selectedOnRender,
            'download_img':download,
            'encoding':'utf8'
        }

        this.highlightSelectedResults = this.highlightSelectedResults.bind(this);
        this.renderResultsExtended = this.renderResultsExtended.bind(this);
        this.renderArtefactDetails = this.renderArtefactDetails.bind(this);
        this.renderResults = this.renderResults.bind(this);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.downloadArtefactContent = this.downloadArtefactContent.bind(this);
    }

    highlightSelectedResults(id){
        this.setState({
            'selected':(this.state.selected === id) ? null : id
        });
    }

    toggleSelected(){
        //do nothing
    }

    renderResultsExtended(result){
        console.log(`rendering result: ${result}`);
        return <div className={ 'SelectableExtended' }>
            <div className='SelectableExtendedChild'>
                <div className='SelectableExtendedChildTitle'>{ `> Results` }</div>
                        <textarea className={'ResultsTextArea boxed-in scrollable resizable terminal-font'}
                            disabled={ true }
                            value={ result }
                        />
            </div>
        </div>; 
    }

    renderArtefactDetails(artefact){
        if(artefact.type === 'url'){
            return <div className={ 'SelectableExtended' }>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'> HREF: '}</span>
                    { artefact.data }
                </div>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'> Status: '}</span>
                    { artefact.enrichment.info.status }
                </div>
                {
                    (artefact.enrichment.info.file_type) ? 
                    <div className='SelectableExtendedChild'>
                        <span className='SelectableExtendedChildTitle'>{'> File Type: '}</span>
                        { artefact.enrichment.info.file_type }        
                    </div>
                    : null
                }
                {
                    (artefact.enrichment.info.body_raw) ? 
                    <div className='SelectableExtendedChild'>
                        <span className='SelectableExtendedChildTitle'>{'> Size: '}</span>
                        { artefact.enrichment.info.body_raw.length }        
                    </div>
                    : null
                }
                {
                    (artefact.enrichment.info.headers) ? 
                    <div className='SelectableExtendedChild'>
                        <div className='SelectableExtendedChildTitle'>{ `> Headers:` }</div>
                        <textarea className={'ResultsTextArea boxed-in scrollable resizable terminal-font'}
                            disabled={ true }
                            value={ artefact.enrichment.info.headers }
                        />
                    </div>
                    : null
                }
                {
                    (artefact.enrichment.info.body) ? 
                    <div className='SelectableExtendedChild'>
                        <div className='SelectableExtendedChildTitle'>{ `> Body:` }</div>
                        <div className='ResultsMiniButtonContainer'>
                            <button className="ResultsMiniButton" onClick={() => {this.setState({'encoding':'utf8'})}}>UTF8</button>
                            <button className="ResultsMiniButton" onClick={() => {this.setState({'encoding':'base64'})}}>BASE64</button>
                        </div>
                        <textarea className={'ResultsTextArea boxed-in scrollable resizable terminal-font'}
                            disabled={ true }
                            value={ 
                                (this.state.encoding == 'utf8') ? 
                                new TextDecoder('utf-8').decode(decode(artefact.enrichment.info.body)) :
                                artefact.enrichment.info.body
                            }
                        />
                    </div>    
                    : (artefact.enrichment.info.error) ? 
                    <div className='SelectableExtendedChild'>
                        <div className='SelectableExtendedChildTitle'>{ `> Error:` }</div>
                        <textarea className={'ResultsTextArea boxed-in scrollable resizable terminal-font'}
                            disabled={ true }
                            value={ artefact.enrichment.info.error }
                        />
                    </div>    
                    : null
                }
                {
                    (artefact.enrichment.info.body) ? 
                    <div className='SelectableExtendedChild'>
                        <button 
                            className={ 'ResultsDownloadButton' }
                            onClick={ () => { this.downloadArtefactContent() } }
                        >Download</button>
                    </div>
                    : null
                }
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'> ShuckID: '}</span>
                    { artefact.id }
                </div>
            </div>;
        }else{
            return <div className={ 'SelectableExtended' }>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'> File Type: '}</span>
                    { artefact.enrichment.info.file_type }
                </div>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'> File Size: '}</span>
                    { artefact.enrichment.info.size }
                </div>
                <div className='SelectableExtendedChild'>
                    <div className='SelectableExtendedChildTitle'>{ `> Data:` }</div>
                    <div className='ResultsMiniButtonContainer'>
                        <button className="ResultsMiniButton" onClick={() => {this.setState({'encoding':'utf8'})}}>UTF8</button>
                        <button className="ResultsMiniButton" onClick={() => {this.setState({'encoding':'base64'})}}>BASE64</button>
                    </div>
                    <textarea className={'ResultsTextArea boxed-in scrollable resizable terminal-font'}
                        disabled={ true }
                        value={ 
                                (this.state.encoding == 'utf8') ? 
                                new TextDecoder('utf-8').decode(decode(artefact.data)) :
                                artefact.data
                            }
                    />
                </div>
                <div className='SelectableExtendedChild'>
                    <button 
                        className={ 'ResultsDownloadButton' }
                        onClick={ () => { this.downloadArtefactContent() } }
                    >Download</button>
                </div>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'> ShuckID: '}</span>
                    { artefact.id }
                </div>
            </div>;
        }
    }

    downloadArtefactContent(){
        let fileName = this.props.selectedArtefact.id;
        let content = [
            (this.props.selectedArtefact.type === 'url') ? 
            decode(this.props.selectedArtefact.enrichment.info.body) : 
            decode(this.props.selectedArtefact.data)
        ];
        let blob = new Blob(content, {'type':'application/octet-stream'});
        if(window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }else{
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    renderResults(){
        if(!this.props.selectedArtefact){
            return null;
        }

        let artefact = this.props.selectedArtefact;
        let renderedResults = [];

        //First add artefact.enrichment.info to the results
        renderedResults.push(
            <Selectable
                selected={ this.state.selected == artefact.id }
                overrideClass={ 'SelectableResult' }
                waitingForSubmission={ this.props.waitingForSubmission }
                selectableTitle={ `[DETAILS] ${artefact.name}` }
                selectableExtended={ this.renderArtefactDetails(artefact) }
                selectableKey={ artefact.id }
                highlightSelected={ this.highlightSelectedResults}
                toggleSelected={ this.toggleSelected }
            />
        );

        //Then add all results (DECREMENTING - LAST PRESENTED AT TOP!!)
        console.log(`Artefact has ${artefact.enrichment.results.length} results. Rendering...`);
       for(let i=artefact.enrichment.results.length - 1; i > -1; i--){
           let result = artefact.enrichment.results[i];
           console.log(`Current result:`);
           console.log(result);
           renderedResults.push(
               <Selectable
                selected={ this.state.selected == result.id }
                overrideClass={ 'SelectableResult' }
                waitingForSubmission={ this.props.waitingForSubmission }
                selectableTitle={ `[${result.timestamp}] ${result.tool}` }
                selectableExtended={ this.renderResultsExtended(result.result) }
                selectableKey={ result.id }
                highlightSelected={ this.highlightSelectedResults }
                toggleSelected={ this.toggleSelected }
               />
           );
       }
       
        return renderedResults;
    }

    render() {
        return <div
                    className={ 'SelectableContainer boxed-in scrollable' }
                >
                { this.renderResults() }
                </div>
    }
}