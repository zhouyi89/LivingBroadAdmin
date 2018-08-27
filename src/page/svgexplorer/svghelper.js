//'use strict';

import $ from "jquery"
import svgPanZoom from "svg-pan-zoom"
import React from 'react'
import ReactDOM from 'react-dom';

//import PageHeader from '../../components/pageheader.jsx'
//import PageMain from '../../components/pagemain.jsx'
//import AffixFix from '../../components/Affix.jsx'

const url = "/static/t4.svg"
const ps = {
  viewportSelector: '.svg-pan-zoom_viewport'
, panEnabled: true
, controlIconsEnabled: false
, zoomEnabled: true
, dblClickZoomEnabled: true
, mouseWheelZoomEnabled: true
, preventMouseEventsDefault: true
, zoomScaleSensitivity: 0.2
, minZoom: 0.1
, maxZoom: 20
, fit: true
, contain: false
, center: true
, refreshRate: 'auto'
, beforeZoom: function(){}
, onZoom: function(){}
, beforePan: function(){}
, onPan: function(){}
//, customEventsHandler: function(){}
, eventsListenerElement: null
}
export default class svgLoadData extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      ui:""
    };
    this.clear();
    /*
    setTimeout(()=>{
      this.setState({ loading: false });
    }, 1 * 1000);*/
  }
  clear() {
    let h = this.svgh;
    this.svgh = null;
    this.svg = null;
    if (h) {
      h.destroy();
    }
  }
  onsvg = d => {
    this.ui.innerHTML = d
    this.svg = this.ui.getElementsByTagName("svg")[0];
    //拖放只能有一个g元素，如果太多子元素，需要重新变化
    let svgChildren = this.svg.childNodes || this.svg.children;
    console.log(svgChildren.length)
    //if (!!svgChildren && svgChildren.length > 500) {
      this.svg.innerHTML = "<g>" + this.svg.innerHTML + "</g>"
    //}
    $(this.svg).width($(this.ui).width()).height(480)
    this.svgh = svgPanZoom(this.svg, ps);
    this.svgh.fit();
    this.onsize()
    //this.setState({ ui: d });
  }
  onsvgerr = () => {
    //this.ui.innerHTML
  }
  onsize = () => {
    if (this.svgh === null) {
      return;
    }
    $(this.svg).width($(this.ui).width())
    //let v2 = ReactDOM.findDOMNode(this.refs.fixedNode2);
    //this.svgh.fit();
  }
  btnfit = ()=>{
    if(this.svgh) {
      this.svgh.reset();
      this.svgh.fit();
    }
  }
  componentDidMount() {
    $(window).bind('resize', this.onsize)
    this.ui = ReactDOM.findDOMNode(this.refs.fixedNode);
    this.clear();
    setTimeout(()=>{$.get(url, this.onsvg.bind(this), "text").catch(this.onsvgerr);}, 1000);
  }
  componentWillUnmount() {
    $(window).unbind('resize', this.onsize)
    this.clear();
  }
  //<!--a target="_blank" href="/building/buildinfo/floor/editor/88/0"></a>
  render() {
    return (
      <div style={{height:480, margin: "0 -12px 0px"}}>
        <div ref="fixedNode" className="drag-wrap___K6pJ5">{this.state.ui}</div>
        <div title="全屏" className="svg-scan___33LKf">
          <i className="anticon anticon-scan"></i>
        </div>

        <div title="刷新" onClick={this.btnfit} className="svg-refresh___-v1PR">
          <i className="anticon anticon-reload"></i>
        </div>
        <div title="编辑" className="svg-edit___3WmHC">
          <i className="anticon anticon-edit"></i>
        </div>
        <div title="删除" className="svg-close___3GN06">
          <i className="anticon anticon-cross"></i>
        </div>
      </div>
    )
  }
}