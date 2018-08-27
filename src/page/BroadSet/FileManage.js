import React from 'react';
import { Button,Upload,Affix,Icon} from 'antd';
import FileTable from './FileTable'
class FileManage extends React.Component {
    state = {
    };
    componentDidMount(){

      }; 
      adduser() {
        this.refs.fileTable.newMember();
    }
    reload() {
        this.refs.fileTable.reloadlist();
    }
    render() {
        return (
            <div id="affix"> 
                <Affix offsetTop={64}>        
                  <div className={'table-operations'}>
                  <div style={{"float":'left',"marginRight":'10px'}}>
                     <Upload action={'/UploadFile.epy'} beforeUpload={f=>this.refs.fileTable.beforeUpload(f)} onChange =  {e => this.refs.fileTable.handleFileUpload(e)}>
                       <Button> <Icon type="upload" />上传</Button>
                     </Upload>
                  </div>
                   <div>
                     <Button icon="reload" onClick={this.reload.bind(this)}>刷新</Button>
                   </div>

                </div>
                </Affix>
            <div id="myoptable" style={{padding:"0 24px"}}>
                <FileTable ref="fileTable"/>
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

                <style>{`
                    .ant-upload .ant-upload-select .ant-upload-select-text
                    {
                    }
                    .ant-upload-list{
                         display:none;
                    }

                      `}
                </style>
            </div>
        );
    }
}

export default FileManage;