import React from 'react';

//Style
import './style/components.css';
import { Title } from './Title';

export class Results extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render () {
        return <div className={'Results default-margins container-frame titled'}>
                <Title title='RESULTS'/>
                <textarea className={'scrollable boxed-in terminal-font'} spellCheck={ false }/>   
                </div>;
    }
}