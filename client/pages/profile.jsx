import React from 'react';
import axios from 'axios';
import AppContext from '../lib/app-context';
import DrawingCard from '../components/drawing-card';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      activeTab: 'Submissions',
      galleryCardsSubmissions: null,
      galleryCardsFavorites: null
    };

    this.onTabClick = this.onTabClick.bind(this);
  }

  async componentDidMount() {
    this.renderGallery();
  }

  async renderGallery() {
    try {
      const response = await axios.get(`/api/user/${this.props.userId}`);
      const galleryCardsSubmissions = response.data.map(doodle => {
        return (
          <li key={doodle.doodleId} className="li-card">
            <a className='a-card' href={`#view?doodleId=${doodle.doodleId}`}>
              <DrawingCard
                dataUrl={doodle.dataUrl}
                title={doodle.title}
                username={doodle.username}
                pfpUrl={doodle.pfpUrl}
                size='small'
              />
            </a>
          </li>
        );
      });
      this.setState({ galleryCardsSubmissions, changed: false, data: response.data });
    } catch (err) {
      console.error(err);
      return <div></div>;
    }
  }

  onTabClick(event) {
    if (!event.target.matches('.tab')) return;
    const selectedTab = event.target.getAttribute('tabName');
    this.setState({ activeTab: selectedTab });
  }

  render() {
    if (!this.state.data) {
      return <div>loading...</div>;
    }
    return (
      <div className='row'>
        <div className="col-30 artist-info">
          <img className="large-pfp" src={this.state.data[0].pfpUrl} alt="pfp" />
          <p className="info-username">{this.state.data[0].username}</p>
          <p className='info-location'><i className="fas fa-map-marker-alt"></i> {this.state.data[0].location ? this.state.data[0].location : 'Private'}</p>
          <p className='inf-bio'>{this.state.data[0].bio}</p>
        </div>
        <div className="col-70 artist-gallery">
          <div className="tabs" onClick={this.onTabClick}>
            <button className={`tab ${this.state.activeTab === 'Submissions' ? 'active-tab' : ''}`} tabName='Submissions'>Submissions</button>
            <button className={`tab ${this.state.activeTab === 'Favorites' ? 'active-tab' : ''}`} tabName='Favorites'>Favorites</button>
          </div>
          <div className="row gallery-row">
            <ul className="col-full gallery">
              {this.state.activeTab === 'Submissions' ? this.state.galleryCardsSubmissions : this.state.galleryCardsFavorites}
            </ul>
        </div>
        </div>
      </div>
    );
  }
}

Profile.contextType = AppContext;
