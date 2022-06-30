import React from "react";

//Style
import './style/components.css';

//Components
import { Title } from "./Title";

export class Portal extends React.Component {
    render () {
        return <div className={'Portal container-frame titled'}>
                    <textarea className={'scrollable boxed-in terminal-font'} disabled='true'/>
                    <Title title='Input' />
                </div>;
    }
}