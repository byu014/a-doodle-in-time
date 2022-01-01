import React from 'react';
import AppContext from '../lib/app-context';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      isMouseDown: false,
      lastX: null,
      lastY: null,
      mid: null
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
    this.context.canvasRef = this.canvasRef;
    this.context.undoStack = [];
    this.context.redoStack = [];
    this.ctx = this.canvasRef.current.getContext('2d');
    if (this.props.dataUrl) {
      const img = new Image();
      img.onload = function () {
        this.ctx.drawImage(img, 0, 0);
      }.bind(this);
      img.src = this.props.dataUrl;
    }
    this.context.dataUrl = this.props.dataUrl ? this.props.dataUrl : this.canvasRef.current.toDataURL();
    window.addEventListener('mouseup', this.handleMouseUp);// required since cannot detect mouseup outside of canvas
  }

  handleMouseMove(event) {
    if (!this.state.isDrawing) {
      return;
    }
    this.draw(event);
  }

  handleMouseLeave(event) { // prevents drawing line along edge when mouse reenters canvas from where mouse left
    if (this.state.isDrawing) {
      this.context.undoStack.push(this.context.dataUrl);
      this.context.redoStack = [];
    }
    this.setState({ isDrawing: false, lastX: null, lastY: null });
    if (this.canvasRef.current) {
      this.context.dataUrl = this.canvasRef.current.toDataURL();
    }
  }

  handleMouseEnter(event) {
    if (this.state.isMouseDown) {
      this.setState({ isDrawing: true });
    }
  }

  handleMouseDown(event) {
    if (event.button !== 0) return;
    if (event.type !== 'mousedown') {
      return;
    }
    this.setState({ isDrawing: true, isMouseDown: true, mid: this.getMousePos(this.canvasRef.current, event) });
    this.draw(event);// allows users to draw dots or else requires dragging motion to draw
  }

  handleMouseUp(event) {
    if (this.state.isDrawing) {
      this.context.undoStack.push(this.context.dataUrl);
      this.context.redoStack = [];
    }
    this.setState({ isDrawing: false, lastX: null, lastY: null, isMouseDown: false, mid: null });
    if (this.canvasRef.current) {
      this.context.dataUrl = this.canvasRef.current.toDataURL();
    }
  }

  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  draw(event) {
    this.ctx.beginPath();// prevents jagged path by restarting path with every call to draw
    const { x, y } = this.getMousePos(this.canvasRef.current, event);
    const lineStyle = this.context.drawingUtensil === 'pen' ? this.context.lineStyle : 0;
    this.ctx.lineWidth = this.context.size;
    this.ctx.lineCap = 'round';
    this.ctx.globalAlpha = this.context.drawingUtensil === 'pen' ? this.context.opacity : 1;
    this.ctx.strokeStyle = this.context.drawingUtensil === 'pen' ? this.context.color : 'white';

    if (this.state.lastX && this.state.lastY) { // prevents gaps from drawing too fast
      const distance = this.distance(this.state.lastX, this.state.lastY, x, y);
      if (lineStyle === 0) { // line
        this.ctx.moveTo(this.state.lastX, this.state.lastY);
      }
      if (lineStyle === 1) { // dotted
        if (distance < this.context.size && lineStyle === 1) {
          return;
        }
        this.ctx.moveTo(x, y);
      }
      if (lineStyle === 2) { // horizontal mirror
        const canvas = this.canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const midX = (rect.right - rect.left) / 2 / (rect.right - rect.left) * canvas.width;
        const distToMidLastX = Math.abs(midX - this.state.lastX);
        const distToMidX = Math.abs(midX - x);
        this.ctx.moveTo(midX > this.state.lastX ? midX + distToMidLastX : midX - distToMidLastX, this.state.lastY);
        this.ctx.lineTo(midX > x ? midX + distToMidX : midX - distToMidX, y);
        this.ctx.moveTo(this.state.lastX, this.state.lastY);
      }
      if (lineStyle === 3) { // vertical mirror
        const canvas = this.canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const midY = (rect.bottom - rect.top) / 2 / (rect.bottom - rect.top) * canvas.height;
        const distToMidLastY = Math.abs(midY - this.state.lastY);
        const distToMidY = Math.abs(midY - y);
        this.ctx.moveTo(this.state.lastX, midY > this.state.lastY ? midY + distToMidLastY : midY - distToMidLastY);
        this.ctx.lineTo(x, midY > y ? midY + distToMidY : midY - distToMidY);
        this.ctx.moveTo(this.state.lastX, this.state.lastY);
      }
      if (lineStyle === 4) { // spiky
        this.ctx.moveTo(x + (x - this.state.lastX) * (this.context.size / 10 * distance), y + (y - this.state.lastY) * (this.context.size / 10 * distance));
      }
      if (lineStyle === 5) { // center
        const midX = this.state.mid.x;
        const midY = this.state.mid.y;
        this.ctx.moveTo(midX, midY);
      }
    }
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
    if (!this.props.editable) {
      return (
        <canvas
          ref={this.canvasRef}
          width='1920'
          height='1440'
          id="canvas">
        </canvas>
      );
    }
    return (
      <canvas
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleMouseDown}
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onTouchMove={this.handleMouseMove}
        onTouchStart={this.handleMouseDown}
        onTouchEnd={this.handleMouseUp }
        ref={this.canvasRef}
        width='1920'
        height='1440'
        id="canvas">
      </canvas>
    );
  }
}

Canvas.contextType = AppContext;
