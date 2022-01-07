import React from 'react';
import Drawer from './drawer';
import AppContext from '../lib/app-context';
import axios from 'axios';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openDrawer: false, openDropdown: false, profileData: null };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    document.addEventListener('click', event => {
      if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-menu')) {
        this.setState({ openDropdown: false });
      }
    });
    if (this.context.userId) {
      try {
        const response = await axios.get(`/api/user/${this.context.userId}`);
        this.setState({ profileData: response.data });
      } catch (error) {
        console.error(error);
      }

    }
    setInterval(() => this.setState({}), 500);
  }

  async loadProfile() {
    if (this.context.userId) {
      try {
        const response = await axios.get(`/api/user/${this.context.userId}`);
        this.setState({ profileData: response.data });
      } catch (error) {
        console.error(error);
      }

    }
  }

  handleClick(event) {
    if (event.target.matches('.dropdown-btn')) {
      this.setState({ openDropdown: !this.state.openDropdown });
    }
    if (event.target.matches('#sandwich-btn')) {
      this.setState({ openDrawer: true });
    } else if (event.target.matches('.modal-menu-bg') || event.target.matches('a') || event.target.matches('button')) {
      this.setState({ openDrawer: false });
    }
  }

  render() {
    if (this.context.pfpChanged) {
      this.context.pfpChanged = false;
      this.loadProfile();
    }
    return (
      <header onClick={this.handleClick}>
        <nav className="container">
          <div className="row">
            <div className="col-half logo">
              <a className='nav-link' href="#">
                <p className="text-shadow logo-name">A Doodle in Time</p>
              </a>
            </div>
            <div className='col-half text-shadow nav-items'>
              <a className={`nav-link ${!this.context.userId ? 'hidden' : ''}`} href="#create" ><i className="far fa-plus-square"></i> Create</a>
              <a className='nav-link' href="#browse" ><i className="far fa-images"></i> Browse</a>
              <a className={`nav-link user-link user-link-small ${!this.context.userId ? 'hidden' : ''}`} href={`#profile?userId=${this.context.userId}`}>
                <img className='mini-pfp' src={this.state.profileData ? this.state.profileData[0].pfpUrl : null} alt="" />
                <p>{this.state.profileData ? this.state.profileData[0].username : null}</p>
              </a>
              <a href="#auth?type=sign-in" className={`white-btn sign-in-btn-navbar ${this.context.userId ? 'hidden' : ''}`}>Sign In</a>
              <button href="" className={`dropdown-btn ${!this.context.userId ? 'hidden' : ''}`}><i className="fas fa-sort-down"></i></button>
              <div className={`dropdown-menu ${this.state.openDropdown ? '' : 'hidden'}`}>
                <a className='nav-link' href="#settings">Settings</a>
                <a className='nav-link' href="#" onClick={this.context.handleSignOut}>Sign Out</a>
              </div>
            </div>
            <div className="col-half drawer-sandwich">
              <Drawer openDrawer={this.state.openDrawer}/>
              <button id="sandwich-btn">
                <i className="fas fa-bars sandwich"></i>
              </button>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

Navbar.contextType = AppContext;
