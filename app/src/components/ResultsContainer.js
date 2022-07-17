import React from "react";

//Style
import './style/components.css';

export class ResultsContainer extends React.Component {

    constructor(props){
        super(props);
        this.props = props;

        this.state = {
            'selected':null
        }

        this.highlightSelectedResults = this.highlightSelectedResults.bind(this);
        this.renderResultsExtended = this.renderResultsExtended.bind(this);
        this.renderResults = this.renderResults(this);
    }

    highlightSelectedResults(id){
        this.setState({
            'selected':(this.state.selected === id) ? null : id
        });
    }

    renderResultsExtended(result){

    }

    renderResults(){

    }

    render() {
        return <div
                    className={ 'ResultsContainer boxed-in scrollable' }
                >
                { this.renderResults() }
                </div>
    }
}