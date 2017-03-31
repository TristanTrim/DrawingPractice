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

function SettingsBox(props) {
    const settings = props.settings.map((setting) =>
      <li className="setting-box" key={setting["settingName"]}>
      <SettingBox settingName={setting["settingName"]} value={setting["value"]} onChange={setting["onChange"]} />
      </li>
    );
  return (
    <ul className={props.className}>
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

function ImageDisplayBox(props) {
  const setBG = {
    backgroundImage: 'url(' + props.imageUrl + ')',
  };
  return (
    <div className="image-display-box" style={setBG} />
  )
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
    this.startDrawing = this.startDrawing.bind(this);
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
    event.preventDefault();
    this.props.start();
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

class ImageSelectionBox extends Component {
  render() {
    return (
      <div className="image-selection-box">
        {this.props.images}
      </div>
    )
  }
}

// calculations for session time & images
function calcNumberOfImages(drawTime,session) {
  return (timeToSeconds(session)/timeToSeconds(drawTime));
}
function calcSessionTime(drawTime,numberOfImages) {
  let sessionTimeSeconds = timeToSeconds(drawTime)*numberOfImages;
  return secondsToTime(sessionTimeSeconds);
}

// tools for time input field
function timeToSeconds(time) {
  return(time.hours*3600+time.minutes*60+time.seconds);
}
function secondsToTime(seconds) {
  return({hours:seconds/3600,minutes:seconds%3600/60,seconds:seconds%3600%60});
}
function parseTime(timeString) {
  timeString = timeString.replace(/:/g,"");
  var seconds = parseInt(timeString.slice(-2, timeString.length));
  var minutes = parseInt(timeString.slice(-4, -2));
  var hours = parseInt(timeString.slice(0, -4));
  seconds = isNaN(seconds) ? 0 : seconds;
  minutes = isNaN(minutes) ? 0 : minutes;
  hours = isNaN(hours) ? 0 : hours;
  return({hours:hours,minutes:minutes,seconds:seconds});
}
function renderTime(time) {
  var hours = time.hours;
  var minutes = time.minutes >= 10 ? time.minutes : "0"+time.minutes;
  var seconds = time.seconds >= 10 ? time.seconds : "0"+time.seconds;
  return hours+":"+minutes+":"+seconds;
}
function unFubarCursor(target) {
    let cursorPosition = target.selectionEnd;
    if (target.value.length == 6) { cursorPosition++; }
    if (target.value.length == 8) { cursorPosition--; }
    //const target = event.target;
    return function() {target.setSelectionRange(cursorPosition,cursorPosition);};
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
          drawTime:{hours:0,minutes:0,seconds:30},
          session:{hours:0,minutes:5,seconds:0},
          numberOfImages:10,
          images:[],
          currentImageNumber:0,
    };
    this.drawTimeChange = this.drawTimeChange.bind(this);
    this.sessionTimeChange = this.sessionTimeChange.bind(this);
    this.numberOfImagesChange = this.numberOfImagesChange.bind(this);
    this.imageCallback = this.imageCallback.bind(this);
    this.start = this.start.bind(this);
    this.getImageUrl = this.getImageUrl.bind(this);
  }

  drawTimeChange(event) {
    const drawTimeString = event.target.value;
    const drawTime = parseTime(drawTimeString);
    const numberOfImages = calcNumberOfImages(drawTime, this.state.session);

    const unFubarCursorCallback = unFubarCursor(event.target);
    this.setState({drawTime:drawTime, numberOfImages:numberOfImages},
                  unFubarCursorCallback);
  }
  sessionTimeChange(event) {
    const sessionTimeString = event.target.value;
    const sessionTime = parseTime(sessionTimeString);
    const numberOfImages = calcNumberOfImages(this.state.drawTime, sessionTime);

    const unFubarCursorCallback = unFubarCursor(event.target);
    this.setState({session:sessionTime, numberOfImages:numberOfImages}, 
                  unFubarCursorCallback);
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

    const images = json.photos.photo;

    this.setState({images:images});
  }

  start(event) {
    const newCurrentImageNumber = this.state.currentImageNumber+1;
    console.log(newCurrentImageNumber);
    console.log(this.state.images[newCurrentImageNumber]);
    this.setState({currentImageNumber:newCurrentImageNumber});
  }

  getImageUrl(imageNumber) {
    const image = this.state.images[imageNumber];
    const farmId = image.farm;
    const serverId = image.server;
    const id = image.id;
    const secret = image.secret;
    return "https://farm"+farmId+".staticflickr.com/"+serverId+"/"+id+"_"+secret+".jpg";
  }

  render() {
    const imageSelections = this.state.images.slice(0,30).map((photo) =>
      <div key={photo.id} className="image-box">
        <img className="image-box-image" src={photo.url_q} alt={photo.title} />
      </div>
    );
    const imageUrl = this.state.images.length==0 ? "" : this.getImageUrl(this.state.currentImageNumber);
    const settings = [
                {"settingName":"draw time", "value":renderTime(this.state.drawTime), "onChange":this.drawTimeChange},
                {"settingName":"session", "value":renderTime(this.state.session), "onChange":this.sessionTimeChange},
                {"settingName":"images", "value":this.state.numberOfImages, "onChange":this.numberOfImagesChange},
    ];
    return (
      <div className="App">
        <SettingsBox
              className="settings-box-real"
              settings={settings}
        />
        <div className="display-box">
          <SettingsBox
                className="settings-box-fake"
                settings={settings}
          />
          <ImageDisplayBox imageUrl={imageUrl} />
          <PlaybackControlBox />
        </div>
        <SearchBox imageCallback={this.imageCallback} start={this.start} />
        <ImageSelectionBox images={imageSelections} />
      </div>
    );
  }
}

export default App;
