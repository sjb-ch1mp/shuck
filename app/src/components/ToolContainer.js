import React from "react";

//Style
import './style/components.css';

//Components
import Selectable from "./Selectable";

export class ToolContainer extends React.Component {
    
    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            'selected':null
        };

        this.highlightSelectedTool = this.highlightSelectedTool.bind(this);
        this.prepareToolExtendedText = this.prepareToolExtendedText.bind(this);
        this.renderTools = this.renderTools.bind(this);
    }
    
    highlightSelectedTool (key) {
        this.setState({
            'selected':(this.state.selected === key) ? null : key
        });
    }

    prepareToolExtendedText(tool){
        let extendedText = <div className='SelectableExtended'>
                                <div className='SelectableExtendedChild'>
                                    <span className='SelectableExtendedChildTitle'>{'File Types: '}</span>
                                    {tool.file_types.join(', ')}
                                </div>
                                <div className='SelectableExtendedChild'>
                                    <span className='SelectableExtendedChildTitle'>{'Author: '}</span>
                                    <a href={ tool.attribution.website } target='_blank'>{tool.attribution.author}</a>
                                </div>
                            </div>
        return extendedText;
    }

    renderTools () {
        let tools = this.props.tools;
        let renderedTools = [];
        for(let i in tools){
            let tool = tools[i];
            renderedTools.push(
                <Selectable 
                    selectableKey={ tool.name } 
                    selectableTitle={ `> ${tool.name}` } 
                    selected={ (this.state.selected === tool.name) ? true : false }
                    toggleSelected={ this.props.toggleSelected }
                    highlightSelected={ this.highlightSelectedTool }
                    selectableExtended={ this.prepareToolExtendedText(tool) }
                    selectableOverrideClass={ 'SelectableTool' }
                />
            );
        }
        return renderedTools;
    }

    render () {
        return <div className={ `SelectableContainer boxed-in scrollable` }>{ this.renderTools() }</div>;
    }
}