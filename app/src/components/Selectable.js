import React from "react";

export default class Selectable extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    render () {
        console.log(`Rendering selectable ${this.props.selectableTitle}`);
        return <div 
                    className= {`Selectable${(this.props.selected) ? '-selected': ''}`}     
                    onClick={ () => { this.props.highlightSelected(this.props.selectableKey); this.props.toggleSelected(this.props.selectableKey) } }
                >
                { this.props.selectableTitle }
                    <div className={`SelectableExtended ${(this.props.selected) ? '' : 'hidden'}`}>{ this.props.selectableExtended }</div>
                </div>;
    }

}