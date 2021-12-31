import React from 'react';
import Canvas from '../components/canvas';
import ToolPicker from '../components/tool-picker';
import AppContext from '../lib/app-context';
import axios from 'axios';
import Timer from '../components/timer';
import Redirect from '../components/redirect';

export default class Create extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { redirectTo: null };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`/api/doodle/today/${this.context.userId}`);
      this.setState({ redirectTo: `#edit?doodleId=${response.data.doodleId}` });
    } catch (error) {
      console.error(error, '');
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const caption = event.target.caption.value;
    const title = event.target.title.value;
    const { dataUrl } = this.context;
    try {
      const response = await axios.post('/api/doodle', { caption, title, dataUrl }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.setState({ redirectTo: `#edit?doodleId=${response.data.doodleId}` });// change to redirect to view page later
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>;
    }
    return (
      <>
      <div className="row">
        <div className="col-full timer-div">
          <Timer />
        </div>
      </div>
      <div className="row create">
        <div className="col-70 canvas-and-tools">
          <Canvas />
          <ToolPicker />
        </div>
        <form className="col-30 submission-form" onSubmit={this.handleSubmit}>
            <input className="submit-title large-font" type="text" name="title" id="title" placeholder="Add a title!"/>
            <textarea rows='10' className="submit-caption" type="text" name="caption" id="caption" placeholder="Write a caption!" autoComplete='off'/>
            <div className="button-flex">
              <button className="submit-button blue-btn" type="submit">Submit!</button>
            </div>
        </form>
      </div>
      </>
    );
  }
}

Create.contextType = AppContext;
