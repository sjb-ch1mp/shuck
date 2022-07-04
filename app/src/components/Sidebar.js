import React from 'react';

//Style
import './style/components.css';

//Components
import { Thinker }      from "./Thinker.js";
import { Portal }       from "./Portal.js";
import { Banner }       from "./Banner.js";

export class Sidebar extends React.Component{

    constructor(props){
        super(props);
        this.props = props;
    }

    render(){
        return <div className={`Sidebar default-margins`}>
            <Banner/>
            <Portal 
              artefactView={ this.props.artefactView } 
              submitURLs={ this.props.submitURLs } 
              submitFiles={ this.props.submitFiles } 
              updateSubmission={ this.props.updateSubmission } 
              toggleNotification={ this.props.toggleNotification }
              notify={ this.props.notify }
              message={ this.props.message }
              artefacts={ this.props.artefacts }
              toggleSelectedArtefact={ this.props.toggleSelectedArtefact }
              ></Portal>
            <Thinker getShuckin={ this.props.getShuckin } waitingForSubmission={ this.props.waitingForSubmission }/>
        </div>;
    }
}