import React from "react";

export default class Artefact extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    render () {
        return <div className= {`Artefact${(this.props.selected) ? '-selected': ''}`} onClick={ () => { this.props.highlightSelectedArtefact(this.props.index); this.props.toggleSelectedArtefact(this.props.index) } }>
                { `${ this.props.index }: ${this.props.id} (${ this.props.type })` }
                </div>;
    }

}