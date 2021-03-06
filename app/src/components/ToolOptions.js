import React from "react";

//Style
import './style/components.css';

//Components
import { Title } from './Title';

export class ToolOptions extends React.Component {

    constructor (props) {
        super(props);
        this.props = props;

        this.renderOptions = this.renderOptions.bind(this);
    }

    renderOptions () {
        let renderedOptions = [];
        let options = this.props.toolOptions;
        for(let i in options){
            let option = options[i];
            renderedOptions.push(
                <div
                    className={ `ToolOption${ (option.selected) ? '-selected' : '' } boxed-in` } 
                    onClick={ (e) => {
                        if(e.target.id==='tool_option_input' || this.props.waitingForSubmission ){return;} 
                        this.props.updateSelectedToolOption(option.flag, 'toggle')
                    } }
                >
                { option.flag }
                { (!/^(boolean|static)/.test(option.type) && option.selected) ? <input
                    id='tool_option_input'
                    type='text' 
                    className={`ToolOptionValue boxed-in`}
                    onChange={ (e) => this.props.updateSelectedToolOption(option.flag, 'change_value', e.target.value) }
                    value={ option.value }
                    disabled={ this.props.waitingForSubmission }
                /> : '' }
                </div>
            );
        }
        return renderedOptions;
    }

    render () {
        return <div className={`ToolOptions boxed-in scrollable titled ${(this.props.toolOptions.length > 0) ? '': 'hidden'}`}>
                { this.renderOptions() }
                </div>;
    }
}