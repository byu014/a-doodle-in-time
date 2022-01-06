import React from 'react';
import Drawer from './drawer';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openDrawer: false, openDropdown: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', event => {
      if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-menu')) {
        this.setState({ openDropdown: false });
      }
    });

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
              <a href={`#profile?userId=${this.context.userId}`} className={`nav-link ${!this.context.userId ? 'hidden' : ''}`}>Profile</a>
              <button href="" className={`white-btn sign-in-btn-navbar ${this.context.userId ? 'hidden' : ''}`}>Sign In</button>
              <button href="" className={`dropdown-btn ${!this.context.userId ? 'hidden' : ''}`}><i className="fas fa-sort-down"></i></button>
              <div className={`dropdown-menu ${this.state.openDropdown ? '' : 'hidden'}`}>
                <a className='nav-link' href="#settings">Settings</a>
                <button className='nav-link' href="">Sign Out</button>
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
