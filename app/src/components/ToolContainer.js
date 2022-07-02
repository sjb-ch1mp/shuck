import React from "react";

export class ToolContainer extends React.Component {
    
    constructor(props){
        super(props);
        this.props = props;
    }
    
    render () {
        return <div className={ `ToolContainer boxed-in` }></div>;
    }
}