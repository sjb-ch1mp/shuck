import React from "react";

//Components
import Selectable from "./Selectable";

export class ArtefactContainer extends React.Component {

    constructor (props) {
        super(props);
        this.props = props;

        this.state = {
            'selected':-1
        };

        this.renderArtefacts = this.renderArtefacts.bind(this);
        this.highlightSelectedArtefact = this.highlightSelectedArtefact.bind(this);
    }

    highlightSelectedArtefact (key) {
        console.log(`Selecting artefact ${key}`);
        this.setState({
            'selected':(this.state.selected === key) ? -1 : parseInt(key)
        });
    }

    prepareArtefactExtendedText(data){
        console.log(data);
        return 'TEST HEADING: Test Value';
    }

    renderArtefacts () {
        let artefacts = [];
        for(let i in this.props.artefacts){
            let artefact = this.props.artefacts[i];
            let extendedText = this.prepareArtefactExtendedText(artefact);
            artefacts.push(
                <Selectable 
                    selectableKey={ artefact.key } 
                    selectableTitle={ `${artefact.key}: ${artefact.id} (${artefact.type})` } 
                    selectableData={ artefact } 
                    selected={ (this.state.selected === artefact.key) ? true : false }
                    toggleSelected={ this.props.toggleSelectedArtefact }
                    highlightSelected={ this.highlightSelectedArtefact }
                    selectableExtended={ extendedText }
                />
            );
        }
        return artefacts;
    }

    render () {
        return <div className={ `ArtefactContainer boxed-in scrollable ${ this.props.hidden }` } >{ this.renderArtefacts() }</div>;
    }
}