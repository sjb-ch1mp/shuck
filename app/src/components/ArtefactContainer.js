import React from "react";

//Components
import Artefact from "./Artefact";

export class ArtefactContainer extends React.Component {

    constructor (props) {
        super(props);
        this.props = props;

        this.renderArtefacts = this.renderArtefacts.bind(this);
    }

    renderArtefacts () {
        console.log((this.props.enrichment_packages) ? this.props.enrichment_packages: '');
        if(this.props.enrichment_packages){
            return this.props.enrichment_packages.map(({id, type, enrichment_package}) => <Artefact id={ id } type={ type } data={ enrichment_package }></Artefact>);
        }
    }

    render () {
        return <div className={ `ArtefactContainer boxed-in scrollable ${ this.props.hidden }` } >{ this.renderArtefacts() }</div>;
    }
}