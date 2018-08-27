import React from 'react';
import removeImg from './dist/remove.png'
import setImg from './dist/set.png'
import loading from './dist/loading.gif'
import errorImg from './dist/error.png'
// import Flv from 'flv.js'
import Flv from 'flv.js/dist/flv.js';
import { Input,Popconfirm,Modal,Form,message,Select } from 'antd';
import { netdata } from './../../helper'
import { withRouter } from 'react-router'

import $ from 'jquery'
const FormItem = Form.Item;
const Option = Select.Option;
var flvPlayer=null;
let playid;
const videocontent=  withRouter(class videocontent extends React.Component {
    state = {
        deviceDATA:[],
        devicevisible:false,
        devicename:"",
        deviceip:"",checkid:1,
        pauseandPlay:true,
        dname:"",
        devicesList:[],
        yzChecked:[],
        videoID:""
    }    
    componentWillMount(){

    }
    updatebar(x) {
        var progress = $('.timebar .progress-bar'); //进度条
		// var maxduration = playVideo[0].duration; //Video 
		var positions = x - progress.offset().left; //Click pos
		var percentage = 100 * positions / $('.timebar .progress').width();
		//Check within range
		if (percentage > 100) {
			percentage = 100;
		}
		if (percentage < 0) {
			percentage = 0;
		}

		//Update progress bar and video currenttime
		progress.css('width', percentage + '%');
		// playVideo[0].currentTime = maxduration * percentage / 100;
	};
	//音量控制
	volumeControl(e) {
        var volumebar = $('.volumeBar .volumewrap').find('.progress-bar');
		e = e || window.event;
		var eventype = e.type;
		var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
		var positions = 0;
		var percentage =30;
		if (eventype == "click") {
			positions = volumebar.offset().top - e.pageY;
			percentage = 100 * (positions + volumebar.height()) / $('.volumeBar .volumewrap').height();
		} else if (eventype == "mousewheel" || eventype == "DOMMouseScroll") {
			percentage = 100 * (volumebar.height() + delta) / $('.volumeBar .volumewrap').height();
		}
		if (percentage < 0) {
			percentage = 0;
			$('.otherControl .volume').attr('class', 'volume fa fa-volume-off');
		}
		if (percentage > 50) {
			$('.otherControl .volume').attr('class', 'volume fa fa-volume-up');
		}
		if (percentage > 0 && percentage <= 50) {
			$('.otherControl .volume').attr('class', 'volume fa fa-volume-down');
		}
		if (percentage >= 100) {
			percentage = 100;
		}
		$('.volumewrap .progress-bar').css('height', percentage + '%');
		flvPlayer.volume = percentage / 100;
		e.stopPropagation();
		e.preventDefault();
    }
    
   IEVersion() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 7) {
                return false;
            } else if(fIEVersion == 8) {
                return false;
            } else if(fIEVersion == 9) {
                return false;
            } else if(fIEVersion == 10) {
                return false;
            } else {
                return false;//IE版本<=7
            }   
        } else if(isEdge) {
            return true;//edge
        } else if(isIE11) {
            return false; //IE11  
        }else{
            return true;//不是ie浏览器
        }
    }


    componentDidMount() {
        let that =this;
        document.addEventListener("visibilitychange", function(){

            if(!document.hidden){
                if(flvPlayer!=null)
                {

                    flvPlayer.currentTime=flvPlayer.buffered.end(0)-0.5;                 // flvPlayer.load();
                    // flvPlayer.play();
                } 
            }else{
                if(flvPlayer!=null)
                {

                    // flvPlayer.pause();
                    // flvPlayer.unload();
                }  
            }

        });
        
        $(document).click(function() {
            $('.volumeBar').hide();
        });
        $('.volume').on('click', function(e) {
            e = e || window.event;
            $('.volumeBar').toggle();
            e.stopPropagation();
        });
        $('.volumeBar').on('click mousewheel DOMMouseScroll', function(e) {
            e = e || window.event;
            that.volumeControl(e);
            e.stopPropagation();
            return false;
        });
        $('.timebar .progress').mousedown(function(e) {
            e = e || window.event;
            that.updatebar(e.pageX);
        });

        window.onresize = function(){
            var height = (window.innerHeight - 64) + "px";
            var height1 = (window.innerHeight) + "px";
      
            try {
              document.getElementById('videoCON').style.height = height;
              document.getElementById('myebody').style.height=height1;
              document.getElementById('myregiontreediv').style.height = height;
              $("#wrapcontent").css("min-height",height)
            } catch (error) {
      
            }
          };
        
        this.props.store.subscribe(() => {
            const { deviceDATA ,devicesList} = this.props.store.getState();          
            this.setState({deviceDATA:deviceDATA,devicesList:devicesList})
            
         });
    }

    componentWillUnmount () {  
        window.onresize= function(){}
        if(flvPlayer!=null)
        {this.flv_destroy();}
      }
    flv_destroy(){
        $("#refreshbutton").hide();
        flvPlayer.pause();
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
        flvPlayer = null;
        // flvPlayer.load();
        // flvPlayer.destroy();
    }
    flv_pause(){
        let fff =document.getElementById("playpause");
        if(this.state.pauseandPlay){
            flvPlayer.pause(); 
            this.removeClass(fff,"fa-pause");
            this.addClass(fff,"fa-play");
            this.setState({pauseandPlay:false})
        }else{
            flvPlayer.unload();
            flvPlayer.detachMediaElement();
            flvPlayer.destroy();
            flvPlayer = null;
            this.removeClass(fff,"fa-play");
            this.addClass(fff,"fa-pause");
            this.setState({pauseandPlay:true})
            setTimeout(() => {
                this.flv_reload();
            }, 300);
           
        }
    }

    flv_close(){

        if(this.IEVersion()){
            $(".wrapcontent").show();
                setTimeout(() => {
            var videoCON=  document.getElementById("videoCON");
            this.removeClass(videoCON,"showvideoCON");
            $("#videoCON").hide();
            $(".wrapcontent").css('opacity',1)
            }, 350);
            let fff =document.getElementById("playpause");
            this.removeClass(fff,"fa-play");
            this.addClass(fff,"fa-pause");
            this.setState({pauseandPlay:true})
            this.flv_destroy();
        }
        else{
            $(".wrapcontent").show();
            setTimeout(() => {
            var videoCON_IE=  document.getElementById("videoCON_IE");
            this.removeClass(videoCON_IE,"showvideoCON");
            $("#videoCON_IE").hide();
            $(".wrapcontent").css('opacity',1)
            }, 350);
        }
        
    } 
    RndNum(n){
        var rnd="";
        for(var i=0;i<n;i++)
            rnd+=Math.floor(Math.random()*10);
        return rnd;
    }
    flv_reload(){
        document.getElementById('cctvvideo').poster=loading;
        let playurl ="http://"+window.location.hostname+":8089/video/"+playid+".flv?"+this.RndNum(9);
        if (Flv.isSupported()) {
            var videoElement = document.getElementById('cctvvideo');
             flvPlayer = Flv.createPlayer({
                type: 'flv',
                url: playurl,
                // isLive:true
            },{
                enableWorker: true, enableStashBuffer: false, stashInitialSize: 128,seekType:"param",seekParamEnd:"bend",fixAudioTimestampGap:true
            });
            flvPlayer.attachMediaElement(videoElement);
            // flvPlayer.volume = 30 / 100;
            // var flvPlayer1 = Flv.createPlayer({
            //     type: 'flv',
            //     url: 'http://127.0.0.1:8080/live.flv'
            // });
            // flvPlayer1.attachMediaElement(videoElement1);
            // flvPlayer1.load();
             flvPlayer.load();

             flvPlayer.on("error",function(){
                // $('#cctvvideo').css("poster","")
                 document.getElementById('cctvvideo').poster=null;
                // document.getElementById('refreshbutton')

                $("#refreshbutton").show();
             })
            // flvPlayer1.play(); flvPlayer.play(); 
        }
    }
    rolooo(){
        this.flv_destroy();

        setTimeout(() => {
            this.flv_reload();
        }, 300);
    }
    DELETEclick(id){
        let that =this;
        let r = {
            method: "POST",
            body: JSON.stringify({opt:"delDevice",ids:id})
          };
          netdata("/topoly/videoTreeOpt.epy", r).then(that.DELETEclickondata.bind(that));
    }
    DELETEclickondata(res) {
        if (res.d.errCode == 0) {
        //   this.setState({ gData: res.d.Values });
        this.props.store.setState({ data:res.d.Values ,changeTag:true});
           message.success("删除成功！");
        //   this.setState({
        //     addvisible: false,addregionname:""
        //   });
    
        } else {
           message.error(res.d.errCode);
        }
      }
    SETclick(id){
        let data =this.state.deviceDATA;
        let checkdata=[]
        for(let i=0;i<data.length;i++){
            if(data[i].id===id){
                checkdata=data[i];
            }
        }
        let bindyz=[]
        if(checkdata.bindspeakerids==""){
            bindyz=[]
        }else{
            bindyz= checkdata.bindspeakerids.split(",");
        }
        let bindyzz=[]
        for(let i=0;i<bindyz.length;i++){
            bindyzz.push(parseInt(bindyz[i]))
        }
        this.setState({devicevisible:true,checkid:id,devicename:checkdata.desc,deviceip:checkdata.ipaddr,yzChecked:bindyzz})
    }

    devicehandleCancel(){

        this.setState({devicevisible:false})
    }

    devicehandleOk(){
        let bindyz =`${this.state.yzChecked}`
        let that =this;
        let r = {
            method: "POST",
            body: JSON.stringify({ opt: "mfyDevice",id: that.state.checkid,desc:that.state.devicename,ipaddr:that.state.deviceip,bindspeakerids:bindyz,jsoninfo:""})
          };
          netdata("/topoly/videoTreeOpt.epy", r).then(that.modifydeviceondata.bind(that));
    }
    modifydeviceondata(res) {
        if (res.d.errCode == 0) {
        //   this.setState({ gData: res.d.Values });
        this.props.store.setState({ data:res.d.Values ,changeTag:true});
          message.success("修改成功！");
          this.setState({
            devicevisible: false
          });
    
        } else {
          message.error(res.d.errCode);
        }
      }
      nameChange(e){
        this.setState({ devicename: e.target.value });
      }
      ipChange(e){
        this.setState({ deviceip: e.target.value });
      }
      fullScreen(){
        var ele = document.getElementById('cctvvideo');
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullScreen) {
            ele.webkitRequestFullScreen();
        }
      }
      showVideo(id,name){

        playid=id;
        this.setState({dname:name})
        if(this.IEVersion()){
                    this.flv_reload();
                    var videoCON=  document.getElementById("videoCON");
                    $("#videoCON").show();
                    $(".wrapcontent").hide().css('opacity',0);
                    this.addClass(videoCON,"showvideoCON")
        }else{



                    this.setState({videoID:playid})
                    var videoCON_IE=  document.getElementById("videoCON_IE");
                    $("#videoCON_IE").show();
                    $(".wrapcontent").hide().css('opacity',0);
                    this.addClass(videoCON_IE,"showvideoCON")     ;



        }

      }
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
    renderwrapcontent(data,e){
        let that =this;
        var wrap = data.map(function (item) {
                return (<div className="wrapitem">
                <div className="tp">
                    <figure className="effect-bubba">
                      {/* <img className="lazy" src={videoImg}  width="300" height="158" /> */}
                        <div className="imgdiv">

                        </div>
                       <figcaption  onClick={()=>{that.showVideo(item.id,item.desc)}}>
                                <p>播  放  视  频</p>
                      </figcaption>
                    </figure>
            
                </div>
            
            <div className="wrapitem-mesg">
                  <ul> 
                       <li  onClick={()=>{that.SETclick(item.id)}}><a  ><img src={setImg} width="24" height="24" /></a></li>
                    <Popconfirm placement="right" title={"是否删除当前摄像头?"} onConfirm={()=>{that.DELETEclick(item.id)}} okText="是" cancelText="否">
                         <li><a  ><img src={removeImg} width="24" height="24" /></a></li>
                     </Popconfirm>
                  </ul>
                  <span className="pull-right">{item.desc}</span>
            </div>
            </div>)

        })
        return wrap;
    }



    renderOption(data){
        if(data.length===0){
          return [];
        }
        let dd =data["dev1"];
        let children = [];
        for (let index = 0; index < dd.length; index++) {
        
          children.push(<Option value={dd[index].id} key={dd[index].id}>{dd[index].desc+"——"+dd[index].RegionName}</Option>);
        }
        return children;
      }
    
      tzhandleChange(value) {
        this.setState({yzChecked:value})
      }
    render() {
        let that= this;

        let layout={
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
          } 
        return (

<div style={{position:"relative",overflow:"hidden"}}>
		<div className="wrapcontent" id="wrapcontent">
                    {this.renderwrapcontent(this.state.deviceDATA)}                            
        </div>
        <div id="videoCON" className="videopannel"  style={{display: "none"}}>
                <div className="playHeader">
                    <div className="videoName">{this.state.dname}<span onClick={this.flv_close.bind(this)} className="video-close fa fa-close"></span></div>
                    
                </div>
                <div className="playContent">

                        <video poster={loading} autoPlay width="100%" height="100%" id="cctvvideo">

                        </video>
                        <i  onClick={this.rolooo.bind(this)} id="refreshbutton"  className="playPause fa fa-refresh ui-icon"  style={{display:"none"}}><span></span></i>    
                </div>
                    <div className="playControll">
                    <div className="playPause" onClick={this.flv_pause.bind(this)}><span id="playpause" className="pausespan fa fa-pause"></span></div>
                    
                    <div className="otherControl">
                        
                        <span className="volume fa fa-volume-down"></span>
                        <span onClick={this.rolooo.bind(this)} className="reload fa fa-refresh"></span>
                        <span  onClick={this.fullScreen.bind(this)} className="fullScreen fa fa-arrows-alt"></span>
                        <div className="volumeBar" style={{display: "none"}}>
                                <div className="volumewrap">
                                    <div className="progress" >
                                    <div className="progress-bar progress-bar-danger" role="progressbar" aria-valuemin="0" aria-valuemax="100" style={{width: "8px",height: "40%"}}></div>
                                </div>
                                    </div>
                            </div>
                    </div>
                        </div>
           
        </div>
        <div id="videoCON_IE" className="videopannel"  style={{display: "none"}}>
                <div className="playHeader">
                    <div className="videoName">{this.state.dname}<span onClick={this.flv_close.bind(this)} className="video-close fa fa-close"></span></div>
                    
                </div>
                <div className="playContentX">
                <iframe id="iframe-video"  src={"./video_IE.html?index="+this.state.videoID} width="100%" height="100%" frameborder="no"  style={{border:0}} border="0" ></iframe>

                        {/* <div className="playTip glyphicon glyphicon-pause" style="display: none;"></div> */}
                </div>
           
        </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
        <Modal title="修改摄像头"
          visible={this.state.devicevisible}
          onOk={this.devicehandleOk.bind(this)}
          onCancel={this.devicehandleCancel.bind(this)}
        >
        <FormItem
       {...layout}
        label="摄像头名称">

            <Input value={this.state.devicename}  placeholder="输入名称" onChange={this.nameChange.bind(this)}/>

        </FormItem>
        <FormItem
       {...layout}
        label="地址">

            <Input value={this.state.deviceip}  placeholder="输入摄像头地址" onChange={this.ipChange.bind(this)}/>

        </FormItem>
        <FormItem
       {...layout}
        label="绑定音柱">

            
            <Select
                mode="tags"
                style={{ width: '100%' }}
                onChange={this.tzhandleChange.bind(this)}
                tokenSeparators={[',']}
                value={this.state.yzChecked}
              >
                {this.renderOption(this.state.devicesList)}
              </Select>

        </FormItem>
        </Modal>
<style>{`
.playPause.ui-icon {
    position: absolute;
    top: 45%;
    left: 10px;
    right: 0;
    display: block;
    width: auto;
  }
  .playPause.ui-icon:before, .playPause.ui-icon:after {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .playPause.ui-icon:after {
    content: '';
    width: 80px;
    height: 80px;
    margin: -40px 0 0 -40px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 10px;
  }
  .playPause.ui-icon:before {
    font-size: 40px;
    line-height: 80px;
    color: rgba(244, 209, 126, 0.5);
    z-index: 2;
    top: 50%;
    left: 50%;
    margin: -40px 0 0 -18px;
  }
  .playPause.ui-icon.fa-pause:before, .playPause.ui-icon.fa-undo:before {
    margin-left: -17px;
  }


  .playPause:hover{
    opacity: 0.7;
  }




#videoCON .otherControl .volumeBar {
    display: none;
    position: absolute;
    top: -110px;
    left: 8px;
    width: 26px;
    height: 100px;
    background: #f1f2f2;
    border-radius: 4px;
    cursor: pointer;
}
#videoCON .otherControl .volumeBar:after {
    content: "";
    display: block;
    position: absolute;
    bottom: -7px;
    left: 5px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #f1f2f2;
}
#videoCON .otherControl .volumeBar .progress-bar {
    position: absolute;
    bottom: 0px;
    left: 0px;
    border-radius: 4px;
}
.progress-bar-danger {
    background-color: #d9534f;
}
.progress-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, .15);
    -webkit-transition: width .6s ease;
    -o-transition: width .6s ease;
    transition: width .6s ease;
}
#videoCON .otherControl .volumeBar .progress {
    background: none;
}
#videoCON  .progress {
    height: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
}
#videoCON .otherControl .volumeBar .volumewrap {
    background: #a2a7aa;
    width: 8px;
    height: 80px;
    position: absolute;
    bottom: 10px;
    left: 9px;
    border-radius: 4px;
}
#videoCON span:hover{
    color:#629cda;
}
#videoCON .pausespan{
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
    font-size: 20px;
    margin: 9px 7px;
    cursor: pointer;
}
.videopannel .video-close{
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    vertical-align: middle;
    font-size: 24px;
    margin: 9px 7px;
    cursor: pointer;
    position: absolute;
    right:3px;
}


.videopannel .playContent {
    position: relative;
    height: 94%;
    overflow: hidden;
    background: #171b1f;
    cursor: pointer;
}
.videopannel .playContentX {
    padding-top:35px;
    position: relative;
    height: 100%;
    overflow: hidden;
    background: #171b1f;
    cursor: pointer;
}
.videopannel .playHeader {
    width: 100%;
    height: 48px;
    // background: url(${require("./dist/playheader.jpg")}) repeat-x;
    border-radius: 3px 3px 0px 0px;
    position: absolute;
    z-index: 1;
}
.videopannel .playHeader .videoName {
    font-size: 16px;
    width: 400px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    margin: 0 auto;
    color: #7a7f82;
}
        #videoCON .playControll {
            position: absolute;
            z-index: 100;
            width: 100%;
            height: 48px;
            bottom: 0;
            background: url(${require("./dist/playheader.jpg")}) repeat-x;
            border-radius: 0px 0px 3px 3px;
            -moz-user-select: none;
            -webkit-user-select: none;
            user-select: none;
        }
        #videoCON .playControll .playPause {
            float: left;
        }
        #videoCON .otherControl {
            float: right;
            position: relative;
        }
        #videoCON .otherControl span:nth-child(1) {
            font-size: 28px;
            
        }
        #videoCON .otherControl span:nth-child(2) {
          
        }
        #videoCON .otherControl span {
            display: inline-block;
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            vertical-align: middle;
            font-size: 20px;
            margin: 9px 7px;
            cursor: pointer;
        }

                .videopannel{
                    min-width: 100%;
                    height: ${window.innerHeight-64}px;
                    overflow-y: hidden;
                    overflow-x: hidden;
                    // position: absolute;
                    background-color: #000;
                    box-shadow: 0px 4px 7px rgba(0,0,0,0.6);
                    opacity: 0;
                    z-index: 202;
                    -webkit-transition: opacity .6s ease-in-out;
                    -moz-transition: opacity .6s ease-in-out;
                    -o-transition: opacity .6s ease-in-out;
                    -ms-transition: opacity .6s ease-in-out;
                    transition: opacity .6s ease-in-out;
                }

                .showvideoCON{
                    opacity: 1;
                    // top: 0px;
                }

                .imgdiv{
                    position: relative;
                    display: block;
                    opacity: 1;
                    width:300px;
                    height:158px;
                    background-image:url(${require("./dist/video.jpg")});  
                    background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
                }
                            		.wrapcontent{
                                        padding: 0 10%;
                                        min-width: 1000px;
                                        overflow: hidden;
                                        min-height: ${window.innerHeight-64}px;
                                        -webkit-transition: opacity .6s ease-in-out;
                                        -moz-transition: opacity .6s ease-in-out;
                                        -o-transition: opacity .6s ease-in-out;
                                        -ms-transition: opacity .6s ease-in-out;
                                        transition: opacity .6s ease-in-out;
                                    }
                                    .wrapcontent .wrapitem{
                                            position: relative;
                                            float: left;
                                            width: 300px;
                                            margin-left: 2%;
                                            margin-top: 2%;
                                            padding-bottom: 1px;
                                            background: #fff;
                                            -webkit-box-shadow: 0 0 4px rgba(0,0,0,.2);
                                            box-shadow: 0 0 4px rgba(0,0,0,.2);
                                            height: 215px;
                                    }
                                    .wrapcontent .wrapitem::before{
                                                background:url(${require("./dist/shadow-right.png")}) bottom center no-repeat;
                                                content: '';
                                                display: block;
                                                width: 100px;
                                                height: 15px;
                                                position: absolute;
                                                bottom: -9px;
                                                right: -6px;
                            
                                    }
                                    .wrapcontent .wrapitem::after{
                                        clear: both;
                                        background:url(${require("./dist/shadow-left.png")}) bottom left no-repeat;
                                        content: '';
                                        display: block;
                                        width: 100px;
                                        height: 15px;
                                        position: absolute;
                                        bottom: -11px;
                                        left: -3px;
                                            }
                            
                                .wrapcontent .wrapitem  figure {
                                position: relative;
                                z-index: 1;
                                display: inline-block;
                                overflow: hidden;
                                width: 100%;
                                height: 100%;
                                cursor: pointer;
                                    margin: 0;
                            }
                            
                            
                            .wrapcontent .wrapitem figure img {
                                position: relative;
                                display: block;
                                opacity: 1;
                            }
                            
                            /*figure.effect-bubba img {
                                opacity: .7;
                                -webkit-transition: opacity .35s;
                                transition: opacity .35s;
                            }*/
                            
                            .wrapcontent .wrapitem-mesg{
                            /*padding: 20px 15px;
                                border-top: 1px solid #f2f2f2;*/
                            }
                            .wrapitem-mesg ul li {
                                float: left;
                                height: 32px;
                                width: 32px;
                            }
                            .wrapitem-mesg ul  {
                                margin: 10px;
                            }	
                            .wrapitem-mesg .pull-right {
                                float: right!important;
                                margin: 3px 12px;
                                font-size: 16px;
                            }
                            
                            .wrapcontent .wrapitem  figure a, .wrapcontent .wrapitem  figure figcaption {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                            }
                            .wrapcontent .wrapitem figure figcaption {
                            
                            
                                color: #fff;
                                text-transform: uppercase;
                                font-size: 1.25em;
                                -webkit-backface-visibility: hidden;
                                backface-visibility: hidden;
                            }
                            figcaption::after, figure.effect-bubba figcaption::before {
                                position: absolute;
                                top: 30px;
                                right: 30px;
                                bottom: 30px;
                                left: 30px;
                                content: '';
                                opacity: 0;
                                -webkit-transition: opacity .35s,-webkit-transform .35s;
                                transition: opacity .35s,transform .35s;
                            }
                            
                            .wrapcontent figcaption p {
                                letter-spacing: 1px;
                                margin: 0;  
                                font-size: 16px;
                                position: relative;
                                color: #fff;
                                padding: 5px 10px;
                            }
                            figure.effect-bubba p {
                                padding: 67px 107px;
                                opacity: 0;
                                -webkit-transition: opacity .35s,-webkit-transform .35s;
                                transition: opacity .35s,transform .35s;
                                -webkit-transform: translate3d(0,20px,0);
                                transform: translate3d(0,20px,0);
                            }
                            figure.effect-bubba:hover h2, figure.effect-bubba:hover p {
                                opacity: 1;
                                -webkit-transform: translate3d(0,0,0);
                                transform: translate3d(0,0,0);
                            }
                            figure.effect-bubba figcaption::before {
                                border-top: 1px solid #fff;
                                border-bottom: 1px solid #fff;
                                -webkit-transform: scale(0,1);
                                transform: scale(0,1);
                            }
                            figure.effect-bubba figcaption::after {
                                border-right: 1px solid #fff;
                                border-left: 1px solid #fff;
                                -webkit-transform: scale(1,0);
                                transform: scale(1,0);
                            }
                             figure figcaption::after,  figure figcaption::before {
                                pointer-events: none;
                            }
                            figure.effect-bubba:hover figcaption{
                                background: rgba(53,172,197,0.45);
                            }
                            figure.effect-bubba:hover figcaption::after, figure.effect-bubba:hover figcaption::before {
                                opacity: 1;
                                -webkit-transform: scale(1);
                                transform: scale(1);
                            }
                            
                            
                            
                            
                            `}</style>



</div>

)
                                  
                        {/* <Button onClick={this.flv_destroy.bind(this)}>卸载 </Button>
                        <Button onClick={this.flv_reload.bind(this)}>重载 </Button>
                        <Button onClick={this.rolooo.bind(this)}>更新 </Button>
                    <video id="cctvvideo" autoPlay controls height="50%" width="50%"/>      */}
                            
               
    }
}
);
export default videocontent;