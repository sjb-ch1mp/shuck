import React from "react";

//Style
import './style/components.css';

export class Notifier extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render () {
        return <div id='notifier-container' className={ `boxed-in hidden` } onClick={ () => {this.props.toggleNotification(false, '', ''); } }>
                    <textarea 
                        id='notifier'
                        className={ `not-scrollable notifier-font boxed-in` }
                        disabled={ true }
                        defaultValue={ '' }
                        spellCheck={ false }
                    />
                </div>;
    }
    //
}