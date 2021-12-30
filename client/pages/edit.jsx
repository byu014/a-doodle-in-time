import React from 'react';
import Canvas from '../components/canvas';
import ToolPicker from '../components/tool-picker';
import AppContext from '../lib/app-context';
import axios from 'axios';

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { dataUrl: null, caption: null, title: null };
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`/api/doodle/${this.props.doodleId}`);
      this.setState({
        dataUrl: response.data.dataUrl,
        caption: response.data.caption,
        title: response.data.title
      });
    } catch (error) {
      console.error(error);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const caption = event.target.caption.value;
    const title = event.target.title.value;
    const { dataUrl } = this.context;
    if (event.nativeEvent.submitter.matches('[name="delete"]')) {
      // todo
    } else if (event.nativeEvent.submitter.matches('[name="update"]')) {
      try {
        await axios.patch(`/api/doodle/${this.props.doodleId}`, { caption, title, dataUrl }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  render() {
    if (!this.state.dataUrl) {
      return <div>loading...</div>;
    }
    return (
      <div className="row create">
        <div className="col-70 canvas-and-tools">
          <Canvas dataUrl={this.state.dataUrl}/>
          <ToolPicker />
        </div>
        <form className="col-30 submission-form" onSubmit={this.handleSubmit}>
            <input className="submit-title large-font" type="text" name="title" id="title" placeholder="Add a title!" defaultValue={this.state.title}/>
            <textarea rows='10' className="submit-caption" type="text" name="caption" id="caption" placeholder="Write a caption!" autoComplete='off' defaultValue={this.state.caption}/>
            <div className="button-flex-edit">
              <button className="submit-button red-outline-btn" type="submit" name="delete">Delete</button>
              <button className="submit-button blue-btn" type="submit" name='update'>Update</button>
            </div>
        </form>
      </div>
    );
  }
}

Edit.contextType = AppContext;
