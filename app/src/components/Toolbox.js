import React from "react";

//Style
import './style/components.css';
import { Title } from "./Title";
import { ToolContainer } from "./ToolContainer";

export class Toolbox extends React.Component {
    
    constructor (props) {
        super(props);
        this.props = props;
    }

    render () {
        return <div className='Toolbox default-margins container-frame titled'>
            <ToolContainer toggleSelected={ this.props.toggleSelected }/>
            <Title title='TOOLBOX'/>
        </div>;
    }
}