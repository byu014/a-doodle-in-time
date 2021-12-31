import React from 'react';
import Home from './pages/home';
import NotFound from './pages/not-found';
import Create from './pages/create';
import Browse from './pages/browse';
import Edit from './pages/edit';
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
