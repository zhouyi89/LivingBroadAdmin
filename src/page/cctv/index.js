import React from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router'
import { netdata } from './../../helper'
import Cctvcontent from './cctvcontent'
const { Content } = Layout;
const cctv = withRouter(class cctv extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 store
  }
  state = {
    collapsed: true,
    menukey:"1"
  };
  handleClick(item) {
    this.setState({ menukey: item["key"] });
  }
  componentDidMount() {

  }
  onCollapse = (collapsed) => {
    document.body.scrollTop=0;
    this.setState({ collapsed });
  }
  renderContent(key){
    let content ;
    switch(key) {
        case '1':
            content = (<Cctvcontent   mleft={this.state.collapsed?64:200}/>);
            break;
        case '2':
            content = (<div />);
            break;
        case '3':
            content = (<div>3</div>);
            break;
        case '4':
            content = (<div>shiaohda</div>);
            break;
    }
    return content;
  }
  render() {
    return (
      <section id="myebody" className="e-body" style={{ height: window.innerHeight,backgroundColor: "#f6f9fe" }}>
        <div className="my-content" >
          <Layout>
            {/* <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
              style={{ height: window.innerHeight - 64, background: "#001529 ", position: "fixed" }}
            >
              <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.handleClick.bind(this)}>
                <Menu.Item key="1">
                  <Icon type="desktop" />
                  <span>设备</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="area-chart" />
                  <span>统计</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="file" />
                  <span>事件</span>
                </Menu.Item>
                <Menu.Item key="4">
                  <Icon type="setting" />
                  <span>配置</span>
                </Menu.Item>
              </Menu>
            </Sider> */}
    
            {/* <Layout style={{ marginLeft: this.state.collapsed?64+275:200+275}}> */}
            <Layout style={{ marginLeft: 275}}>
              <Content style={{ background: '#fff', margin: 0, minHeight: 280 }}>
              {this.renderContent(this.state.menukey)}
              </Content>
            </Layout>
          </Layout>
          <style>{`
            .deviceshow{
              display:block;
            }
            .devicehide{
              display:none;
            }
          #myebody .ant-menu-item:hover{
            background-color: transparent; 
              }
          #myebody .ant-menu-dark{
            background: #001529;
          }
          #myebody .ant-layout-sider-trigger{
            background: #002140;
          }  
          #myebody .ant-layout{
            background: #fff;
          } 
          .table-operations {
            position: relative;
            background: #fff;
            height: 50px;
            border-bottom: 1px solid #d9d9d9;
            margin: 0 -24px;
            padding: 0 24px;
            margin-left: 2px;
                    }
            .table-operations > span:first-child {
            top: 11px;
            left: 24px;
            line-height: 28px;
        }
        .table-operations   > span:last-child {
                top: 11px;
                right: 42px;
            }
            .table-operations > span:last-child .ant-select-selection {
              color: #49a9ee;
              border-color: #49a9ee;
          }
        .table-operations   > span {
              position: absolute;

          }
        
          .cardSider {
            -webkit-box-flex: 0;
            -ms-flex: 0 0 50px;
            flex: 0 0 60px;
            margin-right: 16px;
        }

 .cardSider .deviceCode {
    display: block;
    width: 77px;
    height: 32px;
    line-height: 30px;
    margin-bottom: 8px;
    font-weight: bold;
    text-align: center;
    color: #000;
}  
.cardSider .deviceCode:hover {
  background: rgb(210, 234, 251);
} 


    .cardSider .deviceActive {
    background: #108ee9;
    border-color: #108ee9;
    color: #fff;
}
.cardContent .deviceWrap {
    overflow: hidden;
    border: 1px solid #f6f9fe;
    {/* padding: 19px 20px 6px 110px; */}
    position: relative;
    transition: all 0.5s ease 0s;
    margin-bottom: 13px;
}
.cardContent .deviceWrap:before{
    content: "";
    display: block;
    width: 50px;
    height: 5px;
    background: #f6f9fe;
    position: absolute;
    left: 40px;
    opacity: 1;
    transition: all 0.5s ease 0s;
}
.cardContent .deviceWrap:before{
  top: -3px;
}


.service-txt{
  /* display: inline-block; */
  position: absolute;
  top: 63px;
  left: 4px;
  font-size: 13px;
  width: 100px;
  text-align: center;
}


 .service-icon {
    display: inline-block;
    position: absolute;
    top: 9px;
    left: 31px;
    font-size: 41px;
    color: #41d7f7;
    opacity: 1;
}
.deviceItem:hover{
    background:#bcf9da
}
.cardContent .deviceWrap h3 {
    font-size: 14px;
    line-height: 2;
    color: #666666;
}
.onedeviceWrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-flex-wrap:wrap;
}
.devicenormal {
    background: #b5f5ec;
}
.deviceerror {
    background: #ffe58f;
}
.devicenull{
     background: #f5f4f0;
}
.deviceclose{
  background:#a7afae;
}
.deviceItem {
    display: block;
    -webkit-box-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 100px;
    flex: 0 0 159px;
    height: 75px;
    padding: 12px 0 0 14px;
    margin: 0 10px 14px 0;
    cursor: pointer;
    margin-bottom: 10px;
    background: #fff;
    overflow: hidden;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    box-sizing: border-box;
}
a {
    color: #108ee9;
    background: transparent;
    text-decoration: none;
    outline: none;
    cursor: pointer;
    transition: color .3s ease;
}
.cardContent {
    -webkit-box-flex: 1;
    -ms-flex: auto;
    flex: auto;
}
          #myregiontreediv::-webkit-scrollbar-track
          {
            border-radius: 2px;
          }

          #myregiontreediv::-webkit-scrollbar
          {
            width: 5px;
            height: 5px;
          }

          #myregiontreediv::-webkit-scrollbar-thumb
          {
            background: #d9dbdf;
            border-radius: 0;
          } 


          .roomContent ul {
                        overflow: hidden;
                        line-height: 28px;
                    }
                    .roomContent ul.roomContList li {
                        float: none;
                        width: 100%;
                    }
                    .roomContent ul li span {
                        color: #999;
                    }
                    .roomContent ul li {
                        float: left;
                        width: 50%;
                        height: 28px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
          #livecontent .ant-form-item {
 
            margin: 4px 0;
        }

        .cyan {
            color: #13c2c2;
            background: #e6fffb;
            border-color: #87e8de;
        }  
        .blue {
            color: #1890ff;
            background: #e6f7ff;
            border-color: #91d5ff;
        }     
        .green {
          color: #52c41a;
          background: #f6ffed;
          border-color: #b7eb8f;
         } 
         .lime {
    color: #a0d911;
    background: #fcffe6;
    border-color: #eaff8f;
}
.magenta {
    color: #eb2f96;
    background: #fff0f6;
    border-color: #ffadd2;
} 
              `}
          </style>
        </div>
      </section>

    )
  }

}
)
export default cctv;