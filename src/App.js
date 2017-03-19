import React, { Component } from 'react';
import './App.css';


class SettingBox extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onSettingChange(e.target.value);
  }

  render() {
    const setting = this.props.setting;
    const value = this.props.value;
    return (
      <tr>
        <td><legend>{setting}</legend></td>
        <td><input value={value}
            onChange={this.handleChange} /></td>
      </tr>
    );
  }
}

class SessionSettingsBox extends Component {
  render() {
    return (
      <tr>
        <td><SettingBox setting="draw time" value="30" /></td>
        <td><SettingBox setting="session time" value="5" /></td>
        <td><SettingBox setting="images" value="10" /></td>
      </tr>
    );
  }
}


class ImageDisplayBox extends Component {
  render() {
    return (
      <div>images go here</div>
    )
  }
}

function previous () {
    alert("previous");
}

function pause () {
    alert("pause");
}

function stop () {
    alert("stop");
}

function skip () {
    alert("skip");
}

class PlaybackControlBox extends Component {
  render() {
    return (
      <div>
        <button onClick={previous}>
          previous
        </button>
        <button onClick={pause}>
          pause
        </button>
        <button onClick={stop}>
          stop
        </button>
        <button onClick={skip}>
          skip
        </button>
      </div>
    )
  }
}

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A search was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Search" />
        <input type="submit" value="Draw" />
      </form>
    );
  }
}

class ImageBox extends Component {
  render() {
    return (
      <div>
        image {this.props.image} goes here
      </div>
    )
  }
}

class ImageSelectionBox extends Component {
  constructor(props) {
    super(props);
    const numbers = [1, 2, 3, 4, 5];
    const images = numbers.map((number) =>
      <li key={number.toString()}>
        <ImageBox image={number} />
      </li>
    );
    this.state = {images: images}
  }

  render() {
    return (
      <ul>
        {this.state.images}
      </ul>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <SessionSettingsBox />
        <ImageDisplayBox />
        <PlaybackControlBox />
        <SearchBox />
        <ImageSelectionBox />
      </div>
    );
  }
}

export default App;
