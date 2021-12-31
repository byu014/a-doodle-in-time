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
    const hoursLeft = 24 - date.getHours();
    const minutesLeft = 60 - date.getMinutes();
    const secondsLeft = 60 - date.getSeconds();

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
