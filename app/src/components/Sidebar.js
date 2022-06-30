import React from 'react';

//Style
import './style/components.css';

//Components
import { Thinker }      from "./Thinker.js";
import { Portal }       from "./Portal.js";
import { Notifier }     from "./Notifier.js";
import { Banner }       from "./Banner.js";

export class Sidebar extends React.Component{
    render(){
        return <div className={'Sidebar default-margins'}>
            <Banner/>
            <Portal/>
            <Notifier/>
            <Thinker/>
        </div>;
    }
}