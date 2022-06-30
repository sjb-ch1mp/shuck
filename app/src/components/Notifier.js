import React from "react";

//Style
import './style/components.css';

export class Notifier extends React.Component {
    render () {
        return <div className={'Notifier'}>
                    <textarea 
                        className={'not-scrollable ui-font boxed-in'}
                        disabled='true'
                    />
                </div>;
    }
}