import React from "react";

export class ButtonContainer extends React.Component {

    constructor (props) {
        super(props);
        this.props = props;
    }

    render () {
        return <div className={ `ButtonContainer boxed-in ${ this.props.hidden }` }></div>;
    }
}