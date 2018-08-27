//'use strict';

import React from 'react'
import PageHeader from '../../components/pageheader.jsx'
import PageMain from '../../components/pagemain.jsx'
import AffixFix from '../../components/Affix.jsx'

//antd
import Table from 'antd/lib/table'
import Icon from 'antd/lib/icon'
//import Switch from 'antd/lib/switch'
//import Radio from 'antd/lib/radio'
import Form from 'antd/lib/form'
import Button from 'antd/lib/button'
import Input from 'antd/lib/input'
import Notification from 'antd/lib/notification'
import Desc from './desc'

import {netdata} from './../../helper'
import _ from 'underscore'

const FormItem = Form.Item;

const columns = [{
    title: 'SN',
    dataIndex: '0',
    width: 150,
  }, {
    title: '厂家',
    dataIndex: '1',
    width: 70,
  }, {
    title: '类型',
    dataIndex: '2',
  }, {
    title: '时间',
    dataIndex: '7',
    //key: 'address',
  }, {
    title: 'OUI',
    dataIndex: '4',
    //key: 'address',
  }, {
    title: '软件版本',
    dataIndex: '5',
    //key: 'address',
  }, {
    title: '硬件版本',
    dataIndex: '6',
    //key: 'address',
  },{
    title: '服务器',
    dataIndex: '8',
    //key: 'action',
    //width: 360,
    /*
    render: (text, record) => (
      <span>
        <a href="#this">Action 一 {record.name}</a>
        <span className="ant-divider" />
        <a href="#this">Delete</a>
        <span className="ant-divider" />
        <a href="#this" className="ant-dropdown-link">
          More actions <Icon type="down" />
        </a>
      </span>
    ),*/
  }
];
/*
let data = [["test5984","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:25",2],["test5983","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:24",2],["test5982","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:24",2],["test5981","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:22",2],["test5980","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:22",2],["test5979","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:20",2],["test5978","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:20",2],["test5977","lootom","GDONU100-4FW",null,"000032","V2.0.0.20160919","HardWare Ver. 0004","2016-11-03 16:53:19",2]].ToObjArray();
*/
let data = []
let serachTxt = ""

const expandedRowRender = record => <Desc v={record} />;
let havedata = false;
class TT extends React.Component {
  constructor(props) {
    super(props);
    this.data = []
    this.loading = false;
  }
  shouldComponentUpdate(nextProps) {
    console.log(this.data === nextProps.dataSource)
    console.log(this.loading === nextProps.loading)
    return this.data !== nextProps.dataSource || this.loading !== nextProps.loading
  }
  render() {
    console.log("RTTTT")
    this.data = this.props.dataSource
    this.loading = this.props.loading
    return (<Table {...this.props} />)
  }
}

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      expandedRowRender,
      rowSelection: {},
      data:data,
      value: serachTxt,
    }
  }
  handleChange(event) {
    serachTxt = event.target.value;
    //this.setState({value: serachTxt});
  }
  componentDidMount () {
    if (havedata) {
      return;
    }
    havedata = true;
    _.delay(this.update.bind(this), 10)
  }
  update() {
    this.setState({loading: true})
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"all","search":serachTxt,"max":60})
    }
    netdata('/rest/cpeopt.epy', r).then(this.ondata.bind(this))
  }
  ondata(res) {
    let sd = {loading: false}
    if (res.s === false) {
      console.log(res.d)
      Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d),
      });
      this.setState(sd)
      return;
    }
    data = res.d.d.ToObjArray()
    sd.data = data;
    this.setState(sd)
  }
  render() {
    //const state = this.state;
    let data = this.state.data
    return (
      <section className="e-body">
        <PageHeader>ONU 检索</PageHeader>
        <PageMain>
          <div className="cf">
            <AffixFix offsetTop={64} className="e-content-affix" style={{"height": "44px"}}>
              <div className="barpanel-toptoolbar">
                <Form layout={'inline'}>
                  <FormItem>
                    <Button type="dashed" shape="circle" icon="search" size='default'
                      loading={this.state.loading} onClick={this.update.bind(this)}></Button>
                  </FormItem>
                  <FormItem>
                    <Input.Search
                      onChange={this.handleChange.bind(this)}
                      defaultValue={serachTxt}
                      size='default' placeholder="ONU 序列号"
                      style={{ width: 200}}
                      onSearch={value => this.update()}
                    />
                  </FormItem>

                  <FormItem><Button size='default'><Icon type="poweroff" />重启</Button></FormItem>
                  <FormItem><Button size='default'><Icon type="download" />升级固件</Button></FormItem>
                </Form>
              </div>
            </AffixFix>
            <div className="barpanel-content cf">
              <div className=" clearfix">
                <div className="" style={{"minHeight":"300px"}}>
                  <TT
                    pagination={false} bordered
                    size={'middle'} {...this.state}
                    columns={columns} rowKey={'0'} dataSource={data} loading={this.state.loading} />
                </div>
              </div>
            </div>
          </div>
        </PageMain>
      </section>
    )
  }
}