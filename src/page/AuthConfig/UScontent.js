import React from 'react';
import { Table, Button, Form, Input, Affix,Spin,Alert } from 'antd';
import UsersTable from './UsersTable'
import { netdata } from './../../helper'
class UScontent extends React.Component {
    state = {
        loading1: true,
        data:[],
        pid:''
    }

    componentWillMount() {
        this.setState({ data:  this.props.datasource});
        this.setState({ pid:  this.props.pid});
    }

    ondata(res) {
        if (res.d.errCode == 0) {
            if(res.d.Values.length==0){
                this.setState({ data: []});
            }
            else{
                let data = res.d.Values.filter(item => item.id == this.state.pid);
                if(data.length>0)
                {
                   let tableData = data[0].children;
                    tableData.map(function (item) {
                        item.key=item.id;
                    })
                    this.setState({ data: tableData});
                    this.changeloading();
                }
                else
                {
                    this.setState({ data: []});
                }
            }
        }
        this.changeloading();
    }

    reloadData() {
        this.changeloading1();
        let r = {
            method: "POST",
            body: JSON.stringify({ "opt": "getRole" })
        }
        netdata('/RoleOpt.epy', r).then(this.ondata.bind(this))
    }

    switchData(key)
    {
        this.setState({ pid: key});
        this.reloadData();
    }

    setloading(){
        this.setState({ loading1: false })
    }
    changeloading() {
        setTimeout(this.setloading.bind(this),10);
    }
    changeloading1() {
        this.setState({ loading1: true })
    }
    adduser() {
        this.refs.changeuser.newMember();
    }
    render() {
        return (
            <div id="affix">
                <Affix offsetTop={166}>
                    <div className="table-operations">
                        <Button icon="plus" onClick={this.adduser.bind(this)}>添加</Button>
                        <Button loading={this.state.loading} icon="reload" onClick={this.reloadData.bind(this)}>刷新</Button>
                    </div>
                </Affix>
                <div id="myoptable" style={{ padding: "0 24px" }}>
                    <UsersTable loading={this.state.loading1} ref="changeuser" pid={this.state.pid} datasource={this.state.data} onreload={this.reloadData.bind(this)} />
                    <style>{
                        `
                    .mypopdiv{
                        height:100%;
                        width:200px;
                        word-wrap: break-word;
                    }
                    #myoptable .ant-table-tbody>tr>td, #myoptable .ant-table-thead>tr>th {
                        padding: 10px 8px;
                        word-break: break-all;
                    }
                    
                    `}
                    </style>
                </div>
            </div>
        );
    }
}

export default UScontent;