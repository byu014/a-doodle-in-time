import React from 'react';
import Canvas from '../components/canvas';
import ToolPicker from '../components/tool-picker';
import AppContext from '../lib/app-context';
import axios from 'axios';

export default class Create extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const caption = event.target.caption.value;
    const title = event.target.title.value;
    const { dataUrl } = this.context;
    try {
      await axios.post('/api/doodle', { caption, title, dataUrl }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
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
    );
  }
}

Create.contextType = AppContext;
