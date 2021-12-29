import React from 'react';
import Canvas from '../components/canvas';
import ToolPicker from '../components/tool-picker';

export default function Create(props) {
  return (
    <div className="row create">
      <div className="col-70 canvas-and-tools">
        <Canvas />
        <ToolPicker />
      </div>
      <form className="col-30 submission-form">
          <input className="submit-title large-font" type="text" name="title" id="title" placeholder="Add a title!"/>
          <textarea rows='10' className="submit-caption" type="text" name="caption" id="caption" placeholder="Write a caption!" autoComplete='off'/>
          <div className="button-flex">
            <button className="submit-button blue-btn" type="submit">Submit!</button>
          </div>
      </form>
    </div>
  );
}
