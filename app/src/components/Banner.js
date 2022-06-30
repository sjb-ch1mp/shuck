import React from "react";

//Style
import './style/components.css';


export class Banner extends React.Component {

    openReadme() {
        let anchor = document.createElement('a');
        anchor.id = 'temp_readme';
        anchor.href = 'https://github.com/sjb-ch1mp/shuck/blob/master/README.md';
        anchor.target = '_blank';
        anchor.click();
    }

    render () {
        return <div onClick={() => {this.openReadme()}} className={'Banner default-margins'}></div>;
    }
}