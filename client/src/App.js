import React, { Component } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import EditToDo from './components/EditToDo';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDos: [],
      edit: { isEditing: false, editedItem: undefined },
      task: '',
    };

    this.updateItem = this.updateItem.bind(this);
  }
  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('addTask', (task) => {
      this.addItem(task);
    });
    this.socket.on('updateList', (list) => {
      this.setState((prevState) => ({ ...prevState, toDos: [...list] }));
    });
  }
  addItem({ task, id }) {
    this.setState((prevState) => ({
      ...prevState,
      toDos: [...prevState.toDos, { task, id }],
    }));
  }
  editItem(id) {
    console.log('editing', id);
    this.setState((prevState) => ({
      ...prevState,
      edit: { isEditing: true, editedItem: id },
    }));
  }
  updateItem(task) {
    this.setState((prevState) => ({
      ...prevState,
      edit: { isEditing: false, editedItem: null },
      toDos: prevState.toDos.map((item) => (item.id !== task.id ? item : task)),
    }));
    this.socket.emit('updateTask', task);
  }
  removeToDoItem(id) {
    this.setState((prevState) => ({
      ...prevState,
      toDos: prevState.toDos.filter((item) => item.id !== id),
    }));
    this.socket.emit('removeTask', id);
  }
  submitHanlder(e) {
    e.preventDefault();
    const task = { task: this.state.task, id: uuidv4() };
    this.addItem(task);
    this.setState((prevState) => ({ ...prevState, task: '' }));
    this.socket.emit('addTask', task);
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.toDos.map((item) => (
              <React.Fragment key={item.id}>
                {this.state.edit.editedItem === item.id && (
                  <li className="task">
                    <EditToDo task={item} update={this.updateItem} />
                  </li>
                )}
                {this.state.edit.editedItem !== item.id && (
                  <li key={item.id} className="task">
                    {item.task}
                    <span>
                      <button
                        className="btn"
                        onClick={() => this.editItem(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn--red"
                        onClick={() => this.removeToDoItem(item.id)}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={(e) => this.submitHanlder(e)}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.state.task}
              onChange={(e) =>
                this.setState((prevState) => ({
                  ...prevState,
                  task: e.target.value,
                }))
              }
            />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
