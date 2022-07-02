import React from "react";

//Style
import './style/components.css';

export class Notifier extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render () {
        return <div id='notifier-container' className={ `boxed-in ${ (this.props.notify.active) ? `${ this.props.notify.type }-border` : 'hidden' }` } onClick={ () => { this.props.toggleNotification(null) } }>
                    <textarea 
                        id='notifier'
                        className={ `not-scrollable notifier-font boxed-in ${ this.props.notify.type }` }
                        value={ this.props.notify.message }
                        spellCheck={ false }
                    />
                </div>;
    }
    //
}