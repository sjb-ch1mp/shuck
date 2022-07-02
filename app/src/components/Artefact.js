import React from "react";

export default class Artefact extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    render () {
        console.log(`Calling render on artefact with id ${ this.props.id }`);
        return <div
                    className='Artefact'
                >{ this.props.id }</div>;
    }

}