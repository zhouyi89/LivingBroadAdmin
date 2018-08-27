import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import createStore from '../createStore';
import { withRouter } from 'react-router'
import { netdata } from './../../helper'
import PhoneManageTable from './phoneManageTable'
import RadioProgramManageTable from  './RadioProgramManageTable'
// import QAMManage from './QAMManage'
import FileManage from './FileManage'
import MusicList from './MusicList'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Sider } = Layout;
const BroadSet=  withRouter(class BroadSet extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 store
    this.store = createStore({
      });
  }
  state = {
    menukey:'1'
  };
  renderContent(key){
    let content ;
    switch(key) {
        case '1':
            content = (<PhoneManageTable/>);
            break;
        case '2':
            content = (<div/>);
            break;
        case '3':
            content = (<RadioProgramManageTable/>);
            break;
        case '4':
            // content = (<QAMManage/>);
            break;
        case '5':
            content = (<FileManage/>);
            break;
        case '6':
            content = (<MusicList/>);
            break;
    }
    return content;
  }
  handleClick(item){
    this.setState({menukey:item["key"]});
    localStorage.menukeyBroadSet=item["key"];
  }
  componentWillMount(){
    let key = localStorage.menukeyBroadSet;
      this.setState({menukey:key})  
  }; 
  render() {
    return (
      <section id="myebody" className="e-body" style={{ height: window.innerHeight }}>
        <div className="my-content">
        <Layout>
      <Sider width={200}  style={{height:window.innerHeight-64, background: '#fff',boxShadow: "1px 0px 6px #dcd0d0" , overflow: 'auto', height: '100vh', position: 'fixed', left: 0,zIndex:200}}>
      <Menu
      onClick={this.handleClick.bind(this)}
      style={{ height: '100%', borderRight: 0}}
      defaultSelectedKeys={[this.state.menukey]}
      mode="inline"
      theme="dark"
    >
        <MenuItemGroup key="g1" title="广播管理" >
          <Menu.Item key="1"  style={{fontSize:"14px" }} ><Icon type="appstore" />电话短信管理</Menu.Item>
          {/* <Menu.Item key="2"  style={{fontSize:"14px" }}>广播参数配置</Menu.Item> */}
          <Menu.Item key="3"  style={{fontSize:"14px" }}><Icon type="setting" />广播节目管理</Menu.Item>
          {/* <Menu.Item key="4"  style={{fontSize:"14px" }}>QAM管理</Menu.Item> */}
          <Menu.Item key="5"  style={{fontSize:"14px" }}><Icon type="customer-service" />MP3文件管理</Menu.Item>
          <Menu.Item key="6"  style={{fontSize:"14px" }}><Icon type="book" />播放歌单管理</Menu.Item>
        </MenuItemGroup>
    </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ background: '#fff', margin: 0, minHeight: 280}}>
         {this.renderContent(this.state.menukey)}

        </Content>
      </Layout>
    </Layout>    
    
      <style>{`
      .ant-menu-dark{
          background: rgb(48, 69, 88);
        }
  `}
          </style>
        </div>      
      </section>

    )
  }

}
)

export default BroadSet;