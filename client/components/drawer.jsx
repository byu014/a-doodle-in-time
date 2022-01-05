import React from 'react';
import AppContext from '../lib/app-context';

export default class Drawer extends React.Component {
  render() {
    const { openDrawer } = this.props;
    return (
      <>
        <div className={`modal-menu-bg ${openDrawer ? '' : 'hidden'}`}></div>
        <div className={`drawer-menu ${openDrawer ? '' : 'hidden'}`}>
          <p className="drawer-menu-header large-font">Menu</p>
          <div className="row drawer-navs">
            <div className="col-full drawer-nav-items">
              <a href="#create">Create</a>
              <a href="#browse">Browse</a>
              <a href={`#profile?userId=${this.context.userId}`} className={`${!this.context.userId ? 'hidden' : ''}`}>Profile</a>
            </div>
            <div className="col-full drawer-user-options">
              <a href="#settings">Settings</a>
              <button className='nav-link' href="">Sign Out</button>
              <button href="" className={`white-btn ${this.context.userId ? 'hidden' : ''}`}>Sign In</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Drawer.contextType = AppContext;
