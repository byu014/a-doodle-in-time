import React from 'react';
import axios from 'axios';
import AppContext from '../lib/app-context';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dataUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2048px-Solid_white.svg.png' };
  }

  async componentDidMount() {
    try {
      const response = await axios.get('/api/allDoodles');
      const randIndex = Math.floor(Math.random() * response.data.length);
      this.setState({ dataUrl: response.data[randIndex].dataUrl });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    if (!this.state.dataUrl) {
      return <div>loading...</div>;
    }
    return (
      <div className="row homepage">
        <div className='homepage-intro'>
          <p className='homepage-title'>Leave your mark in time with a doodle!</p>
          <p className='homepage-description'>Create a drawing daily and have your doodle etched
            in time! Pick a day and browse through the drawings of people around that world that
            made a submission on that day!
          </p>
          <div className="homepage-button-div">
            <a href={this.context.userId ? '#create' : '#auth?type=sign-up'} className="blue-btn homepage-create-btn">{this.context.userId ? 'Create!' : 'Sign Up!'}</a>
          </div>
        </div>
        <div className="homepage-image-div">
          <img className='homepage-image' src={this.state.dataUrl} alt="" />
        </div>
      </div>
    );
  }
}

Home.contextType = AppContext;
