import React from 'react';
import { Table, Form,Affix } from 'antd';
import { withRouter } from 'react-router'
import Opform from "./opform";
const MyOpform = Form.create()(Opform);
const opTable =withRouter(
class opTable extends React.Component {
         state = {
             sourcedata: [],
             loading: false
         };

         loadingtrue() {
             this.setState({loading: true})
         }

         loadingfalse() {
             this.setState({loading: false})
         }

         componentDidMount() {
             var that = this;
             this.props.store.subscribe(() => {
                 const {opTableDataSource} = this.props.store.getState();
                 that.setState({loading: true})
                 that.setState({sourcedata: opTableDataSource});
                 setTimeout(that.loadingfalse.bind(that), 10);
             });
         };

         render() {
             const {sourcedata} = this.state;
             const columns = [{
                 title: '记录时间',
                 dataIndex: 'opTime',
                 key: 'opTime',
             }, {
                 title: '操作员',
                 dataIndex: 'operator',
                 key: 'operator',
             }, {
                 title: '操作',
                 dataIndex: 'operate',
                 key: 'operate',
             },
                 {
                     title: '操作内容',
                     dataIndex: 'Details',
                     key: 'Details',
                 }];
             return (
                 <div id="affix">
                     <Affix offsetTop={64}>
                         <div className="table-operations">
                             <MyOpform store={this.props.store} loadingtrue={this.loadingtrue} loadingfalse={this.loadingfalse}/>
                         </div>
                     </Affix>
                     <div id="myoptable" style={{padding: "0 24px"}}>
                         <Table loading={this.state.loading} pagination={{pageSize: 20, showSizeChanger: true, showQuickJumper: true}} dataSource={sourcedata}
                                columns={columns} bordered/>

                         <style>{
                             `
    .mypopdiv{
        height:100%;
        width:200px;
        word-wrap: break-word;
    }
    .table-operations {
        padding: 8px 24px;
        margin-left: 2px;
    }
    .ant-affix .table-operations {
        padding: 8px 24px;
        background: #fff;
        border-bottom: 1px solid #ececec;
        box-shadow: 0 2px 6px rgba(100, 100, 100, 0.1);
        margin-left: 2px;
    }
    .table-operations > button {
    margin-right: 8px;
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
)
export default opTable;