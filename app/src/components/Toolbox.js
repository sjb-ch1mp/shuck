import React from "react";

//Style
import './style/components.css';
import { Title } from "./Title";
import { ToolContainer } from "./ToolContainer";
import { ToolOptions } from './ToolOptions';

export class Toolbox extends React.Component {
    
    constructor (props) {
        super(props);
        this.props = props;
    }

    render () {
        return <div className='Toolbox default-margins container-frame titled boxed-in'>
                    <Title rotated={ true } title='TOOLBOX'/>
                    <ToolContainer toggleSelected={ this.props.toggleSelected } tools={ this.props.tools }/>
                    <ToolOptions toolOptions={ this.props.toolOptions } updateSelectedToolOption={ this.props.updateSelectedToolOption }/>
                    <Title customClasses={'ToolOptionTitle'} hidden={(this.props.toolOptions.length > 0) ? false : true} title={ 'OPTIONS' } ></Title>
                </div>;
    }
}