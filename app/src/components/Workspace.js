import React from 'react';

//Style
import './style/components.css';

//Components
import { Sidebar }      from "./Sidebar.js";
import { Results }      from "./Results.js";
import { Toolbox }      from "./Toolbox.js";
import { Submissions }  from "./Submissions.js";

export class Workspace extends React.Component{
    render(){
        return <div className={'Workspace not-scrollable'}>
            <Sidebar/>
            <Submissions/>
            <Toolbox/>
            <Results/>
        </div>;
    }
}