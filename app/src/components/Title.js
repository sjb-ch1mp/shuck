import React from "react";

export class Title extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
    }

    render () {
        return <div className={'Title'}>{ this.props.title }</div>
    }
}