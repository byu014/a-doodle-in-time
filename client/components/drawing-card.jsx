import React from 'react';
import AppContext from '../lib/app-context';

export default class DrawingCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.canvasRef = React.createRef();
    this.ctx = null;

  }

  componentDidMount() {

  }

  render() {
    return (
      <div className='drawing-card'>
        <img className={`card-img-${this.props.size}`} src={this.props.dataUrl} alt="" />
        <button className={`card-heart-btn-${this.props.size}`}><i className="far fa-heart unliked"></i></button>
        <p>{this.props.title}</p>
        <div className="user-link-edit">
          <a className="user-link user-link-small" href={`#profile?userId=${this.props.userId}`}>
            <img className='mini-pfp' src={this.props.pfpUrl} alt="" />
            <p>{this.props.username}</p>
          </a>
          <a className={`${this.props.userId === this.context.userId ? '' : 'hidden'} card-edit-btn`} href={`#edit?doodleId=${this.props.doodleId}`}>Edit</a>
        </div>
      </div>
    );
  }
}

DrawingCard.contextType = AppContext;
