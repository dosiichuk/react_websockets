import React, { Component } from 'react';

class EditToDo extends Component {
  constructor(props) {
    super(props);
    this.state = { task: this.props.task.task };
  }
  render() {
    return (
      <>
        <div>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            value={this.state.task}
            onChange={(e) => this.setState({ task: e.target.value })}
          />
        </div>
        <button
          className="btn"
          onClick={() =>
            this.props.update({ ...this.props.task, task: this.state.task })
          }
        >
          Update
        </button>
      </>
    );
  }
}

export default EditToDo;
