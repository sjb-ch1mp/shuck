import React from "react";

export default class Selectable extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    render () {
        return <div 
                    className= {`Selectable${(this.props.selected) ? '-selected': ''} ${this.props.selected ? this.props.selectableOverrideClass : ''}`}     
                    onClick={ () => { this.props.highlightSelected(this.props.selectableKey); this.props.toggleSelected(this.props.selectableKey) } }
                >
                { this.props.selectableTitle }
                    <div className={`${(this.props.selected) ? '' : 'hidden'}`}>{ this.props.selectableExtended }</div>
                </div>;
    }

}