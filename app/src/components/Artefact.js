import React from "react";

export default class Artefact extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    render () {

        return <div className='Artefact' onClick={ this.props.selectArtefact }>
                { `${ this.props.index }: ${this.props.id} (${ this.props.type })` }
                </div>;
    }

}