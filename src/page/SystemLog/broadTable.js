import React from 'react';
import { Table, Form, Affix, Popover } from 'antd';
import Broadform from './broadform'

import playimg from './iconloop.png'
import downimg from './download.png'
const MyBroadform = Form.create()(Broadform);

let audioPlayer = null;
let canplay;
let srcTarget=null; 
let audioisplay;
let cc=true;
class opbroadTable extends React.Component {
    state = {
        sourcedata: [],
        loading: false
    };

    loadingtrue() {
        this.setState({loading: true})
    }

    loadingfalse() {
        console.log("falsefalsefalsefalse")
        this.setState({loading: false})
    }

    hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
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

    getBLen(str) {
        if (str == null) return 0;
        if (typeof str != "string") {
            str += "";
        }
        return str.replace(/[^\x00-\xff]/g, "01").length;
    }

    sec_to_time(s) {
        var t;
        if (s > -1) {
            var hour = Math.floor(s / 3600);
            var min = Math.floor(s / 60) % 60;
            var sec = s % 60;
            if (hour < 10) {
                t = "";
            } else {
                t = "";
            }

            if (min < 10) {
                t += "0";
            }
            t += min + ":";
            if (sec < 10) {
                t += "0";
            }
            t += sec.toFixed(0);
        }
        return t;
    }

    componentDidMount() {
        audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.volume = 1;
        var that = this;
        this.props.store.subscribe(() => {
            const {broadTabledatasource} = this.props.store.getState();
            that.setState({loading: true})
            that.setState({sourcedata: broadTabledatasource});

            setTimeout(that.loadingfalse.bind(that), 10)
        });
    };

    playaudio(e) {
        var that = this;
        if (srcTarget != null) {
            audioPlayer.removeEventListener("canplay", canplay);
            this.removeClass(audioisplay, 'changeDis')
            if (e.target.parentNode.parentNode.querySelector("#audio_length").getAttribute("data-index") == srcTarget.getAttribute("data-index")) {
                if (cc) {
                    this.addClass(e.target.parentNode.parentNode.parentNode.querySelector("#audio_span"), 'changeDis')
                    cc = false;
                }
                else {
                    cc = true;
                }

            }
        }

        srcTarget = e.target.parentNode.parentNode.querySelector("#audio_length");
        audioisplay = e.target.parentNode.parentNode.parentNode.querySelector("#audio_span")
        canplay = function () {
            var dd = document.getElementById("audioPlayer").duration;
            srcTarget.innerHTML = that.sec_to_time(dd)
            audioPlayer.play();
            setTimeout(function () {
                that.removeClass(audioisplay, 'changeDis');
                audioPlayer.removeEventListener("canplay", canplay)
            }, (dd - 1) * 1000)
        }

        if (!this.hasClass(audioisplay, 'changeDis')) {

            this.addClass(audioisplay, 'changeDis')
            audioPlayer.src = srcTarget.getAttribute("src");

        } else {
            this.removeClass(audioisplay, 'changeDis')
            audioPlayer.pause();
            audioPlayer.removeEventListener("canplay", canplay)
        }
        audioPlayer.addEventListener("canplay", canplay)
    }

    render() {
        const {sourcedata} = this.state;
        const columns = [{
            title: '模式',
            dataIndex: 'Mode',
            key: 'Mode',
            width: "10%",
            render: (text, record, index) => {
                switch (text) {
                    case 1:
                        return "文件广播"
                        break;
                    case 2:
                        return "设备广播"
                        break;
                    case 3:
                        return "短讯广播"
                        break;
                    case 4:
                        return "图片广播"
                        break;
                    case 5:
                        return "网络广播"
                        break;
                    case 6:
                        return "电话广播"
                        break;
                }
            }
        },
            {
                title: '开始时间',
                dataIndex: 'StartTime',
                key: 'StartTime',
                width: "10%"
            }, {
                title: '结束时间',
                dataIndex: 'EndTime',
                key: 'EndTime',
                width: "10%"
            }, {
                title: '电话号码',
                dataIndex: 'PhoneNum',
                key: 'PhoneNum',
                width: "10%"
            }, {
                title: '名字',
                dataIndex: 'Name',
                key: 'Name',
                width: "10%"
            }, {
                title: '区域',
                dataIndex: 'Region',
                key: 'Region',
                width: "20%",
                render: (text, record, index) => {
                    let len = this.getBLen(text);
                    let txt;
                    let pop;
                    if (len > 20 && len < 300) {
                        txt = text.substring(0, 20) + "...";
                        pop = (<div className="mypopdiv">{text}</div>);
                    }
                    else if (len > 300) {
                        txt = text.substring(0, 20) + "...";
                        pop = (<div className="mypopdiv">{text.substring(0, 300) + "..."}</div>);
                    }
                    else {
                        txt = text;
                        pop = (<div className="mypopdiv">{text}</div>);
                    }
                    return <Popover content={pop}>
                        {txt}
                    </Popover>

                }
            }, {
                title: '详情',
                dataIndex: 'Details',
                key: 'Details',
                width: "20%",
                render: (text, record, index) => {
                    let len = this.getBLen(text);
                    let txt;
                    let pop;
                    if (len > 20 && len < 300) {
                        txt = text.substring(0, 20) + "...";
                        pop = (<div className="mypopdiv">{text}</div>);
                    }
                    else if (len > 300) {
                        txt = text.substring(0, 20) + "...";
                        pop = (<div className="mypopdiv">{text.substring(0, 300) + "..."}</div>);
                    }
                    else {
                        txt = text;
                        pop = (<div className="mypopdiv">{text}</div>);
                    }
                    return <Popover content={pop}>
                        {txt}
                    </Popover>
                }
            }
            , {
                title: '历史播放',
                dataIndex: 'Play',
                key: 'Play',
                width: "45px",
                // fixed: 'right',
                render: (text, record, index) => {
                    var audiosrc = "http://"+window.location.hostname+":8010" + text;
                    return (
                        record.Mode === 5 ? <div/> : <p className="weixinAudio" onClick={this.playaudio.bind(this)}>
                        <span id="audio_area" className="db audio_area">
                            <span id="audio_span" className="db audio_wrp">

                                <span className="audio_play_area">
                                    <i className="icon_audio_default">
                                    </i>
                                    <i className="icon_audio_playing">
                                    </i>
                                </span>

                                <span id="audio_length" data-index={index} className="audio_length tips_global"
                                      src={audiosrc}>
                                    00:00
                                 </span>
                            </span>
                        </span>

                            <a href={audiosrc} download="w3logo"> </a>
                        </p>

                    )
                }
            },
            , {
                title: '下载',
                dataIndex: 'download',
                key: 'download',
                width: "45px",
                // fixed: 'right',
                render: (text, record, index) => {
                    var audiosrc = "http://"+window.location.hostname+":8010" + record.Play;
                    return (
                        record.Mode === 5 ? <div/> : <a href={audiosrc} download="历史音频"><p className="weixinAudio">
                        <span className="db audio_area">
                            <span className="db audio_wrp">

                                <span className="audio_play_area">
                                    <i className="icon_download">
                                    </i>
                                </span>
                            </span>
                        </span>
                        </p>
                        </a>
                    )
                }
            }
        ];
        return (
            <div id="affix">
                <Affix offsetTop={64}>
                    <div className="table-operations">
                        <MyBroadform store={this.props.store} loadingtrue={this.loadingtrue}
                                     loadingfalse={this.loadingfalse}/>
                    </div>
                </Affix>
                <div id="myoptable" style={{padding: "0 24px"}}>


                    <Table loading={this.state.loading} pagination={{
                        pageSize: 20, showSizeChanger: true, showQuickJumper: true,
                        onChange(current) {
                            var initplay = document.querySelectorAll('.audio_wrp');
                            // var inittime=  document.querySelectorAll('.audio_length');
                            for (let i = 0; i < initplay.length; i++) {
                                initplay[i].setAttribute("class", "db audio_wrp")
                                // inittime[i].innerHTML="00:00"
                                audioPlayer.pause()
                            }
                        },
                    }} columns={columns} dataSource={sourcedata} onChange={this.handleChange}
                           bordered
                    />

                    <audio src="" id="audioPlayer">
                        您的浏览器不支持 audio 标签。
                    </audio>
                    <style>{
                        `
                    .mypopdiv{
                        height:100%;
                        width:200px;
                        word-wrap: break-word;
                    }
                    .table-operations {
                        padding: 8px 24px;
                        margin-left: 2px;
                    }
                    .ant-affix .table-operations {
                        padding: 8px 24px;
                        background: #fff;
                        border-bottom: 1px solid #ececec;
                        box-shadow: 0 2px 6px rgba(100, 100, 100, 0.1);
                        margin-left: 2px;
                    }
                    .table-operations > button {
                    margin-right: 8px;
                    }
                    #myoptable .ant-table-tbody>tr>td, #myoptable .ant-table-thead>tr>th {
                        padding: 10px 8px;
                        word-break: break-all;
                    }
                    {/* 历史播放器CSS */}
                    .icon_audio_playing {
    background: transparent url(${playimg})  no-repeat 0 0;
    width: 18px;
    height: 25px;
    vertical-align: middle;
    display: inline-block;
    -webkit-background-size: 54px 25px;
    background-size: 54px 25px;
    -webkit-animation: audio_playing 1s infinite;
    animation: audio_playing 1s infinite;
    -moz-animation: audio_playing 1s infinite;
    background-position: 0px center;
    display: none;
}
.changeDis .icon_audio_playing{
    display: block;
}
.changeDis .icon_audio_default{
    display: none;
}
.icon_audio_default {
    background: transparent url(${playimg}) no-repeat 0 0;
    width: 18px;
    height: 25px;
    vertical-align: middle;
    display: inline-block;
    -webkit-background-size: 54px 25px;
    background-size: 54px 25px;
    background-position: -36px center;
}
.icon_download {
    background-image: url(${downimg});
    width: 24px;
    height: 24px;
    vertical-align: middle;
    display: inline-block;
    margin-left: -3px;

}
@keyframes audio_playing{
	30% {
    background-position: 0px center;
}
31% {
    background-position: -18px center;
}
61% {
    background-position: -18px center;
}
61.5% {
    background-position: -36px center;
}
100% {
    background-position: -36px center;
}
}

@-moz-keyframes audio_playing{
	30% {
    background-position: 0px center;
}
31% {
    background-position: -18px center;
}
61% {
    background-position: -18px center;
}
61.5% {
    background-position: -36px center;
}
100% {
    background-position: -36px center;
}
}

@-webkit-keyframes audio_playing{
	30% {
    background-position: 0px center;
}
31% {
    background-position: -18px center;
}
61% {
    background-position: -18px center;
}
61.5% {
    background-position: -36px center;
}
100% {
    background-position: -36px center;
}
}
p {
    clear: both;
    min-height: 1em;
    /* white-space: pre-wrap; */
}
.weixinAudio {
    line-height: 2.5;
    cursor: pointer;
    width: 44px;
}
.audio_area {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    margin: 0px 1px 0px 0;
    font-size: 0;
    position: relative;
    font-weight: 400;
    text-decoration: none;
    -ms-text-size-adjust: none;
    -webkit-text-size-adjust: none;
    text-size-adjust: none;
}
.audio_wrp {
    border: 1px solid #ebebeb;
    background-color: #fcfcfc;
    overflow: hidden;
    padding:0 12px;
}
.audio_play_area {
    float: left;
    margin: 3px 0;
    font-size: 0;
    width: 18px;
    height: 25px;
}
.audio_area .audio_length {
    float: right;
    font-size: 14px;
    margin-top: 5px;
    display: none;
}
.audio_info_area {
    overflow: hidden;
}
.audio_area .progress_bar {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #0cbb08;
    height: 2px;
}
.db {
    display: block;
}
.audio_area .audio_title {
    font-weight: 400;
    font-size: 17px;
    margin-top: -2px;
    margin-bottom: -3px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
    word-wrap: normal;
}
.tips_global {
    color: #8c8c8c;
}
.audio_area .audio_source {
    font-size: 14px;
}


                    `}
                    </style>
                </div>
            </div>
        );
    }
}

export default opbroadTable;