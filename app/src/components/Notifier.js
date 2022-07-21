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
                    {(this.props.notify.positiveResponse) ? 
                    <div className={ `notifier-font boxed-in ${ this.props.notify.type }` }>
                        { this.props.notify.message }
                        <div className='notifier-font NotifierButtonContainer'>
                        <button 
                            className='NotifierPositiveButton notifier-font'
                            onClick={() => {
                                this.props.notify.positiveResponse.callback()
                            }}>
                            {this.props.notify.positiveResponse.text}
                        </button>
                        <button 
                            className='NotifierNegativeButton notifier-font'
                            onClick={() => {
                                this.props.notify.negativeResponse.callback()
                            }}>
                            {this.props.notify.negativeResponse.text}
                        </button>
                        </div>
                    </div> : 
                    <textarea 
                        id='notifier'
                        className={ `not-scrollable notifier-font boxed-in ${ this.props.notify.type }` }
                        value={ this.props.notify.message }
                        spellCheck={ false }
                        readOnly={ true }
                    />
                    }
                </div>;
    }
    //
}