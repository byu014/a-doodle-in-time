import React from 'react';

export default class Timer extends React.Component {
  constructor() {
    super();
    this.state = { timer: null };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.tick();
    setInterval(this.tick, 1000);
  }

  tick() {
    const date = new Date();
    const hoursLeft = 23 - date.getUTCHours();
    const minutesLeft = 59 - date.getUTCMinutes();
    const secondsLeft = 59 - date.getUTCSeconds();

    this.setState({
      timer: `${hoursLeft < 10 ? '0' + hoursLeft.toString() : hoursLeft}:
    ${minutesLeft < 10 ? '0' + minutesLeft.toString() : minutesLeft}:
    ${secondsLeft < 10 ? '0' + secondsLeft.toString() : secondsLeft}`
    });
  }

  render() {
    return (
      <p>{this.state.timer}</p>
    );
  }
}
