import React from 'react';
import Home from './pages/home';
import NotFound from './pages/not-found';
import Create from './pages/create';
import Browse from './pages/browse';
import AppContext from './lib/app-context';
import { parseRoute } from './lib';
import { Navbar } from './components';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
    this.pages = {
      '': <Home />,
      create: <Create />,
      browse: <Browse />
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

    return this.pages[route.path] ? this.pages[route.path] : <NotFound />;
  }

  render() {
    const contextValue = { dataUrl: null };
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
