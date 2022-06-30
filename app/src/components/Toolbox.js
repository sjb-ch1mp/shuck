import React from "react";

//Style
import './style/components.css';
import { Title } from "./Title";
import { ButtonContainer } from "./ButtonContainer";

export class Toolbox extends React.Component {
    render () {
        return <div className='Toolbox default-margins container-frame titled'>
            <ButtonContainer/>
            <Title title='Toolbox'/>
        </div>;
    }
}