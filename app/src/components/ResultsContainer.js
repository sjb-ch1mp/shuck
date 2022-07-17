import React from "react";

//Style
import './style/components.css';

//Utilities
import { decode } from 'base64-arraybuffer';

//Components
import Selectable from './Selectable.js';

export class ResultsContainer extends React.Component {

    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            'selected':this.props.selectedOnRender
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

    }

    renderArtefactDetails(artefact){
        if(artefact.type === 'url'){
            return <div className={ 'SelectableExtended' }>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'ShuckID: '}</span>
                    { artefact.id }
                </div>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'Hostname: '}</span>
                    { artefact.name }
                </div>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'Status: '}</span>
                    { artefact.enrichment.info.status }
                </div>
                <div className='SelectableExtendedChild'>
                    <span className='SelectableExtendedChildTitle'>{'Mime Type: '}</span>
                    { artefact.enrichment.info.file_type }        
                </div>
                <div className='SelectableExtendedChild'>
                    <div className='SelectableExtendedChildTitle'>{ `Headers` }</div>
                    <textarea className={'ResultsTextArea boxed-in scrollable terminal-font hold-dimensions'}
                        disabled={ true }
                        value={ artefact.enrichment.info.headers }
                    />
                </div>
                <div className='SelectableExtendedChild'>
                    <div className='SelectableExtendedChildTitle'>{ `Body (Raw)` }</div>
                    <textarea className={'ResultsTextArea boxed-in scrollable terminal-font hold-dimensions'}
                        disabled={ true }
                        value={ decode(artefact.enrichment.info.body) }
                    />
                </div>
                <div className='SelectableExtendedChild'>
                    <button 
                        className={ 'ResultsDownload' }
                        onClick={ () => { this.downloadArtefactContent() } }
                    >Download Artefact</button>
                </div>
            </div>;
        }else{

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
        /*Selectable.props = {
                selected 
                selectableOverrideClass
                waitingForSubmission
                selectableTitle
                selectableExtended
                selectableKey
                highlightSelected()
                toggleSelected()
            }  
        */
        if(!this.props.selectedArtefact){
            return null;
        }

        let artefact = this.props.selectedArtefact;
        let renderedResults = [];

        //First add artefact.enrichment.info to the results
        /* URL
            'id':md5(result.url.href),
                'name':result.url.hostname,
                'data':result.url.href,
                'type':'url',
                'enrichment': 'info':{
                        'success':true,
                        'status':result.response.status,
                        'headers':result.response.headers,
                        'body':result.response.data
                    },
        */

        /* FILE
            'id':md5(request.body.files[i].content),
            'name':request.body.files[i].name,
            'data':request.body.files[i].content,
            'type':'file',
            'enrichment':{
                'info':{
                    'size':request.body.files[i].size,
                    'file_type':null
                },
                'results':[]
            }    
        
        */
        renderedResults.push(
            <Selectable
                selected={ this.state.selected == artefact.id }
                selectableOverrideClass={ 'SelectableResult' }
                waitingForSubmission={ this.props.waitingForSubmission }
                selectableTitle={ artefact.type == 'url' ? artefact.data : artefact.name }
                selectableExtended={ this.renderArtefactDetails(artefact) }
                selectableKey={ artefact.id }
                highlightSelected={ this.highlightSelectedResults}
                toggleSelected={ this.toggleSelected }
            />
        );

        //Then add all results (DECREMENTING - LAST PRESENTED AT TOP!!)
        /* Each result has this: 
        {
            'timestamp':Date.now(),
            'tool':response.data.tool,
            'result':response.data.result,
            'success':response.data.success
          }
        */
       
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