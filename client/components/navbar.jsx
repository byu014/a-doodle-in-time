import React from 'react';
import Drawer from './drawer';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openDrawer: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (event.target.matches('.sandwich')) {
      this.setState({ openDrawer: true });
    } else {
      this.setState({ openDrawer: false });
    }
  }

  render() {
    return (
      <header onClick={this.handleClick}>
        <nav className="container">
          <div className="row">
            <div className="col-half logo">
              <a href="#">
                <p className="text-shadow logo-name">A Doodle in Time</p>
              </a>
            </div>
            <div className='col-half text-shadow nav-items'>
              <a href="#create" className="">Create</a>
              <a href="#browse" className="">Browse</a>
              <button href="" className="white-btn">Sign In</button>
            </div>
            <div className="col-half drawer-sandwich">
              <Drawer openDrawer={this.state.openDrawer}/>
              <button>
                <i className="fas fa-bars sandwich"></i>
              </button>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}