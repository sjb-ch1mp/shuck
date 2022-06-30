import React from "react";

//Style
import './style/components.css';

//Resources
import logo from '../img/logo.png';

export class Banner extends React.Component {
    render () {
        return <div className={'Banner default-margins'}>
            <img src={logo} className={'logo'}></img>
        </div>;
    }
}