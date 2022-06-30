import React            from 'react';

//Resources
import thinker              from '../img/thinking_still.png';
import thinker_mouseover    from '../img/thinking_hover.png';
import thinker_thinking     from '../img/thinking.png';

//Style
import './style/components.css';
import './style/animate.css';

export class Thinker extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            'img':thinker,
            'class':''
        };
        this.wakeUp = this.wakeUp.bind(this);
        this.goBackToSleep = this.goBackToSleep.bind(this);
        this.think = this.think.bind(this);
    }

    wakeUp() {
        this.setState({
            'img':thinker_mouseover,
            'class':'thinker_mouseover'
        });
    }

    goBackToSleep() {
        this.setState({
            'img':thinker,
            'class':'thinker_mouseleave'
        });
    }

    think() {
        this.setState({
            'img':thinker_thinking,
            'class':'thinker_thinking'
        });
    }

    render () {

        return <div className={'Thinker'}>
            <img 
                id='thinker' 
                src={ this.state.img } 
                className={ this.state.class }
                onMouseOver={ () => {this.wakeUp()}}
                onMouseLeave={ () => {this.goBackToSleep()}}
            />
        </div>;
    }
}