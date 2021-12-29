import React from 'react';

export default class ToolPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#000000',
      opacity: 1,
      size: 1
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.target.matches('input[type="color"]')) {
      this.setState({ color: event.target.value });
    }
    if (event.target.matches('input[type="range"]')) {
      this.setState({ [event.target.name]: event.target.value });
    }
  }

  render() {
    return (
      <div className="tool-picker" onChange={this.handleChange}>
        <div className="col-50 art-tools">
          <button>
            <input type="color" name="color" id="color" className="color-picker"/>
          </button>
          <button><i className="fas fa-pen"></i></button>
          <button><i className="fas fa-eraser"></i></button>
          <button><i className="fas fa-undo"></i></button>
          <button><i className="fas fa-redo"></i></button>
          <button><i className="fas fa-trash-alt"></i></button>
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
        </div>
      </div>
    );

  }
}
