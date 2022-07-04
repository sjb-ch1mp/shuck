import React from "react";

//Components
import Artefact from "./Artefact";

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
        this.setState({
            'selected':(this.state.selected === key) ? -1 : parseInt(key)
        });
    }

    renderArtefacts () {
        let artefacts = [];
        for(let i in this.props.artefacts){
            let artefact = this.props.artefacts[i];
            artefacts.push(
                <Artefact 
                    index={ artefact.key } 
                    id={ artefact.id } 
                    type={ artefact.type } 
                    data={ artefact.enrichment_package } 
                    selected={ (this.state.selected === artefact.key) ? true : false }
                    toggleSelectedArtefact={ this.props.toggleSelectedArtefact }
                    highlightSelectedArtefact={ this.highlightSelectedArtefact }
                />
            );
        }
        return artefacts;
    }

    render () {
        return <div className={ `ArtefactContainer boxed-in scrollable ${ this.props.hidden }` } >{ this.renderArtefacts() }</div>;
    }
}