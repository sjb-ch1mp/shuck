import React from 'react';

//Style
import './style/components.css';
import { Title } from './Title';
import { ToolOptions } from './ToolOptions';

export class Results extends React.Component {
    render () {
        return <div className={'Results default-margins container-frame titled'}>
                    <ToolOptions/>
                    <textarea className={'scrollable boxed-in'} disabled='true' />
                    <Title title='Results'/>
                </div>;
    }
}