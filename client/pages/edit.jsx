import React from 'react';
import Canvas from '../components/canvas';
import ToolPicker from '../components/tool-picker';
import AppContext from '../lib/app-context';
import axios from 'axios';
import Timer from '../components/timer';
import Redirect from '../components/redirect';

export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      dataUrl: null,
      caption: null,
      title: null,
      isError: false,
      editable: false,
      deletable: true,
      redirectTo: null
    };
  }

  async componentDidMount() {
    try {
      const date = new Date();
      const response = await axios.get(`/api/doodle/${this.props.doodleId}`);
      const doodleDateFull = response.data.createdAt.split('T')[0].split('-');
      const doodleYear = Number.parseInt(doodleDateFull[0]);
      const doodleMonth = Number.parseInt(doodleDateFull[1]);
      const doodleDate = Number.parseInt(doodleDateFull[2]);

      if (response.data.userId === this.context.userId) {
        if (doodleYear === date.getUTCFullYear() && doodleMonth === date.getUTCMonth() + 1 && doodleDate === date.getUTCDate()) {
          this.setState({
            dataUrl: response.data.dataUrl,
            caption: response.data.caption,
            title: response.data.title,
            editable: true,
            deletable: true
          });
        } else {
          this.setState({
            dataUrl: response.data.dataUrl,
            caption: response.data.caption,
            title: response.data.title,
            editable: false,
            deletable: true
          });
        }
      } else {
        this.setState({ deletable: false });
      }
    } catch (error) {
      this.setState({ isError: true });
      console.error(error);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const caption = event.target.caption.value;
    const title = event.target.title.value;
    const { dataUrl } = this.context;
    if (event.nativeEvent.submitter.matches('[name="delete"]')) {
      try {
        await axios.delete(`/api/doodle/${this.props.doodleId}`);
        this.setState({ deletable: false });
      } catch (error) {
        console.error(error);
      }
    } else if (event.nativeEvent.submitter.matches('[name="update"]')) {
      try {
        await axios.patch(`/api/doodle/${this.props.doodleId}`, { caption, title, dataUrl }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.setState({ redirectTo: `#view?doodleId=${this.props.doodleId}` });
      } catch (error) {
        this.setState({ isError: true });
        console.error(error);
      }
    }
  }

  // TODO assign disabled dynamically to inputs later
  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>;
    }
    if (this.state.isError || !this.state.deletable) {
      return <Redirect to=''/>;
    }
    if (!this.state.dataUrl) {
      return <div>loading...</div>;
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
          <Canvas editable={this.state.editable} dataUrl={this.state.dataUrl}/>
          {this.state.editable ? <ToolPicker /> : ''}
        </div>
        <form className="col-30 submission-form" onSubmit={this.handleSubmit}>
            <input
              className={`submit-title large-font ${this.state.editable ? '' : 'submit-title-uneditable'}`}
              type="text"
              name="title"
              id="title"
              placeholder="Add a title!"
              defaultValue={this.state.title}
              readOnly={!this.state.editable}
            />
            <textarea
              rows='10'
              className={`submit-caption ${this.state.editable ? '' : 'submit-caption-uneditable'}`}
              type="text" name="caption"
              id="caption"
              placeholder="Write a caption!"
              autoComplete='off'
              defaultValue={this.state.caption}
              readOnly={!this.state.editable}
            />
            <div className="button-flex-edit">
              <button className={`submit-button red-outline-btn ${this.state.deletable ? '' : 'hidden'}`} type="submit" name="delete">Delete</button>
              <button className={`submit-button blue-btn ${this.state.editable ? '' : 'hidden'}`} type="submit" name='update'>Update</button>
            </div>
        </form>
      </div>
      </>
    );
  }
}

Edit.contextType = AppContext;
