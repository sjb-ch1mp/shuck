import * as React from "react";

//Style
import './style/components.css';

//Components
import { Title } from "./Title";
import { Notifier } from "./Notifier";
import { ButtonContainer } from "./ButtonContainer";

export class Portal extends React.Component {

    constructor(props){
        super(props);
        this.props = props;

        /*
        this.state = {
            'welcomeMessage':'=== Welcome to Shuck ===\n\n' + 
                            'Shuck will take a list of URLs or a set of files and allow you to analyse them with a collection of open source static analysis tools.\n\n' + 
                            'To submit URLs, paste them into this INPUT portal. Shuck will automatically parse any text entered into this portal and extract valid URLs for you.\n\n' + 
                            'To submit files, simply drag and drop them into this INPUT portal.\n\n' + 
                            'Please note that Shuck will only accept up to 20 URLs at a time, and up to 35MB worth of files.'
        };*/
    }

    render () {
        return <div className={'Portal container-frame titled boxed-in'}>
                    <ButtonContainer hidden={ `${ (this.props.artefactView) ? '' : 'hidden' }` } />
                    <textarea
                        id='portal'
                        className={`scrollable boxed-in terminal-font ${(this.props.artefactView) ? 'hidden' : ''}`} 
                        spellCheck={ false }
                        onDrop={ e => { this.props.submitFiles(e); } }
                        value={ this.props.message }
                        onPaste={ e => { this.props.submitURLs(e); } }
                        onChange={ this.props.updateSubmission }
                    />
                    <Notifier notify={ this.props.notify } toggleNotification={ this.props.toggleNotification }/>
                    <Title title='INPUT' />
                </div>;
    }
}