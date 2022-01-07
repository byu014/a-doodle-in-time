import React from 'react';
import AppContext from '../lib/app-context';
import axios from 'axios';
import countries from '../lib/countries';
import Redirect from '../components/redirect';

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null, countryOptions: [], redirectTo: null };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const countryOptions = countries.map(country => {
        return (
          <option key={country.id} value={country.name}>
            {country.name}
          </option>
        );
      });
      const response = await axios.get(`/api/user/${this.context.userId}`);
      this.setState({ data: response.data, countryOptions });
    } catch (error) {
      console.error(error);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
      const email = event.target.email.value;
      const bio = event.target.bio.value;
      const location = event.target.location.value;
      await axios.patch('/api/user', { email, bio, location, userId: this.context.userId }, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': window.localStorage.getItem('drawing-app-jwt')
        }
      });
      this.setState({ redirectTo: `#profile?userId=${this.context.userId}` });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }
    if (!this.state.data) {
      return <div>loading...</div>;
    }
    return (
      <form className='row settings-form' onSubmit={this.handleSubmit}>
          <div className='col-full bio-settings'>
            <label htmlFor="bio-settings">Bio:</label>
            <textarea
                name='bio'
                rows='10'
                className='submit-caption'
                type="text"
                id="caption"
                placeholder="Write a caption!"
                autoComplete='off'
                defaultValue={this.state.data[0].bio}
              />
          </div>
          <div className='col-full'>
            <label htmlFor="location-settings">Location: </label>
            <select name="location" id="location-settings" className='location-settings' defaultValue={this.state.data[0].location}>
              <option value={null}>Private</option>
              {this.state.countryOptions}
            </select>
          </div>
          <div className="col-full">
            <label htmlFor="email-settings">Email</label>
            <input className='email-settings' name='email' id="email-settings" type="email" placeholder='Input email address' defaultValue={this.state.data[0].email}/>
          </div>
          <div className="col-full">
            <button className={'submit-button blue-btn'} type="submit" name='update' >Update</button>
          </div>
      </form>
    );
  }
}

Settings.contextType = AppContext;
