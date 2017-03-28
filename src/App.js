import React, { Component } from 'react';
import './App.css';

function SettingBox(props) {
  return (
    <div className="setting-box">
      <legend className="setting-box">{props.settingName}</legend>
      <input className="setting-box" name={props.settingName}
          value={props.value}
          onChange={props.onChange} />
    </div>
  );
}

function SessionSettingsBox(props) {
    const settings = props.settings.map((setting) =>
      <li className="setting-box" key={setting["settingName"]}>
      <SettingBox settingName={setting["settingName"]} value={setting["value"]} onChange={setting["onChange"]} />
      </li>
    );
  return (
    <ul className="session-settings-box">
      {settings}
    </ul>
  );
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
      <div className="playback-control-box">
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

class ImageDisplayBox extends Component {
  render() {
    return (
      <div className="image-display-box">images go here</div>
    )
  }
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
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
    console.log(event);
    alert(event.target.value);
    //this.searchImages(this.state.value);
    event.preventDefault();
  }
  startDrawing(event) {
    alert("Drawing will begin!");
    event.preventDefault();
  }

  searchImages(event,searchTerm) {
    event.preventDefault();
    httpGetAsync(
       'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6c76a6758b1e9f0cd9f22e74ea6a50ee&sort=relevance&text='+searchTerm+'&format=json&extras=url_q,url_c&nojsoncallback=1',
          this.props.imageCallback);
  }

  render() {
    return (
      <form className="search-box">
        <label>
          <input type="text" autoFocus="autofocus" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Search" onClick={(e)=>this.searchImages(e,this.state.value)} />
        <input type="submit" value="Draw" onClick={this.startDrawing} />
      </form>
    );
  }
}

class ImageBox extends Component {
  render() {
    return (
      <div className="image-box">
        <img className="image-box-image" src={this.props.image} alt={this.props.alt} />
      </div>
    )
  }
}

class ImageSelectionBox extends Component {
  render() {
    return (
      <div className="image-selection-box">
        {this.props.images}
      </div>
    )
  }
}

function calcNumberOfImages(drawTime,session) {
  return (session*60/drawTime)
}
function calcSessionTime(drawTime,numberOfImages) {
  let sessionTimeSeconds = drawTime*numberOfImages;
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
          numberOfImages:10,
          images:[],
    };
    this.drawTimeChange = this.drawTimeChange.bind(this);
    this.sessionTimeChange = this.sessionTimeChange.bind(this);
    this.numberOfImagesChange = this.numberOfImagesChange.bind(this);
    this.imageCallback = this.imageCallback.bind(this);
  }

  updateImages(json) {
  }
  drawTimeChange(event) {
    const drawTime = event.target.value;
    const numberOfImages = calcNumberOfImages(drawTime, this.state.session);
    this.setState({drawTime:drawTime, numberOfImages:numberOfImages});
  }
  sessionTimeChange(event) {
    const session = event.target.value;
    const numberOfImages = calcNumberOfImages(this.state.drawTime, session);
    this.setState({session:session, numberOfImages:numberOfImages});
  }
  numberOfImagesChange(event) {
    const numberOfImages = event.target.value;
    const session = calcSessionTime(this.state.drawTime, numberOfImages);
    console.log({session:session, numberOfImages:numberOfImages});
    this.setState({session:session, numberOfImages:numberOfImages});
    console.log({session:session, numberOfImages:numberOfImages});
  }
  imageCallback(responseString) {
    const json = eval("("+responseString+")");
    console.log(json);

    const images = json.photos.photo.slice(0,30).map((photo) =>
        <ImageBox id={photo.id} image={photo.url_q} alt={photo.title} />
    );

    this.setState({images:images});
  }

  render() {
    return (
      <div className="App">
        <SessionSettingsBox
              settings={[
                {"settingName":"draw time (sec)", "value":this.state.drawTime, "onChange":this.drawTimeChange},
                {"settingName":"session (min)", "value":this.state.session, "onChange":this.sessionTimeChange},
                {"settingName":"images", "value":this.state.numberOfImages, "onChange":this.numberOfImagesChange},
              ]}
        />
        <ImageDisplayBox />
        <PlaybackControlBox />
        <SearchBox imageCallback={this.imageCallback} />
        <ImageSelectionBox images={this.state.images} />
      </div>
    );
  }
}

export default App;
