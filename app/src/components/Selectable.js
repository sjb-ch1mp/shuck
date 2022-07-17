import React from "react";

export default class Selectable extends React.Component {

    constructor(props){
        super(props);
        this.props = props;

        /* 
        props = {
            selected 
            selectableOverrideClass
            waitingForSubmission
            selectableTitle
            selectableExtended
            selectableKey
            highlightSelected()
            toggleSelected()
        }  
        */
    }

    render () {
        return <div 
                    className= {`${this.props.overrideClass ? this.props.overrideClass : 'Selectable'}${(this.props.selected) ? '-selected': ''} ${this.props.selected ? this.props.selectableOverrideClass : ''}`}     
                >
                    <div 
                        className={'SelectableTitle'} 
                        onClick={ () => {
                            if(!this.props.waitingForSubmission){
                                this.props.highlightSelected(this.props.selectableKey); 
                                this.props.toggleSelected(this.props.selectableKey);
                            }
                        } }
                    >{ this.props.selectableTitle }</div>
                    <div className={`${(this.props.selected) ? '' : 'hidden'}`}>{ this.props.selectableExtended }</div>
                </div>;
    }

}