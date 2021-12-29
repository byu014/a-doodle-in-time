import React from 'react';

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
            </div>
            <div className="col-full drawer-user-options">
              <button href="" className="white-btn">Sign In</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
