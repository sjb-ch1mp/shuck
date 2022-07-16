import React from 'react';

//Style
import './style/components.css';
import { Title } from './Title';

export class Results extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;

        this.renderResults = this.renderResults.bind(this);
    }

    renderResults(){
        let results = '';
        let numResults = this.props.results.length;
        if(numResults > 0){
            for(let i in this.props.results){
                results = results + `>> shuck: ${this.props.results[i].timestamp} Results for tool ${this.props.results[i].tool} on ${this.props.results[i].artefact}:\n\n`;
                results = results + `${this.props.results[i].result}\n\n`;
            }
        }
        return results;
    }

    render () {
        return <div className={'Results default-margins container-frame titled'}>
                <Title title='RESULTS'/>
                <textarea 
                    className={'scrollable boxed-in terminal-font'} 
                    spellCheck={ false }
                    value={ this.renderResults() }    
                />   
                </div>;
    }
}