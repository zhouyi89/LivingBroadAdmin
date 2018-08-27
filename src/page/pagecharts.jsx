//'use strict';

import React from 'react'

//antd
import Spin from 'antd/lib/spin'
import Button from 'antd/lib/button'

import PageHeader from '../components/pageheader.jsx'
import PageMain from '../components/pagemain.jsx'
import AffixFix from '../components/Affix.jsx'
import Highcharts from 'highcharts'
require('highcharts/modules/funnel')(Highcharts);

class Chart extends React.Component {
  /*constructor ( props ) {
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
    return React.createElement('div', {
      id: this.props.container
    });
  }
}

let element = React.createElement(Chart, {
  container: 'chart',
  options: {
    chart: {
      type: 'funnel',
      marginRight: 100
    },
    title: {
      text: 'React example',
      x: -50
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b> ({point.y:,.0f})',
          color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
          softConnector: true
        },
        neckWidth: '30%',
        neckHeight: '25%'

        //-- Other available options
        // height: pixels or percent
        // width: pixels or percent
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Unique users',
      data: [
        ['Website visits', 15654],
        ['Downloads', 4064],
        ['Requested price list', 1987],
        ['Invoice sent', 976],
        ['Finalized', 846]
      ]
    }]
  }
});

export default class pageMain extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      loading:true
    };
    setTimeout(()=>{
      this.setState({ loading: false });
    }, 1 * 1000);
  }
  render() {
    return (
      <section className="e-body">
        <PageHeader>
            <span>统计分析</span>测试图
        </PageHeader>
        <PageMain>
          <div className="cf">
            <AffixFix offsetTop={64} className="e-content-affix" style={{"height": "44px"}}>
              <div className="barpanel-toptoolbar">
                <div className="ant-row">
                  <div className="ant-col-6 ant-col-push-18" style={{"textAlign": "right"}}>
                    <Button type="primary" style={{"marginRight": "0.5em"}} icon="reload" loading={this.state.iconLoading} onClick={this.enterIconLoading}>刷 新</Button>
                    <button type="button" className="ant-btn ant-btn-primary" style={{"marginRight": "0.5em"}}>
                      <i className="anticon anticon-reload"></i>
                      <span>刷 新</span>
                    </button>
                    <button type="button" className="ant-btn ant-btn-ghost">
                      <i className="anticon anticon-copy"></i>
                      <span>打 印</span>
                    </button>
                  </div>
                </div>
              </div>
            </AffixFix>
            <div className="barpanel-content cf"><div className=" clearfix"><div className="" style={{"minHeight":"500px"}}>
            <Spin spinning={this.state.loading} className="" style={{"height": "100%"}}>
            {element}
            </Spin>
            </div></div></div>
          </div>
        </PageMain>
      </section>
    )
  }
}
