import React from 'react';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      isMouseDown: false,
      lastX: null,
      lastY: null
    };
    this.canvasRef = React.createRef();
    this.ctx = null;

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext('2d');
    window.addEventListener('mouseup', this.handleMouseUp);// required since cannot detect mouseup outside of canvas
    // this.canvasRef.current.addEventListener('touchstart', this.handleOnTouchStart);
  }

  handleMouseMove(event) {
    if (!this.state.isDrawing) {
      return;
    }
    this.draw(event);
  }

  handleMouseLeave(event) { // prevents drawing line along edge when mouse reenters canvas from where mouse left
    this.setState({ isDrawing: false, lastX: null, lastY: null });
  }

  handleMouseEnter(event) {
    if (this.state.isMouseDown) {
      this.setState({ isDrawing: true });
    }
  }

  handleMouseDown(event) {
    this.setState({ isDrawing: true, isMouseDown: true });
    this.draw(event);// allows users to draw dots or else requires dragging motion to draw
  }

  handleMouseUp(event) {
    this.setState({ isDrawing: false, lastX: null, lastY: null, isMouseDown: false });
  }

  draw(event) {
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();// prevents jagged path by restarting path with every call to draw
    if (this.state.lastX && this.state.lastY) { // prevents gaps from drawing too fast
      this.ctx.moveTo(this.state.lastX, this.state.lastY);

    }
    this.ctx.lineCap = 'round';
    const { x, y } = this.getMousePos(this.canvasRef.current, event);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.setState({ lastX: x, lastY: y });
  }

  // translates clientX and clientY to proper x and y on canvas
  // if statement to determine if user is touching screen vs using mouse
  getMousePos(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    if (event.touches) {
      return {
        x: (event.touches[0].clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (event.touches[0].clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
      };
    }
    return {
      x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  render() {
    return (
      <canvas
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onTouchMove={this.handleMouseMove}
        onTouchStart={this.handleMouseDown}
        onTouchEnd={this.handleMouseUp}
        ref={this.canvasRef}
        width='1920'
        height='1440'
        id="canvas">
      </canvas>
    );
  }
}
