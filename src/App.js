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

function PlaybackControlBox(props) {
  return (
    <div className="playback-control-box">
      <button onClick={props.previous} disabled={props.previousDisabled}>
        previous
      </button>
      <button onClick={props.playOrPauseCallback}>
        {props.playOrPause}
      </button>
      <button onClick={props.stop}>
        stop
      </button>
      <button onClick={props.skip}>
        skip
      </button>
    </div>
  )
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
    this.startDrawing = this.startDrawing.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
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
function calcNumberOfImages(drawTime,sessionTime) {
  return (timeToSeconds(sessionTime)/timeToSeconds(drawTime));
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
  return({hours:parseInt(seconds/3600, 10),minutes:parseInt(seconds%3600/60, 10),seconds:seconds%3600%60});
}
function parseTime(timeString) {
  timeString = timeString.replace(/:/g,"");
  var seconds = parseInt(timeString.slice(-2, timeString.length), 10);
  var minutes = parseInt(timeString.slice(-4, -2), 10);
  var hours = parseInt(timeString.slice(0, -4), 10);
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
    if (target.value.length === 6) { cursorPosition++; }
    if (target.value.length === 8) { cursorPosition--; }
    //const target = event.target;
    return function() {target.setSelectionRange(cursorPosition,cursorPosition);};
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
          drawTime:{hours:0,minutes:0,seconds:30},
          sessionTime:{hours:0,minutes:5,seconds:0},
          numberOfImages:10,
          //mode will be stop, play, or pause
          mode:"stop",
          images:[],
          currentImageNumber:0,
          playOrPause:"pause",
    };
    this.drawTimeChange = this.drawTimeChange.bind(this);
    this.sessionTimeChange = this.sessionTimeChange.bind(this);
    this.numberOfImagesChange = this.numberOfImagesChange.bind(this);
    this.imageCallback = this.imageCallback.bind(this);
    this.start = this.start.bind(this);
    this.countdown = this.countdown.bind(this);
    this.previous = this.previous.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.stop = this.stop.bind(this);
    this.skip = this.skip.bind(this);
    this.getImageUrl = this.getImageUrl.bind(this);
  }

  drawTimeChange(event) {
    const drawTimeString = event.target.value;
    const drawTime = parseTime(drawTimeString);
    const numberOfImages = calcNumberOfImages(drawTime, this.state.sessionTime);

    const unFubarCursorCallback = unFubarCursor(event.target);
    this.setState({drawTime:drawTime, numberOfImages:numberOfImages},
                  unFubarCursorCallback);
  }
  sessionTimeChange(event) {
    const sessionTimeString = event.target.value;
    const sessionTime = parseTime(sessionTimeString);
    const numberOfImages = calcNumberOfImages(this.state.drawTime, sessionTime);

    const unFubarCursorCallback = unFubarCursor(event.target);
    this.setState({sessionTime:sessionTime, numberOfImages:numberOfImages}, 
                  unFubarCursorCallback);
  }
  numberOfImagesChange(event) {
    const numberOfImages = event.target.value;
    const sessionTime = calcSessionTime(this.state.drawTime, numberOfImages);
    this.setState({sessionTime:sessionTime, numberOfImages:numberOfImages});
  }
  imageCallback(responseString) {
    const json = eval("("+responseString+")");

    const images = json.photos.photo;

    this.setState({
          images:images,
          currentImageNumber:0,
    });
  }

  start(event) {
    if (this.state.images.length>0) {
      clearInterval(this.state.counter);
      const counter = setInterval(this.countdown,1000);
      const sessionSeconds = timeToSeconds(this.state.sessionTime);
      const drawSeconds = timeToSeconds(this.state.drawTime);
      this.setState({
            sessionCountdown:sessionSeconds,
            imageCountdown:drawSeconds,
            mode:"play",
            counter:counter,
      });
    }
  }
  countdown() {
    let newImageCountdown = this.state.imageCountdown-1;
    let newSessionCountdown = this.state.sessionCountdown-1;
    let newCurrentImageNumber = this.state.currentImageNumber;
    if (newImageCountdown < 1) {
      newImageCountdown = timeToSeconds(this.state.drawTime);
      newCurrentImageNumber++;
    } 
    this.setState({
          sessionCountdown:newSessionCountdown,
          imageCountdown:newImageCountdown,
          currentImageNumber:newCurrentImageNumber,
    });
    if (newSessionCountdown < 1) {
      this.stop();
    }
  }
  previous(event) {
    const imageTime = timeToSeconds(this.state.drawTime);
    const offsetTime = 2*imageTime-this.state.imageCountdown;
    const newImageCountdown = imageTime;
    const newSessionCountdown = this.state.sessionCountdown+offsetTime;
    const newCurrentImageNumber = this.state.currentImageNumber-1;
    this.setState({
          sessionCountdown:newSessionCountdown,
          imageCountdown:newImageCountdown,
          currentImageNumber:newCurrentImageNumber,
    });
  }
  play(event) {
    const counter = setInterval(this.countdown, 1000);
    this.setState({
          playOrPause:"pause",
          counter:counter,
    });
  }
  pause(event) {
    clearInterval(this.state.counter);
    this.setState({
          playOrPause:"play",
    });
  }
  stop(event) {
    clearInterval(this.state.counter);
    this.setState({mode:"stop"});
  }
  skip(event) {
    const newImageCountdown = timeToSeconds(this.state.drawTime);
    const offsetTime = this.state.imageCountdown;
    const newSessionCountdown = this.state.sessionCountdown-offsetTime;
    const newCurrentImageNumber = this.state.currentImageNumber+1;
    this.setState({
          sessionCountdown:newSessionCountdown,
          imageCountdown:newImageCountdown,
          currentImageNumber:newCurrentImageNumber,
    });
    if (newSessionCountdown<1){
      this.stop()
    }
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
    const imageUrl = this.state.images.length===0 ? "" : this.getImageUrl(this.state.currentImageNumber);
    
    // show either time settings, or the countdown
    let drawTimeSetting = {};
    let sessionTimeSetting = {};
    if (this.state.mode==="stop") {
      drawTimeSetting = {"settingName":"draw time", "value":renderTime(this.state.drawTime), "onChange":this.drawTimeChange};
      sessionTimeSetting = {"settingName":"session", "value":renderTime(this.state.sessionTime), "onChange":this.sessionTimeChange};
    }else{
      const drawTimeDisplay = renderTime(secondsToTime(this.state.imageCountdown));
      const sessionTimeDisplay = renderTime(secondsToTime(this.state.sessionCountdown));
      drawTimeSetting = {"settingName":"draw time", "value":drawTimeDisplay, "onChange":""};
      sessionTimeSetting = {"settingName":"session", "value":sessionTimeDisplay, "onChange":""};
    }
    const settings = [
                drawTimeSetting,
                sessionTimeSetting,
                {"settingName":"images", "value":this.state.numberOfImages, "onChange":this.numberOfImagesChange},
    ];
    const previousDisabled = this.state.currentImageNumber===0 ? true : false;
    const previousCallback = this.state.currentImageNumber===0 ? "" : this.previous;
    const playOrPauseCallback = this.state.playOrPause==="pause" ? this.pause : this.play;
    const maybeDisplayBox = this.state.mode==="stop" ?
        <SettingsBox
              className="settings-box-fake"
              settings={settings}
        />
      :
        <div className="display-box">
          <SettingsBox
                className="settings-box-fake"
                settings={settings}
          />
          <ImageDisplayBox imageUrl={imageUrl} />
          <PlaybackControlBox
              previous={previousCallback}
              previousDisabled={previousDisabled}
              playOrPause={this.state.playOrPause}
              playOrPauseCallback={playOrPauseCallback}
              stop={this.stop}
              skip={this.skip}
          />
        </div>
    ;
    return (
      <div className="App">
        <SettingsBox
              className="settings-box-real"
              settings={settings}
        />
        {maybeDisplayBox}
        <SearchBox imageCallback={this.imageCallback} start={this.start} />
        <ImageSelectionBox images={imageSelections} />
      </div>
    );
  }
}

export default App;
