import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm,Select,TreeSelect,Modal  } from 'antd';
import {netdata} from './../../helper';
import { withRouter } from 'react-router'
const Option = Select.Option;
export default withRouter(  class QAMTable extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            edit:true,
            data: [],
            selectedRowKeys: [],
        };
    }

    remove(id) {
        let that = this;
        let r = {
            method: "POST",
            body: JSON.stringify({"opt":"delBroadcastChl", "id":id})
        }
        netdata('/BroadcastChlOpt.epy', r).then(res=>{
            if(res.d.errCode === "Cookie过期"){
                this.props.history.replace('/power')
              }
            const newData = that.props.tableData.filter(item => item.id !== id);
            this.props.handleData(newData);
            message.info("删除成功!");
        })
    }

    bacthDelete = () =>{
        var aa = this
        if(this.state.selectedRowKeys.length !== 0){
            let selectdev = "";
            let isFirst = true;
            this.state.selectedRowKeys.map((item)=>{
                if(isFirst){
                    selectdev += item;
                    isFirst = false;
                }
                else{
                    selectdev += "," + item;
                }
            })
            Modal.confirm({
                title: '删除设备',
                content: '确定要删除选中设备吗?',
                onOk(){
                    alert('删除项:'+selectdev);
                    //   let r = {
                    //   method: "POST",
                    //   body: JSON.stringify({"opt":"delDevice", "parentid":selectnode.props.dataRef['id'],"ids":selectdev})
                    //   }
                    // netdata('/topoly/regionTreeOpt.epy', r).then(aa.ondata.bind(aa))
                }
            })
        }
    }


    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    render() {
        const {selectedRowKeys}= this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        const columns = [
            {
                title: '编号',
                dataIndex: 'id',
                width:'40px',
                key: 'id',
                fixed: 'left',
                sorter: (a, b) =>a.id-b.id,
            },{
                title: '名称',
                dataIndex: 'Name',
                width:'150px',
                key: 'Name',
                fixed: 'left',
                render: (text, record) => {
                    return (
                        <span>
                         <a style={{marginRight:'10px'}}  onClick={() =>this.props.goSave(record.id)}>{text}</a>
                    </span>
                    );
                }
            },
            {
                title: '信号模式',
                dataIndex: 'SignalMode',
                key: 'SignalMode',
                render:(text)=>{
                    switch(text){
                        case "0":
                            return "C"
                            break;
                        case "1":
                            return "T"
                            break;
                        case "2":
                            return "S"
                            break;
                    }
                }
            },
            {
                title: 'QAM',
                dataIndex: 'QAM',
                key: 'QAM',
                render: (text) => {
                    switch(text){
                        case "0":
                            return "16"
                            break;
                        case "1":
                            return "32"
                            break;
                        case "2":
                            return "64"
                            break;
                        case "3":
                            return "128"
                            break;
                        case "4":
                            return "256"
                            break;
                    }
                },
            },
            {
                title: '调制频率',
                dataIndex: 'ModuleFreq',
                key: 'ModuleFreq',
            },
            {
                title: '描述',
                dataIndex: 'Description',
                key: 'Description',
            },
            {
                title: '操作',
                key: 'action',
                width: "40px",
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <span>
                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            }];

        return (
            <div>
                <Table
                    loading={this.props.loading}
                    bordered
                    pagination={{pageSize: 15}}
                    rowSelection={rowSelection}
                    columns={columns}
                    scroll={{ x: 1200 }}
                    size="middle"
                    dataSource={this.props.tableData}
                    rowClassName={(record) => {
                    }}
                />
            </div>
        );
    }
}
)