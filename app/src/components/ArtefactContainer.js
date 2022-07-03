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
        if(this.props.enrichment_packages){
            console.log(this.props.enrichment_packages);
            return this.props.enrichment_packages.map(
                function(artefact){
                    return <Artefact index={ artefact.key } id={ artefact.id } type={ artefact.type } data={ artefact.enrichment_package }></Artefact>
                });
        }
    }

    render () {
        return <div className={ `ArtefactContainer boxed-in scrollable ${ this.props.hidden }` } >{ this.renderArtefacts() }</div>;
    }
}