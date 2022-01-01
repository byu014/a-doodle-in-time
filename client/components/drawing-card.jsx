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
        <img className='card-img' src={this.props.dataUrl} alt="" />
        <button className="card-heart-btn"><i className="far fa-heart unliked"></i></button>
        <p>{this.props.title}</p>
        <div className="user-link user-link-small">
          <img className='mini-pfp' src={this.props.pfpUrl} alt="" />
          <p>{this.props.username}</p>
        </div>
      </div>
    );
  }
}

DrawingCard.contextType = AppContext;
