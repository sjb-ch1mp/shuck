import React from "react";

//Style
import './style/components.css';
import { Title } from "./Title";
import { ToolContainer } from "./ToolContainer";

export class Toolbox extends React.Component {
    render () {
        return <div className='Toolbox default-margins container-frame titled'>
            <ToolContainer/>
            <Title title='TOOLBOX'/>
        </div>;
    }
}