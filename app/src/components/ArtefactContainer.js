import React from "react";

//Components
import Selectable from "./Selectable";

export class ArtefactContainer extends React.Component {

    constructor (props) {
        super(props);
        this.props = props;

        this.state = {
            'selected':this.props.selected
        };

        this.renderArtefacts = this.renderArtefacts.bind(this);
        this.highlightSelectedArtefact = this.highlightSelectedArtefact.bind(this);
    }

    highlightSelectedArtefact (id) {
        this.setState({
            'selected':(this.state.selected === id) ? null : id
        });
    }

    prepareArtefactExtendedText(artefact){
        let extendedText = null;
        if(artefact.type === 'url'){
            extendedText = <div className='SelectableExtended'>
                            </div>
        }else{
            extendedText = <div className='SelectableExtended'>
                                <div className='SelectableExtendedChild'>
                                    <span className='SelectableExtendedChildTitle'>{'File Type: '}</span>
                                    { artefact.enrichment.info.file_type }
                                </div>
                                {artefact.enrichment.info.created_by ? 
                                    <div className='SelectableExtendedChild'>
                                        <span className='SelectableExtendedChildTitle'>{'Created By: '}</span>
                                        { artefact.enrichment.info.created_by}
                                    </div> : 
                                ''}
                                <div className='SelectableExtendedChild'>
                                    <span className='SelectableExtendedChildTitle'>{'ShuckID: '}</span>
                                    { artefact.id }</div>
                            </div>
        }
        return extendedText;
    }

    renderArtefacts () {
        let artefacts = [];
        for(let i in this.props.artefacts){
            let artefact = this.props.artefacts[i];
            let extendedText = this.prepareArtefactExtendedText(artefact);
            artefacts.push(
                <Selectable 
                    selectableKey={ artefact.id } 
                    selectableTitle={ `[${artefact.type.toUpperCase()}] ${artefact.name}` } 
                    selected={ (this.state.selected === artefact.id) ? true : false }
                    toggleSelected={ this.props.toggleSelectedArtefact }
                    highlightSelected={ this.highlightSelectedArtefact }
                    selectableExtended={ extendedText }
                    waitingForSubmission={ this.props.waitingForSubmission }
                />
            );
        }
        return artefacts;
    }

    render () {
        return <div 
                    className={ `SelectableContainer boxed-in scrollable ${ this.props.hidden }` } 
                    onDrop={ (e) => {
                        if(!this.props.waitingForSubmission){
                            this.props.submitFiles(e)
                        } 
                    }}
                    onPaste={ (e) => {
                        if(!this.props.waitingForSubmission){
                            this.props.submitURLs(e) 
                        }
                    }}
                >{ this.renderArtefacts() }</div>;
    }
}