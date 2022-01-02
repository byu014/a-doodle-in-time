import React from 'react';
import axios from 'axios';
import AppContext from '../lib/app-context';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`/api/user/${this.props.userId}`);
      this.setState({ data: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    if (!this.state.data) {
      return <div>loading...</div>;
    }
    return (
      <div className='row'>
      <div className="col-30 artist-info">
        <img className="large-pfp" src={this.state.data.pfpUrl} alt="pfp" />
        <p className="info-username">{this.state.data.username}</p>
        <p className='info-location'><i className="fas fa-map-marker-alt"></i> {this.state.data.location ? this.state.data.location : 'Private'}</p>
        <p className='inf-bio'>{this.state.data.bio}</p>
      </div>
      <div className="col-70">
        <p>70</p>
      </div>
      </div>
    );
  }
}

Profile.contextType = AppContext;
