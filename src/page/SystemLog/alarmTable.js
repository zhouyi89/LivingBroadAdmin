import React from 'react';
import { Table, Form,Affix,Tag } from 'antd';
import { withRouter } from 'react-router'
import Alarmform from "./alarmform";
const MyAlarmform = Form.create()(Alarmform);
const alarmTable =withRouter(
class alarmTable extends React.Component {
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
                 const {AlarmTabledatasource} = this.props.store.getState();
                 that.setState({loading: true})
                 that.setState({sourcedata: AlarmTabledatasource});
                 setTimeout(that.loadingfalse.bind(that), 10);
             });
         };
         render() {
             const {sourcedata} = this.state;
             const columns = [{
                 title: '设备名称',
                 dataIndex: 'name',
                 key: 'name',
             }, {
                 title: '设备类型',
                 dataIndex: 'devicetype',
                 key: 'devicetype',
                 render: (text, record) => 
                 {  switch (text) {
                     case 1:
                       return <Tag className="cyan">音柱</Tag>;
                       break;
                     case 2:
                       return <Tag className="blue">多路语音合成器</Tag>;
                       break ;
                     case 3:
                       return <Tag className="magenta">电话短信网关</Tag>;
                       break ;
                     case 4:
                       return <Tag className="lime">数字编码控制器</Tag>;
                       break ;
                     case 5:
                       return <Tag className="green">播出控制器</Tag>;
                       break ;
                     default:
                       break;
                   }
                 
                 } 
             }, {
                 title: '逻辑地址',
                 dataIndex: 'logic',
                 key: 'logic',
             },
                 {
                     title: '告警类型',
                     dataIndex: 'alarmtype',
                     key: 'alarmtype',
                     render: (text, record) => 
                     {  switch (text) {
                         case 2:
                           return <Tag className="red-alarm">设备离线</Tag>;
                           break;
                         case 1:
                           return <Tag className="green-alarm ">设备上线</Tag>;
                           break ;
                         default:
                           break;
                       }
                     
                     } 
                 },
                 {
                     title: '告警时间',
                     dataIndex: 'time',
                     key: 'time',
                 }];
             return (
                 <div id="affix">
                     <Affix offsetTop={64}>
                         <div className="table-operations">
                             <MyAlarmform  store={this.props.store} loadingtrue={this.loadingtrue} loadingfalse={this.loadingfalse}/>
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
.red-alarm {
    color: #ffa39e;
    background: transparent;
    border-color: #ffa39e;
}
.green-alarm{
    color: #b7eb8f;
    background: transparent;
    border-color: #b7eb8f;
}
    `}
                         </style>
                     </div>
                 </div>
             );
         }
     }
)
export default alarmTable;