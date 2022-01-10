import React from 'react';
import AppContext from '../lib/app-context';

export default class ToolPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: 'black',
      opacity: 1,
      size: 10,
      lineStyle: 0,
      drawingUtensil: 'pen'
    };
    this.lineStyles = [
      'line',
      'dotted',
      'H. mirror',
      'V. mirror',
      'spiky',
      'center'
    ];

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.context.color = this.state.color;
    this.context.opacity = this.state.opacity;
    this.context.size = this.state.size;
    this.context.lineStyle = this.state.lineStyle;
    this.context.drawingUtensil = this.state.drawingUtensil;
  }

  handleChange(event) {
    if (event.target.matches('input[type="color"]')) {
      this.context.color = event.target.value;
      this.setState({ color: event.target.value });
      return;
    }
    if (event.target.matches('input[type="range"]')) {
      this.context[event.target.name] = event.target.value;
      this.setState({ [event.target.name]: event.target.value });

    }
  }

  handleClick(event) {
    if (event.target.matches('#dash-toggle')) { // line style button
      this.context.lineStyle = (this.state.lineStyle + 1) % this.lineStyles.length;
      this.setState({ lineStyle: (this.state.lineStyle + 1) % this.lineStyles.length });
      return;
    }
    if (event.target.matches('#pen')) {
      this.context.drawingUtensil = 'pen';
      this.setState({ drawingUtensil: 'pen' });
      return;
    }
    if (event.target.matches('#eraser')) {
      this.context.drawingUtensil = 'eraser';
      this.setState({ drawingUtensil: 'eraser' });
      return;
    }
    if (event.target.matches('#clear')) {
      const canvas = this.context.canvasRef.current;
      const { width, height } = canvas;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      this.context.undoStack.push(canvas.toDataURL());
      ctx.clearRect(0, 0, width, height);
      this.context.undoStack.push(canvas.toDataURL());
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        this.context.dataUrl = canvas.toDataURL();
      }.bind(this);
      img.src = this.context.undoStack.pop();
    }
    if (event.target.matches('#undo')) {
      if (!this.context.undoStack.length) {
        return;
      }
      const canvas = this.context.canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const { width, height } = canvas;

      this.context.redoStack.push(canvas.toDataURL());
      ctx.clearRect(0, 0, width, height);
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        this.context.dataUrl = canvas.toDataURL();
      }.bind(this);
      img.src = this.context.undoStack.pop();
    }

    if (event.target.matches('#redo')) {
      if (!this.context.redoStack.length) {
        return;
      }
      const canvas = this.context.canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const { width, height } = canvas;

      this.context.undoStack.push(canvas.toDataURL());
      ctx.clearRect(0, 0, width, height);
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        this.context.dataUrl = canvas.toDataURL();
      }.bind(this);
      img.src = this.context.redoStack.pop();
    }

  }

  render() {
    return (
      <div className="tool-picker" onChange={this.handleChange} onClick={this.handleClick}>
        <div className="col-50 art-tools">
          <button className="art-tool-btn color-picker-btn">
            <input type="color" name="color" id="color" className="color-picker"/>
          </button>
          <button id='pen' className={`art-tool-btn ${this.state.drawingUtensil === 'pen' ? 'selected-utensil' : ''} `}><i className="fas fa-pen"></i></button>
          <button id='eraser' className={`art-tool-btn ${this.state.drawingUtensil === 'eraser' ? 'selected-utensil' : ''}`}><i className="fas fa-eraser"></i></button>
          <button id='undo' className="art-tool-btn"><i className="fas fa-undo"></i></button>
          <button id='redo' className="art-tool-btn"><i className="fas fa-redo"></i></button>
          <button id='clear' className="art-tool-btn"><i className="fas fa-trash-alt"></i></button>
        </div>
        <div className="col-50 art-sliders">
          <div className="art-slider-div">
            <label htmlFor="opacity">Opacity: </label>
            <input type="range" name="opacity" id="opacity" min='0' max='1.0' step='0.01' defaultValue='1.0' />
            <p>{this.state.opacity}</p>
          </div>
          <div className="art-slider-div">
            <label htmlFor="size">Size: </label>
            <input type="range" name="size" id="size" min='1' max='100.0' step='0.1' defaultValue='10.0'/>
            <p>{this.state.size}</p>
          </div>
          <div className='dash-toggle-div'>
            <p>Style: </p>
            <button id="dash-toggle" className="dash-toggle">{this.lineStyles[this.state.lineStyle]}</button>
          </div>
        </div>
      </div>
    );

  }
}

ToolPicker.contextType = AppContext;
