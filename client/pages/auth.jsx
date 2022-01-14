import React from 'react';
import axios from 'axios';
import AppContext from '../lib/app-context';

export default class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      error: null,
      timeoutId: null
    };

    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async handleSignUp(event) {
    event.preventDefault();
    try {
      const username = event.target.username.value;
      const password = event.target.password.value;
      await axios.post('/api/auth/sign-up', { username, password });
      window.location.href = '#auth?type=sign-in';
    } catch (error) {
      const timeoutId = setTimeout(() => this.setState({ error: false }), 3000);
      this.setState({ error: 'Account already exists', timeoutId });

    }
  }

  async handleSignIn(event) {
    event.preventDefault();
    try {
      const username = event.target.username.value;
      const password = event.target.password.value;
      let response = null;
      if (!username.length) {
        response = await axios.post('/api/auth/sign-in', { username: 'Guest', password: 'password' });
      } else {
        response = await axios.post('/api/auth/sign-in', { username, password });
      }
      this.context.handleSignIn(response.data);
      window.location.href = '#';
    } catch (error) {
      const timeoutId = setTimeout(() => this.setState({ error: false }), 3000);
      this.setState({ error: 'Username/password incorrect', timeoutId });
    }
  }

  render() {
    return (
      <div className='row'>
        <div className="auth">
          <div className="col-50 auth-left">
              <p className='auth-header'>{this.props.type === 'sign-in' ? 'Welcome friend!' : 'Welcome back!'}</p>
              <p className='auth-left-info'>{this.props.type === 'sign-in' ? 'Sign up and be a part of the Doodle in Time community!' : 'Sign in to start leaving your mark in time with your doodles.'}</p>
              <a className='auth-left-btn' href={this.props.type === 'sign-in' ? '#auth?type=sign-up' : '#auth?type=sign-in'}>{this.props.type === 'sign-in' ? 'Sign Up' : 'Sign In'}</a>
          </div>
          <form className="col-50 auth-right" onSubmit={this.props.type === 'sign-in' ? this.handleSignIn : this.handleSignUp}>
            <div>
              {this.state.error ? <p>{this.state.error}</p> : <></>}
            </div>
              <p className='auth-header'>{this.props.type === 'sign-in' ? 'Sign in to a Doodle in Time' : 'Create an account!'}</p>
              <p className={`sigin-note ${this.props.type === 'sign-in' ? '' : 'hidden'}`}><i>*Leave empty to sign in as guest</i></p>
              <div>
                <label htmlFor="username"><i className="fas fa-user"></i> </label>
                <input className='auth-input' id='username' name='username' type="text" placeholder='Username' autoComplete='off'/>
              </div>
              <div>
                <label htmlFor="password"><i className="fas fa-lock"></i> </label>
                <input className='auth-input' id='password' type="password" placeholder='Password' />
              </div>
              <button
                className='auth-right-btn'
                type='submit'
              >
              {this.props.type === 'sign-in' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
        </div>
      </div>
    );
  }
}

Auth.contextType = AppContext;
