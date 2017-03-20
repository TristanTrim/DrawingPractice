import React, { Component } from 'react';
import './App.css';


function SettingBox(props) {
  return (
    <div>
      <legend>{props.settingName}</legend>
      <input name={props.settingName}
          value={props.value}
          onChange={props.onChange} />
    </div>
  );
}

function SessionSettingsBox(props) {
    const settings = props.settings.map((setting) =>
      <li key={setting["settingName"]}>
      <SettingBox settingName={setting["settingName"]} value={setting["value"]} onChange={setting["onChange"]} />
      </li>
    );
  return (
    <ul>
      {settings}
    </ul>
  );
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
    this.state = {images: images};
  }

  render() {
    return (
      <ul>
        {this.state.images}
      </ul>
    )
  }
}

function calcNumberOfImages(drawTime,session) {
  return (session*60/drawTime)
}
function calcSessionTime(drawTime,images) {
  let sessionTimeSeconds = drawTime*images;
  let sessionTime = sessionTimeSeconds/60;
  if (sessionTimeSeconds%60) { sessionTime++ }
  return (sessionTime)
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
          drawTime:30,
          session:5,
          images:10,
    };
    this.drawTimeChange = this.drawTimeChange.bind(this);
    this.sessionTimeChange = this.sessionTimeChange.bind(this);
    this.numberOfImagesChange = this.numberOfImagesChange.bind(this);
  }

  drawTimeChange(event) {
    const drawTime = event.target.value;
    const images = calcNumberOfImages(drawTime, this.state.session);
    this.setState({drawTime:drawTime, images:images});
  }
  sessionTimeChange(event) {
    const session = event.target.value;
    const images = calcNumberOfImages(this.state.drawTime, session);
    this.setState({session:session, images:images});
  }
  numberOfImagesChange(event) {
    const images = event.target.value;
    const session = calcSessionTime(this.state.drawTime, images);
    console.log({session:session, images:images});
    this.setState({session:session, images:images});
    console.log({session:session, images:images});
  }

  render() {
    return (
      <div className="App">
        <SessionSettingsBox
              settings={[
                {"settingName":"draw time (sec)", "value":this.state.drawTime, "onChange":this.drawTimeChange},
                {"settingName":"session (min)", "value":this.state.session, "onChange":this.sessionTimeChange},
                {"settingName":"images", "value":this.state.images, "onChange":this.numberOfImagesChange},
              ]}
        />
        <ImageDisplayBox />
        <PlaybackControlBox />
        <SearchBox />
        <ImageSelectionBox />
      </div>
    );
  }
}

export default App;
