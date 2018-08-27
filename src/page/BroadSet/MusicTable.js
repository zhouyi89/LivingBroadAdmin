import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm,Select,TreeSelect,Modal  } from 'antd';
import {netdata} from './../../helper';
import { withRouter } from 'react-router'
const Option = Select.Option;
export default withRouter(  class MusicTable extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            edit:true,
            data: [],
            selectedRowKeys: [],
        };
    }


    render() {
        const {selectedRowKeys}= this.state;
        const columns = [
            // {
            //     title: 'id编号',
            //     dataIndex: 'id',
            //     key: 'id',
            //     width:'20px',
            //     sorter: (a, b) =>a.id-b.id,
            // },
            {
                title: '序号',
                dataIndex: 'idx',
                key: 'idx',
                width:'20px',
                render: (text, record,index) => {
                    return index+1;
                }
            },
            {
                title: '名称',
                dataIndex: 'Name',
                key: 'Name',
                width: "140px",
                render: (text, record) => {
                    return (
                        <span>
                         <a style={{marginRight:'10px'}}  onClick={() =>this.props.goSave(record)}>{text}</a>
                    </span>
                    );
                }
            },
            {
                title: '描述',
                dataIndex: 'Desc',
                key: 'Desc',
                width: "70px",
            },
            {
                title: '歌单列表',
                dataIndex: 'FileList',
                key: 'FileList',
                render: (text, record) => {
                    let data =this.props.musicdata;
                    let list =text.split(',');
                    let outstr="";
                    console.log(list)
                
                        for(let j=0;j<list.length;j++){ 
                          for(let i=0;i<data.length;i++){
                            if(list[j]==data[i].key){
                                if(j===(list.length-1)){
                                 outstr+=data[i].title;
                                }else{
                                    outstr+=data[i].title+"," 
                                }
                            }
                        }
                    }
                    
                    return (
                        
                        <span>
                         {outstr}
                    </span>
                    );
                }
            },
            {
                title: '操作',
                key: 'action',
                width: "80px",
                render: (text, record) => {
                    return (
                        <span>
                            <a style={{marginRight:'10px'}}  onClick={() =>this.props.goSave(record)}>编辑</a>

                            <Popconfirm title="是否要删除此行？" onConfirm={() => this.props.remove(record)}>
                                <a>删除</a>
                            </Popconfirm>
                        </span>
                    );
                },
            }];

        return (
            <div>
                <Table
                    bordered
                    pagination={{pageSize: 15}}
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