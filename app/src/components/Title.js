import React from "react";

export class Title extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
    }

    render () {
        return <div 
                className={`Title boxed-in ${(this.props.hidden)? 'hidden': ''} ${this.props.customClasses}`}
                >{ this.props.title }</div>
    }
}