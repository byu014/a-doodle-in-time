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
    this.fileInputRef = React.createRef();
    this.onTabClick = this.onTabClick.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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
        const doodleResponse = await axios.get(`/api/doodle/${doodle.doodleId}`);
        doodleResponse.data.doodleId = doodle.doodleId;
        doodleInfoArray.push(doodleResponse);
      }
      const galleryCardsFavorites = doodleInfoArray.map(doodleInfo => {
        return (
            <li key={doodleInfo.doodleId} className="li-card">
              <a className='a-card' href={`#view?doodleId=${doodleInfo.data.doodleId}`}>
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

  async onTabClick(event) {
    if (!event.target.matches('.tab')) return;
    const selectedTab = event.target.getAttribute('tabName');
    this.setState({ activeTab: selectedTab });
    await this.renderGallery();
  }

  async handleUpload(event) {
    const acceptableTypes = new Set(['png', 'jpg', 'jpeg', 'gif']);
    const fileExt = this.fileInputRef.current.files[0].name.split('.')[1].toLowerCase();
    if (acceptableTypes.has(fileExt)) {
      const formData = new FormData();
      formData.append('image', this.fileInputRef.current.files[0]);
      formData.append('userId', this.context.userId);
      const result = await axios.post('/api/uploadPfp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': window.localStorage.getItem('drawing-app-jwt')
        }
      });
      const newUserData = this.state.userData;
      newUserData[0].pfpUrl = result.data.pfpUrl;
      await this.renderGallery();
      this.setState({ userData: newUserData });
    }
  }

  render() {
    if (!this.state.userData) {
      return <div>loading...</div>;
    }
    return (
      <div className='row'>
        <div className="col-30 artist-info">
          <form className='pfp' onChange={this.handleUpload} encType="multipart/form-data">
            <img className="large-pfp" src={this.state.userData[0].pfpUrl} alt="pfp" />
            <label className={`file-upload ${this.context.userId === this.state.userData[0].userId ? '' : 'hidden'}`} htmlFor="image-upload">
              Upload Profile Picture
            </label>
            <input
              type="file"
              name="image"
              id="image-upload"
              ref={this.fileInputRef}
              accept=".png, .jpg, .jpeg, .gif"
              className='hidden'/>
          </form>
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
