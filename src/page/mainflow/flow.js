//'use strict';

import $ from "jquery"
import svgPanZoom from "svg-pan-zoom"
import React from 'react'
import ReactDOM from 'react-dom';
import SvgJS from 'svg.js/dist/svg.js'

const url = "/static/liuchen.svg"
const ps = {
  viewportSelector: '.svg-pan-zoom_viewport'
, panEnabled: true
, controlIconsEnabled: false
, zoomEnabled: true
, dblClickZoomEnabled: false
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
    $(this.svg).height(480)
    this.svgh = svgPanZoom(this.svg, ps);
    this.svgh.zoomBy(0.8);
    //this.svgh.fit();
    this.onsize()
    //this.setState({ ui: d });
    this.svg_init();
  }
  svg_init() {
    let all = SvgJS.select("g");
    let his = this.props.history;
    //all = all;
    all.each(function(i){
      let link = this.attr("data-href");
      if (link) {
        console.log(link);
        this.off();

        let pp = this.select('path')
        //let cc = pp.attr("fill");
        let tt = this;
        let cc = tt.attr("class");
        pp.on('mousemove', function() {
          let x = 'svgbutton ' + cc;
          tt.attr({'class':x})
          //this.attr({ fill: '#f03' })
          //this.fill({ color: '#f06' });
        });
        pp.on('mouseout', function() {
          tt.attr({'class':cc})
          //this.attr({ fill: 'red' })
          //pp.attr({ color: cc });
        });
        this.on('dblclick', ()=> {
          //if (window.evt.detail == 2) {
            his.replace("/index");
          //}
        });
      }
      console.log(i)
      console.log(this.attr());
      console.log(this)
    })
    console.log(all);
  }
  onsvgerr = () => {
    //this.ui.innerHTML
  }
  onsize = () => {
    if (this.svgh === null) {
      return;
    }
    //$(this.svg).height(480);
    //$(this.svg).width($(this.ui).width())
  }
  btnfit = ()=>{
    if(this.svgh) {
      this.svgh.reset();
      this.svgh.zoomBy(0.8);
      //this.svgh.fit();
      //this.svgh.resetZoom();
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
      <div style={{margin: "0 12px 0px"}}>
        <div ref="fixedNode" className="">{this.state.ui}</div>
        <div title="刷新" onClick={this.btnfit} className="svg-close___3GN06">
          <i className="anticon anticon-reload"></i>
        </div>
      </div>
    )
  }
}