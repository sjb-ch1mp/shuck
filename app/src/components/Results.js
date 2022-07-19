import React from 'react';

//Style
import './style/components.css';

//Components
import { Title } from './Title';
import { ResultsContainer } from './ResultsContainer';

export class Results extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
    }

    render () {
        return <div className={'Results default-margins container-frame titled'}>
                <Title title='RESULTS'/>
                {
                    this.props.showHelp ? 
                    <textarea 
                        className={'scrollable boxed-in terminal-font'} 
                        spellCheck={ false }
                        value={ this.props.results }    
                    /> : 
                    <ResultsContainer
                        selectedArtefact={ this.props.selectedArtefact }
                        selectedOnRender={ this.props.selectedOnRender }
                        toggleSelectedResult={ this.props.toggleSelectedResult }
                        newResult={ this.props.newResult }
                    />
                }
                </div>;
    }
}