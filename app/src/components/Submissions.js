import React from "react";

//Style
import './style/components.css';

//Components
import { Title } from "./Title";
import { ButtonContainer } from "./ButtonContainer";

export class Submissions extends React.Component {
    render () {
        return <div className="Submissions default-margins container-frame titled">
            <ButtonContainer />
            <Title title='Artefacts' />
        </div>;
    }
}