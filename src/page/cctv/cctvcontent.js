import React from 'react';
import { Layout, Table, Button, Form, Input, Affix, Popover, Spin, Breadcrumb, Tabs, Icon, Select,Badge,Modal,Collapse ,message,Tag, Radio } from 'antd';
import { netdata } from './../../helper'
import createStore from '../createStore';
import { withRouter } from 'react-router'
import RegionTree from './regionTree'
import Videocontent from './videocontent'
const {  Content, Sider } = Layout;
const Panel = Collapse.Panel;
const deviceMana=  withRouter(class deviceMana extends React.Component {
    constructor(props) {
        super(props);
    this.store = createStore({
        deviceDATA:[],
        data:[],
        changeTag:false,
        devicesList:[]
      });
    }
    state = {
    }    
    componentWillMount(){
        this.store.subscribe(() => {
            const { regionname } = this.store.getState();
            
   });
    }
    componentDidMount() {

      
    }

    render() {
        let that= this;

         
        return (
            <Layout >
                {/* <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: '#fff', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: this.props.mleft}}> */}
                <Sider id="myregiontreediv" width={275} style={{ height: window.innerHeight - 64, background: 'rgb(47, 70, 89)', boxShadow: "1px 0px 6px #dcd0d0", overflow: 'auto', position: 'fixed', left: 0}}>
                    <RegionTree store={this.store} ref="mytree"/>
                </Sider>
                <Layout>
                    <Content>
                        <div id="affix" >
                            {/* <Affix offsetTop={64}>
                                <div className="table-operations">
                                    <span>
                                        <Breadcrumb style={{ fontSize: "14px" }}>
                                            <Breadcrumb.Item>{this.state.regionname}</Breadcrumb.Item>
                                        </Breadcrumb>
                                    </span>

                      
                                </div>
                            </Affix> */}
                        {/* {this.renderContent(this.state.switchmode)}*/}
                        <Videocontent store={this.store}/>
                        </div>
                    </Content>
                </Layout>
                
                <style>{`
                 .ant-tree-title {
                        font-size: 14px;
                    }
                    .ant-tree-node-selected .ant-tree-title, .ant-tree-node-selected:hover .ant-tree-title {
                        color: #fff;
                    }
                     .ant-tree-switcher,  .ant-tree-title {
                        color: #7ba0bb;
                    }
                    .ant-tree-node-selected, .ant-tree-node-selected:hover {
                    background-color: #1c2a36 !important;
                }
                .ant-tree-node-content-wrapper:hover {
                    background-color: #1c2a36 !important;
                }
                .ant-tree-node-content-wrapper:hover .ant-tree-title {
                        color: #fff;
                    }
                    `}</style>



               


            </Layout>

        );
    }
}
);
export default deviceMana;