//'use strict';

import React from 'react'

//antd
import Breadcrumb from 'antd/lib/breadcrumb'
import Icon from 'antd/lib/icon'
import Spin from 'antd/lib/spin'

import { Link } from 'react-router'
//Router, Route, , hashHistory, IndexRoute, Redirect, IndexLink
import PageHeader from '../components/pageheader.jsx'
import PageMain from '../components/pagemain.jsx'
//import AffixFix from '../Affix.jsx'
//Affix,
//const { SubMenu } = Menu;
//const SubMenu = Menu.SubMenu;
//const MenuItemGroup = Menu.ItemGroup;
//const Divider= Menu.Divider;

//const { Header, Content, Footer, Sider } = Layout;

//import '../index.css';
/*
var Frame = React.createClass({

  render: function() {
    return <iframe />;
  },
  componentDidMount: function() {
    this.renderFrameContent();
  },
  renderFrameContents: function() {
    var doc = this.getDOMNode().contentDocument
    if(doc.readyState === 'complete') {
       React.renderComponent(this.props.children, doc.body);
    } else {
       setTimeout(this.renderFrameContents, 0);
    }
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});
*/

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
    //console.log(this.props)
    return (
      <section className="e-body">
        <PageHeader>校园地图</PageHeader>
        <PageMain>
          <div className="map-wrap___Cs4HJ">
            <div className="" style={{"height": "100%"}}>
              <Spin spinning={this.state.loading} className="" style={{"height": "100%"}}>
                <iframe className="map-iframe___vA_t0" src="http://map.baidu.com/"></iframe>
              </Spin>
            </div>
          </div>
        </PageMain>
      </section>
    )
  }
}
