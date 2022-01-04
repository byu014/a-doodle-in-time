import React from 'react';
import axios from 'axios';
import AppContext from '../lib/app-context';
import DrawingCard from '../components/drawing-card';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
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
      const responseSubmissions = await axios.get(`/api/userDoodles/${this.props.userId}`);
      const responseFavorites = await axios.get(`/api/favorites/${this.props.userId}`);
      const responseUser = await axios.get(`/api/user/${this.props.userId}`);
      const galleryCardsSubmissions = responseSubmissions.data.map(doodle => {
        return (
            <li key={doodle.doodleId} className="li-card">
              <a className='a-card' href={`#view?doodleId=${doodle.doodleId}`}>
                <DrawingCard
                  dataUrl={doodle.dataUrl}
                  title={doodle.title}
                  username={responseUser.data[0].username}
                  pfpUrl={responseUser.data[0].pfpUrl}
                  userId={doodle.userId}
                  doodleId={doodle.doodleId}
                  size='small'
                />
              </a>
            </li>
        );
      });
      const doodleInfoArray = [];
      for (const doodle of responseFavorites.data) {
        doodleInfoArray.push(await axios.get(`/api/doodle/${doodle.doodleId}`));
      }
      const galleryCardsFavorites = doodleInfoArray.map(doodleInfo => {
        return (
            <li key={doodleInfo.doodleId} className="li-card">
              <a className='a-card' href={`#view?doodleId=${doodleInfo.doodleId}`}>
                <DrawingCard
                  dataUrl={doodleInfo.data.dataUrl}
                  title={doodleInfo.data.title}
                  username={doodleInfo.data.username}
                  pfpUrl={doodleInfo.data.pfpUrl}
                  userId={doodleInfo.data.userId}
                  doodleId={doodleInfo.data.doodleId}
                  size='small'
                />
              </a>
            </li>
        );
      });
      this.setState({ galleryCardsSubmissions, userData: responseUser.data, galleryCardsFavorites });

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
    if (!this.state.userData) {
      return <div>loading...</div>;
    }
    return (
      <div className='row'>
        <div className="col-30 artist-info">
          <img className="large-pfp" src={this.state.userData[0].pfpUrl} alt="pfp" />
          <p className="info-username">{this.state.userData[0].username}</p>
          <p className='info-location'><i className="fas fa-map-marker-alt"></i> {this.state.userData[0].location ? this.state.userData[0].location : 'Private'}</p>
          <p className='inf-bio'>{this.state.userData[0].bio}</p>
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
