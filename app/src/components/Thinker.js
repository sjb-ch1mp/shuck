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
            'animate':'thinker'
        };
    }

    wakeUp() {
        this.setState({'img':thinker_mouseover,'animate':'thinker-mouseover'});
    }

    goBackToSleep(force) {
        if(!force && !this.state.thinking){
            this.setState({'img':thinker, 'animate':'thinker-mouseleave'});
        }   
    }

    think() {
        this.setState({'img':thinker_thinking, 'animate':'thinker-thinking'});
    }

    render () {

        return <div className={'Thinker'}>
            <img 
                id='thinker' 
                src={ (this.props.waitingForSubmission) ? thinker_thinking : this.state.img } 
                className={ (this.props.waitingForSubmission) ? 'thinker-thinking' : this.state.animate }
                onMouseOver={ () => { (!this.props.waitingForSubmission) ? this.wakeUp() : this.think() }}
                onMouseLeave={ () => { (!this.props.waitingForSubmission) ? this.goBackToSleep() : this.think() }}
                onClick={ this.props.getShuckin }
            />
        </div>;
    }
}