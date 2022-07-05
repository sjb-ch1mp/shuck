import React from "react";

//Components
import Tools from "./Tools";
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
        return `File Types: ${tool.file_types.join(', ')}`;
    }

    renderTools () {
        let tools = Tools();
        let renderedTools = [];
        for(let i in tools){
            let tool = tools[i];
            let extendedText = this.prepareToolExtendedText(tool);
            renderedTools.push(
                <Selectable 
                    selectableKey={ tool.name } 
                    selectableTitle={ tool.name } 
                    selectableData={ tool } 
                    selected={ (this.state.selected === tool.name) ? true : false }
                    toggleSelected={ this.props.toggleSelected }
                    highlightSelected={ this.highlightSelectedTool }
                    selectableExtended={ extendedText }
                />
            );
        }
        return renderedTools;
    }

    render () {
        return <div className={ `SelectableContainer boxed-in scrollable` }>{ this.renderTools() }</div>;
    }
}