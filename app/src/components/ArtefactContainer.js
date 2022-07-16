import React from "react";

//Components
import Selectable from "./Selectable";

export class ArtefactContainer extends React.Component {

    constructor (props) {
        super(props);
        this.props = props;

        this.state = {
            'selected':null
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
                                <div className='SelectableExtendedChild'>{ `Status: ${artefact.enrichment.info.status}` }</div>
                                
                            </div>
                            //IP: 
                            //File Type:
        }else{
            extendedText = <div className='SelectableExtended'>
                                <div className='SelectableExtendedChild'>{ `File Type: ${artefact.enrichment.info.file_type}` }</div>
                                <div className='SelectableExtendedChild'>{ `Shuck ID: ${artefact.id}`}</div>
                                {artefact.enrichment.info.created_by ? <div className='SelectableExtendedChild'>{`Created By: ${artefact.enrichment.info.created_by}`}</div> : ''}
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
                />
            );
        }
        return artefacts;
    }

    render () {
        return <div 
                    className={ `SelectableContainer boxed-in scrollable ${ this.props.hidden }` } 
                    onDrop={ (e) => this.props.submitFiles(e) }
                    onPaste={ (e) => this.props.submitURLs(e) }
                >{ this.renderArtefacts() }</div>;
    }
}