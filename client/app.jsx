import React from 'react';
import Home from './pages/home';
import NotFound from './pages/not-found';
import Create from './pages/create';
import Browse from './pages/browse';
import Edit from './pages/edit';
import View from './pages/view';
import Profile from './pages/profile';
import AppContext from './lib/app-context';
import { parseRoute } from './lib';
import { Navbar } from './components';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
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
      default:
        return <NotFound/>;
    }
  }

  render() {
    const contextValue = {
      dataUrl: null,
      color: '#000000',
      opacity: 1,
      size: 10,
      undoStack: [],
      redoStack: [],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'],
      userId: 1 // hardcoded,change when update with auth
    };
    return (
      <AppContext.Provider value={contextValue}>

      <>
      <Navbar />
      <div className="container">
        {this.renderPage()}
      </div>
      </>
      </AppContext.Provider>
    );
  }
}
