import React from 'react';

export default class Timer extends React.Component {
  constructor() {
    super();
    this.state = { timer: null };
    this.interval = null;
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.tick();
    this.interval = setInterval(this.tick, 1000);
  }

  tick() {
    const date = new Date();
    const hoursLeft = 23 - date.getUTCHours();
    const minutesLeft = 59 - date.getUTCMinutes();
    const secondsLeft = 59 - date.getUTCSeconds();

    this.setState({
      timer: `${hoursLeft < 10 ? '0' + hoursLeft.toString() : hoursLeft}:${minutesLeft < 10 ? '0' + minutesLeft.toString() : minutesLeft}:${secondsLeft < 10 ? '0' + secondsLeft.toString() : secondsLeft}`
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProp, prevState) {
    if (prevState.timer === '00:00:00') {
      if (this.props.handleEditable) {
        this.props.handleEditable();
      }
    }
  }

  render() {
    return (
      <p className='timer'>{this.state.timer}</p>
    );
  }
}
