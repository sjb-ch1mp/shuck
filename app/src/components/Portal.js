import * as React from "react";

//Style
import './style/components.css';

//Components
import { Title } from "./Title";
import { Notifier } from "./Notifier";
import { ArtefactContainer } from "./ArtefactContainer";

export class Portal extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }

    render () {
        return <div className={'Portal container-frame titled boxed-in'}>
                    <ArtefactContainer 
                        hidden={ `${ (this.props.artefactView) ? '' : 'hidden' }` } 
                        artefacts={ this.props.artefacts }
                        toggleSelectedArtefact={ this.props.toggleSelectedArtefact }
                        submitFiles={ this.props.submitFiles }
                        submitURLs={ this.props.submitURLs }
                    />
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
                    <Title title={ `${ (this.props.artefactView) ? 'ARTEFACTS' : 'INPUT' }` } />
                </div>;
    }
}