import React from 'react';
import axios from 'axios';
import Canvas from '../components/canvas';
import AppContext from '../lib/app-context';

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };

    this.dateConvert = this.dateConvert.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`/api/doodle/${this.props.doodleId}`);
      this.setState({ data: response.data });
    } catch (error) {

    }
  }

  dateConvert() {
    const doodleDateFull = this.state.data.createdAt.split('T')[0].split('-');
    const doodleYear = doodleDateFull[0];
    const doodleMonth = Number.parseInt(doodleDateFull[1]) - 1;
    const doodleDate = doodleDateFull[2];
    return `${this.context.monthNames[doodleMonth]} ${doodleDate}, ${doodleYear}`;

  }

  render() {
    if (!this.state.data) {
      return <div>loading...</div>;
    }
    return (
      <div className="row create">
        <div className="col-70 canvas-and-tools">
          <Canvas editable={false} dataUrl={this.state.data.dataUrl}/>
        </div>
        <div className="col-30 doodle-info" >
          <a className="user-link">
            <img className='mini-pfp' src={this.state.data.pfpUrl} alt="" />
            <p>{this.state.data.username}</p>
          </a>
          <p className="doodle-title">{this.state.data.title}</p>
          <p className="doodle-caption">{this.state.data.caption}</p>
          <div className='date-favorite-div'>
            <p className='doodle-timestamp'>{this.dateConvert()}</p>
            <button className='view-heart-btn'><i className="far fa-heart unliked"></i></button>
          </div>
        </div>
      </div>
    );
  }
}

View.contextType = AppContext;
