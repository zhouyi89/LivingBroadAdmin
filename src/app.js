//'use strict';

import React from 'react'
//import { render } from 'react-dom'
//import { browserHistory, Router, Route, Redirect } from 'react-router'
//hashHistory, Link, , IndexRoute
import { Provider, connect } from 'react-redux';
import {  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
 // Match,Link
} from 'react-router-dom'



import store from './appredux/store'
import MainFrame from './components/mainframe.jsx'
import AppData from './components/appdata.jsx'

// import onulist from './page/onulist'
// import funcfg from './tr069/funcfg'
// import devmodel from './tr069/devmodel'
// //import PageMap from './page/pagemap.jsx'
// import Page404 from './page/page404.jsx'
// import PageChart from './page/pagecharts.jsx'
// import svgpage from './page/svgexplorer'
// import FlowPage from './page/mainflow'
import power from './page/pagepower.jsx'
import LiveBroad from './page/LiveBroad'
import SystemLog from './page/SystemLog'
import AuthConfig from './page/AuthConfig'
import BroadSet from './page/BroadSet'
// import Tree from './page/Tree'
import TimingBroad from './page/TimingBroad'

import DisplayBoard from './page/DisplayBoard'
import pageLogin from './page/login'
// import pagemap from './page/map'

import dalogin from './data/dalogin'

import changeMenu from './appredux/actions/menuAction'
import tree from './page/Tree'

import NetworkMana from './page/networkMana'
import AppsMana from './page/appsMana'
import onlineHisMana from './page/onlineHisMana'


import cctv from './page/cctv'
/*
const approuter = () => {
  return (
    <Router history={browserHistory}>
      <Redirect from="/" to="/index" />
      <Route path="/power" component={power} />
      <Route path="/login" component={pageLogin} />
      <Route path="/" component={MainFrame} onEnter={onEnterAppRouter}>
        <Route path="index" component={pagemap} onEnter={SetActiveMenu({k:'1', url:"/index", n:'地图'})}/>
        <Route path="onulist" component={onulist}  onEnter={SetActiveMenu({k:'2', url:"/onulist", n:'onu检索'})}/>
        <Route path="chart" component={PageChart}  onEnter={SetActiveMenu({k:'3', url:"/chart", n:'主页2'})}/>
        <Route path="chart2" component={svgpage}  onEnter={SetActiveMenu({k:'6', url:"/chart2", n:'主页3'})}/>
      </Route>
      <Route path="/*" component={Page404} />
    </Router>
  )
}
*/

/*
          <MainFrame>
            <Switch>
              <Route path="/index" component={pagemap} onEnter={SetActiveMenu({k:'1', url:"/index", n:'地图'})}/>
              <Route path="/onulist" component={onulist}  onEnter={SetActiveMenu({k:'2', url:"/onulist", n:'onu检索'})} />
              <Route path="/chart" component={PageChart}  onEnter={SetActiveMenu({k:'3', url:"/chart", n:'主页2'})} />
              <Route path="/chart2" component={svgpage}  onEnter={SetActiveMenu({k:'6', url:"/chart2", n:'主页3'})} />
              <Route component={Page404} />
            </Switch>
          </MainFrame>*/
let rt = {}
const mapStateToProps = state => {
  //console.log(state)
  return rt
}
function withRouteOnEnter(WrappedComponent, cc) {
  return class extends React.Component {
    /*constructor ( props ) {
      super( props );
      cc();
    }*/
    componentDidMount() {
      cc();
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
function isAuthenticated() {
  return dalogin.getchecked()
}

class MatchWhenAuthorized  extends React.Component {
  constructor ( props ) {
    super( props );
    this.menu.bind(this)
  }
  menu(ctx) {
    let cc = this.props.changeMenu
    return (n, r) => {
      document.body.scrollTop = 0;
      AppData.SetKV("menu", ctx.k);
      AppData.SetHisUrl(ctx.k, ctx);
      cc("change", ctx.k);
    }
  }
  componentDidMount(){
    localStorage.checkedKeysIndex =''
    localStorage.expandedKeysIndex =''
    localStorage.collapsedIndex='false'
    localStorage.menukeyBroadSet='1'
    localStorage.selectedKeysSet=''
    localStorage.expandedKeysSet=''
  }
  render() {
    return (
      <Route render={renderProps => (
        isAuthenticated()? (
          <MainFrame>
            <Switch>
              <Route path="/tree" component={withRouteOnEnter(tree, this.menu({k:'7', url:"/tree", n:'系统设置'}))} />
              {/* <Route path="/index" component={withRouteOnEnter(pagemap, this.menu({k:'1', url:"/index", n:'地图'}))}/> */}
              {/* <Route path="/onulist" component={withRouteOnEnter(onulist,  this.menu({k:'2', url:"/onulist", n:'onu检索'}))} /> */}
              <Route path="/BroadSet" component={withRouteOnEnter(BroadSet,  this.menu({k:'3', url:"/BroadSet", n:'广播设置'}))} />
              {/* <Route path="/chart" component={withRouteOnEnter(PageChart, this.menu({k:'3', url:"/chart", n:'主页2'}))} />
              <Route path="/chart2" component={withRouteOnEnter(svgpage, this.menu({k:'6', url:"/chart2", n:'主页3'}))} /> */}
              {/* <Route path="/flow" component={withRouteOnEnter(FlowPage, this.menu({k:'3', url:"/chart2", n:'流程图'}))} /> */}
              <Route path="/AuthConfig" component={withRouteOnEnter(AuthConfig, this.menu({k:'4', url:"/AuthConfig", n:'权限配置'}))} />
              {/* <Route path="/funcfg" component={withRouteOnEnter(funcfg, this.menu({k:'5', url:"/funcfg", n:'业务模板'}))} />
              <Route path="/devmodel" component={withRouteOnEnter(devmodel, this.menu({k:'5', url:"/devmodel", n:'业务模型'}))} /> */}
              <Route path="/SystemLog" component={withRouteOnEnter(SystemLog, this.menu({k:'5', url:"/SystemLog", n:'系统日志'}))} />
              <Route path="/TimingBroad" component={withRouteOnEnter(TimingBroad, this.menu({k:'2', url:"/TimingBroad", n:'定时广播'}))} />
              <Route path="/NetworkMana" component={withRouteOnEnter(NetworkMana, this.menu({k:'7', url:"/NetworkMana", n:'网管系统'}))} />
              <Route path="/DisplayBoard" component={withRouteOnEnter(DisplayBoard, this.menu({k:'7', url:"/DisplayBoard", n:'综合看板'}))} />
              <Route path="/AppsMana" component={withRouteOnEnter(AppsMana, this.menu({k:'7', url:"/AppsMana", n:'网管系统'}))} />
              <Route path="/onlineHisMana" component={withRouteOnEnter(onlineHisMana, this.menu({k:'7', url:"/onlineHisMana", n:'网管系统'}))} />
              <Route path="/cctv" component={withRouteOnEnter(cctv, this.menu({k:'10', url:"/cctv", n:'监控管理'}))} />

              <Route path="/" component={withRouteOnEnter(LiveBroad, this.menu({k:'1', url:"/", n:'实时广播'}))} />
              {/* <Route component={withRouteOnEnter(LiveBroad, this.menu({k:'1', url:"/LiveBroad", n:'实时广播'}))}  /> */}
            </Switch>
          </MainFrame>
        ) : (
          <Redirect to={ {
            pathname: '/power',
            state: {from: renderProps.location}
          } } />
        )
      )}/>
    )
  }
}
const M = connect(mapStateToProps, {changeMenu})(MatchWhenAuthorized);

class App  extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/power" component={power} />
            <Route path="/login" component={pageLogin} />
            <M path="/" />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;
