import React from 'react';
import { Table, Button,Form ,Input,Affix} from 'antd';
import Phonetable from './phonetable'
class phoneManageTable extends React.Component {
    state = {
    };
    componentDidMount(){

    
      }; 
      adduser() {
        this.refs.PhoneFunc.newMember();
    }
    reload() {
        this.refs.PhoneFunc.reloadphonelist();
    }
    render() {
        return (
            <div id="affix"> 
                <Affix offsetTop={64}>        
                  <div className="table-operations">
                  <Button icon="plus" onClick={this.adduser.bind(this)}>添加</Button>
                  {/* <Button icon="save">保存</Button> */}
                  <Button icon="reload" onClick={this.reload.bind(this)}>刷新</Button>
                </div>
                </Affix>
            <div id="myoptable" style={{padding:"0 24px"}}>
                
                <Phonetable ref="PhoneFunc"/>
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

export default phoneManageTable;