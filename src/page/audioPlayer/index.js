import React from 'react';
// import { netdata } from './../../helper'
import http from 'stream-http'
import './css/index.css'
import pic from './image/timg.jpg'

var params = {
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false
};
var _mediaSource;
/**
 * The MediaSource's AudioBuffer.
 */
var _sourceBuffer;

/**
 * Stores all the buffers that we load.
 * @type {Array}
 */
var _loadedBuffers = [];

/**
 * The audio analyser of the web audio API that will be used
 * for getting audio data.
 */
var _analyser;

/**
 * Holds a counter with all cached the buffered that we send to the
 * SourceBuffer.
 * @type {Number}
 */
var _itemsAppendedToSourceBuffer = 0;

class audioPlayer extends React.Component {
  state = {
    URL: "http://192.168.101.189:1337/live.mp3?index=6149",
    isChrome: true
  };
  addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
  }

  removeClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  }
  toggleClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      this.removeClass(obj, cls);
    } else {
      this.addClass(obj, cls);
    }
  }
  hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
  getCss(o,key){
    return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];   
  };
  startDrag(bar, target, callback){
    var thism =this;
    if(thism.getCss(target, "left") !== "auto"){
      params.left = thism.getCss(target, "left");
    }
    // if(getCss(target, "top") !== "auto"){
    //   params.top = getCss(target, "top");
    // }
    //o是移动对象
    bar.onmousedown = function(event){
      params.flag = true;
      if(!event){
        event = window.event;
        //防止IE文字选中
        bar.onselectstart = function(){
          return false;
        }  
      }
      var e = event;
      params.currentX = e.clientX;
    //  params.currentY = e.clientY;
    };
    document.onmouseup = function(){
      params.flag = false;  
      if(thism.getCss(target, "left") !== "auto"){
        params.left = thism.getCss(target, "left");
      }
      // if(getCss(target, "top") !== "auto"){
      //   params.top = getCss(target, "top");
      // }
    };
    document.onmousemove = function(event){
      var e = event ? event: window.event;
  
      if(params.flag){ 
        var regulate= document.getElementById("volume_regulate");
        var width =regulate.clientWidth;
        var left=(e.clientX-regulate.offsetLeft-3/2).toFixed(0)-200;
        if(left<0||left>width){
          return;
        }
        else{
          var vol =(left/71*100).toFixed(0);
          document.getElementById('volume_bar').style.width=vol.toString()+"%"
          // iframevol(vol);
        }
        var nowX = e.clientX;
        //, nowY = e.clientY;
        var disX = nowX - params.currentX;
        //, disY = nowY - params.currentY;
        target.style.left = parseInt(params.left) + disX + "px";
       // target.style.top = parseInt(params.top) + disY + "px";
        if (event.preventDefault) {
          event.preventDefault();
        }
        return false;
      }
      
      if (typeof callback == "function") {
        callback(parseInt(params.left) + disX);
      }
    } 
  };



  getdata = (cx) => {
    alert(this.state.URL);
    http.get(this.state.URL, function (res) {
      //var div = document.getElementById('result');
      //div.innerHTML += 'GET /beep<br>';
      res.on('data', function (buf) {
        cx(buf)
      });
      res.on('end', function () {
        //div.innerHTML += '<br>__END__';
      });
    })
  }


  startFileLoading(i) {
    i = 0;
    // Load the chunk
    this.getdata(function (result) {
      _loadedBuffers.push(result);

      if (!_sourceBuffer.updating) {
        //loadNextBuffer();
        _sourceBuffer.appendBuffer(_loadedBuffers.shift());
      }
    });
  }

  loadNextBuffer() {
    if (_loadedBuffers.length) {
      _sourceBuffer.appendBuffer(_loadedBuffers.shift());
      _itemsAppendedToSourceBuffer++;
    }
  }
  sourceOpenCallback() {
    _sourceBuffer = _mediaSource.addSourceBuffer('audio/mpeg');
    _sourceBuffer.addEventListener('updateend', this.loadNextBuffer, false);

    // Start
    this.startFileLoading(0);
  }

  /**
   * Will be executed when the MediaSource is closed.
   */
  sourceCloseCallback() {
    _mediaSource.removeSourceBuffer(_sourceBuffer);
  }

  /**
   * Will be executed when the MediaSource is ended.
   */
  sourceEndedCallback() {
    console.log('mediaSource readyState: ' + this.readyState);
  }

  setupWebAudio(audio) {
    var audioContext = new AudioContext();
    _analyser = audioContext.createAnalyser();
    var source = audioContext.createMediaElementSource(audio);
    source.connect(_analyser);
    _analyser.connect(audioContext.destination);
  }

  audioInit() {
    var _audioEl = document.querySelector('#track');
    _mediaSource.addEventListener('sourceopen', this.sourceOpenCallback.bind(this), false);
    _mediaSource.addEventListener('webkitsourceopen', this.sourceOpenCallback.bind(this), false);
    _mediaSource.addEventListener('sourceclose', this.sourceCloseCallback.bind(this), false);
    _mediaSource.addEventListener('webkitsourceclose', this.sourceCloseCallback.bind(this), false);
    _mediaSource.addEventListener('sourceended', this.sourceEndedCallback.bind(this), false);
    _mediaSource.addEventListener('webkitsourceended', this.sourceEndedCallback.bind(this), false);

    // This starts the entire flow. This will trigger the 'sourceopen' event
    _audioEl.src = window.URL.createObjectURL(_mediaSource);

    // Typical setup of the Web Audio API and the scene.
    this.setupWebAudio(_audioEl);

  }
  BrowserType() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("Trident") > -1 && userAgent.indexOf(".NET") > -1; //判断是否IE浏览器
    var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    if (isIE) {
      this.setState({ isChrome: false })
    }//isIE end

    // if (isFF) { alert("FF") }
    // if (isOpera) { alert("Opera")}
    // if (isSafari) { alert("Safari")}
    if (isChrome) {
      _mediaSource = new MediaSource();
      this.setState({ isChrome: false })
    }
    // if (isEdge) { alert("Edge")}
    else {
      this.setState({ isChrome: false })
    }
  }//myBrowser() end

  componentWillMount() {
    this.BrowserType();
  }
  componentDidMount() {
    var folded_bt = document.getElementById('folded_bt');
    var that = this;
    //显示隐藏
    folded_bt.addEventListener('click', function () {
      var mplayer = document.getElementById('m_player');
      if (!that.hasClass(mplayer, "m_player_folded")) {
        mplayer.style.left = "-440px"
      } else {
        mplayer.style.left = 0
      }
      that.toggleClass(mplayer, "m_player_folded");
    }, false);

    var play_bt = document.getElementById('play_bt');
    play_bt.addEventListener('click', function () {
      that.toggleClass(play_bt, "pause_bt");
      var iframesrc = document.getElementById("iframe-audio");
      var audio = document.getElementById('track');
      if (that.hasClass(play_bt, 'pause_bt')) {
        // var src = document.getElementById("srcinput").value;
        //  srcurl=src;
        if(that.state.isChrome){
          audio.play();
        }
        else{
          iframesrc.src = "./httpflv.html?"+that.props.src;
        }
      }
      else {
        if(that.state.isChrome){
          audio.pause();
        }
        else{
          iframesrc.src = "";
        }
      }

    }, false);
    var dragtarget = document.getElementById("volume_op");
    this.startDrag(dragtarget,dragtarget);
    if (this.state.isChrome) {
      this.audioInit();
    }

  };
  render() {
    const { isChrome } = this.state
    return (
      // <section className="e-body" style={{ height: window.innerHeight }}>
      //   <PageHeader>测试页面</PageHeader>
      //   <div className="my-content">
      <div className="m_player" id="m_player">
        {isChrome ? <audio autoPlay id="track" src=""></audio> : <iframe id="iframe-audio" name="audiochild" src="./httpflv.html?a=1" width="10" height="10" style={{ position: 'absolute' }}></iframe>
        }
        <div className="m_player_dock">
          <div className="music_icon">
            <a href="javascript:;" className="album_pic">
              <img src={pic} width="90" height="90" alt="" />
            </a>
            <div className="music_info_main">
              <p className="music_name">
                <span>应急广播直播测试</span>
                <a className="icon_radio"></a>
              </p>
              <p className="singer_name">路通</p>
              <p className="play_date"></p>
            </div>
          </div>
          <div className="bar_op">
            <strong className="play_bt pause_bt" id="play_bt" title="播放"></strong>
            <p className="volume" title="音量调节">
              <span className="volume_icon" title="设置为静音"></span>
              <span className="volume_regulate" id="volume_regulate">
                <span className="volume_bar" id="volume_bar"></span>
                <span className="volume_op" id="volume_op"></span>
              </span>
            </p>
          </div>
        </div>
        <button type="button" className="folded_bt" id="folded_bt"></button>
      </div>
      //   </div>
      // </section>
    )
  }
}

export default audioPlayer;