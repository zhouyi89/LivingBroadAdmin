//'use strict';

import React from 'react'
import Highcharts from 'highcharts'
require('highcharts/modules/funnel')(Highcharts);

Highcharts.setOptions({
    lang:{
       contextButtonTitle:"图表导出菜单",
       decimalPoint:".",
       downloadJPEG:"下载JPEG图片",
       downloadPDF:"下载PDF文件",
       downloadPNG:"下载PNG文件",
       downloadSVG:"下载SVG文件",
       drillUpText:"返回 {series.name}",
       loading:"加载中",
       months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
       noData:"没有数据",
       numericSymbols: [ "千" , "兆" , "G" , "T" , "P" , "E"],
       printChart:"打印图表",
       resetZoom:"恢复缩放",
       resetZoomTitle:"恢复图表",
       shortMonths: [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec"],
       thousandsSep:",",
       weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期天"]
    }
});

export default class Chart extends React.Component {
  static defaultProps = {
    container: "chart"
  };  // 注意这里有分号
/*
  constructor ( props ) {
    super( props );
  }*/
  // When the DOM is ready, create the chart.
  componentDidMount() {
    // Extend Highcharts with modules
    if (this.props.modules) {
      this.props.modules.forEach(function(module) {
        module(Highcharts);
      });
    }
    // Set container which the chart should render to.
    // enabled:true,                    // 默认值，如果想去掉版权信息，设置为false即可
    /*text: 'www.hcharts.cn',             // 显示的文字
    href: 'http://www.hcharts.cn',      // 链接地址
    position: {                         // 位置设置
        align: 'left',
        x: 400,
        verticalAlign: 'bottom',
        y: -100
    },
    style: {                            // 样式设置
        cursor: 'pointer',
        color: 'red',
        fontSize: '30px'
    }*/
    //let {...options} = this.this.props.options;
    this.chart = new Highcharts[this.props.type || "Chart"](
      this.props.container,
      this.props.options
    );
  }
  //Destroy chart before unmount.
  componentWillUnmount() {
    this.chart.destroy();
  }
  //Create the div which the chart will be rendered to.
  render() {
    /*return React.createElement('div', {
      id: this.props.container
    });*/
    return (<div id={this.props.container} />);
  }
}
