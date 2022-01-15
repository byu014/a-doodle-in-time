import React from 'react';
import axios from 'axios';
import Canvas from '../components/canvas';
import AppContext from '../lib/app-context';

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      favorites: null
    };

    this.dateConvert = this.dateConvert.bind(this);
    this.handleFavorite = this.handleFavorite.bind(this);
  }

  async componentDidMount() {
    if (!this.context.userId) {
      try {
        const response = await axios.get(`/api/doodle/${this.props.doodleId}`);

        const favorites = new Set();
        this.setState({ data: response.data, favorites: favorites });
      } catch (error) {
        console.error(error);
      }
    }
    try {
      const response = await axios.get(`/api/doodle/${this.props.doodleId}`);
      const responseFavorites = await axios.get(`/api/favorites/${this.context.userId}`);
      const favorites = new Set();
      responseFavorites.data.forEach(doodle => {
        favorites.add(doodle.doodleId);
      });
      this.setState({ data: response.data, favorites: favorites });
    } catch (error) {
      console.error(error);
    }
  }

  async handleFavorite(event) {
    event.preventDefault();
    try {
      await axios.post(`/api/favorite/${this.state.data.doodleId}`, { userId: this.context.userId }, { headers: { 'x-access-token': window.localStorage.getItem('drawing-app-jwt') } });
      if (this.state.favorites.has(this.state.data.doodleId)) {
        const newFavorites = this.state.favorites;
        newFavorites.delete(this.state.data.doodleId);
        this.setState({ favorites: newFavorites });
      } else {
        const newFavorites = this.state.favorites;
        newFavorites.add(this.state.data.doodleId);
        this.setState({ favorites: newFavorites });
      }
    } catch (error) {
      console.error(error);
    }
  }

  dateConvert() {
    const doodleDateFull = this.state.data.createdAt.split('T')[0].split('-');
    const doodleYear = doodleDateFull[0];
    const doodleMonth = Number.parseInt(doodleDateFull[1]) - 1;
    const doodleDate = doodleDateFull[2];
    return `${this.context.monthNames[doodleMonth]} ${doodleDate}, ${doodleYear}`;

  }

  render() {
    if (!this.state.data || !this.state.favorites) {
      return (
        <div className='lds-roller-center'>
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      );
    }
    return (
      <div className="row create">
        <div className="col-70 canvas-and-tools">
          <Canvas editable={false} dataUrl={this.state.data.dataUrl}/>
        </div>
        <div className="col-30 doodle-info" >
          <div className="user-link-edit">
            <a className="user-link" href={`#profile?userId=${this.state.data.userId}`} >
              <img className='mini-pfp' src={this.state.data.pfpUrl} alt="" />
              <p>{this.state.data.username}</p>
            </a>
            <a className={`${this.state.data.userId === this.context.userId ? '' : 'hidden'} card-edit-btn`} href={`#edit?doodleId=${this.props.doodleId}`}>Edit</a>
          </div>
          <p className="doodle-title">{this.state.data.title}</p>
          <p className="doodle-caption">{this.state.data.caption}</p>
          <div className='date-favorite-div'>
            <p className='doodle-timestamp'>{this.dateConvert()}</p>
            <button onClick={this.handleFavorite} className={`view-heart-btn ${!this.context.userId ? 'hidden' : ''}`}>
              <i className={`${this.state.favorites.has(this.state.data.doodleId) ? 'liked fas' : 'unliked far '} fa-heart`}></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

View.contextType = AppContext;
