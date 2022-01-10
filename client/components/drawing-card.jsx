import React from 'react';
import AppContext from '../lib/app-context';
import axios from 'axios';

export default class DrawingCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: null
    };
    this.canvasRef = React.createRef();
    this.ctx = null;

    this.handleFavorite = this.handleFavorite.bind(this);
  }

  async componentDidMount() {
    if (!this.context.userId) {
      this.setState({ favorites: new Set() });
      return;
    }
    try {
      const response = await axios.get(`/api/favorites/${this.context.userId}`);
      const favorites = new Set();
      response.data.forEach(doodle => {
        favorites.add(doodle.doodleId);
      });
      this.setState({ favorites });
    } catch (error) {
      console.error(error);
    }
  }

  async handleFavorite(event) {
    event.preventDefault();
    try {
      await axios.post(`/api/favorite/${this.props.doodleId}`, { userId: this.context.userId }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': window.localStorage.getItem('drawing-app-jwt')
        }
      });
      if (this.state.favorites.has(this.props.doodleId)) {
        const newFavorites = this.state.favorites;
        newFavorites.delete(this.props.doodleId);
        this.setState({ favorites: newFavorites });
      } else {
        const newFavorites = this.state.favorites;
        newFavorites.add(this.props.doodleId);
        this.setState({ favorites: newFavorites });
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    if (!this.state.favorites) {
      return (
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      );
    }
    return (
      <div className='drawing-card'>
        <img className={`card-img-${this.props.size}`} src={this.props.dataUrl} alt="" />
        <button onClick={this.handleFavorite}
          className={`card-heart-btn-${this.props.size} ${!this.context.userId ? 'hidden' : ''}`}><i className={`${this.state.favorites.has(this.props.doodleId) ? 'liked fas' : 'unliked far '} fa-heart`}></i>
        </button>
        <p>{this.props.title}</p>
        <div className="user-link-edit">
          <a className="user-link user-link-small" href={`#profile?userId=${this.props.userId}`}>
            <img className='mini-pfp' src={this.props.pfpUrl} alt="" />
            <p>{this.props.username}</p>
          </a>
          <a className={`${this.props.userId === this.context.userId ? '' : 'hidden'} card-edit-btn`} href={`#edit?doodleId=${this.props.doodleId}`}>Edit</a>
        </div>
      </div>
    );
  }
}

DrawingCard.contextType = AppContext;
