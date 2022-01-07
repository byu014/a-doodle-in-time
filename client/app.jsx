import React from 'react';
import Home from './pages/home';
import NotFound from './pages/not-found';
import Create from './pages/create';
import Browse from './pages/browse';
import Edit from './pages/edit';
import View from './pages/view';
import Profile from './pages/profile';
import Settings from './pages/settings';
import AppContext from './lib/app-context';
import { parseRoute } from './lib';
import decodeToken from './lib/decode-token';
import { Navbar } from './components';
import Auth from './pages/auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    /**
     * Listen for hash change events on the window object
     * Each time the window.location.hash changes, parse
     * it with the parseRoute() function and update state
     */

    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('drawing-app-jwt');
    const user = token ? decodeToken(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('drawing-app-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('drawing-app-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { route } = this.state;
    switch (route.path) {
      case '':
        return <Home />;
      case 'create':
        return <Create/>;
      case 'browse':
        return <Browse />;
      case 'edit':
        return <Edit doodleId={route.params.get('doodleId')}/>;
      case 'view':
        return <View doodleId={route.params.get('doodleId')}/>;
      case 'profile':
        return <Profile key={route.params.get('userId')} userId={route.params.get('userId')}/>;
      case 'settings':
        return <Settings />;
      case 'auth':
        return <Auth type={route.params.get('type')}/>;
      default:
        return <NotFound/>;
    }
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const contextValue = {
      dataUrl: null,
      color: '#000000',
      opacity: 1,
      size: 10,
      undoStack: [],
      redoStack: [],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
      userId: this.state.user ? this.state.user.userId : null,
      handleSignIn: this.handleSignIn,
      handleSignOut: this.handleSignOut,
      pfpChanged: false
    };
    return (
      <AppContext.Provider value={contextValue}>

      <>
      <Navbar key={contextValue.userId}/>
      <div className="container">
        {this.renderPage()}
      </div>
      </>
      </AppContext.Provider>
    );
  }
}
