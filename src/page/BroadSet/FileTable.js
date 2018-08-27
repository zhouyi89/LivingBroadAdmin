import React, { PureComponent } from 'react';
import { Table, Upload,Icon, Input, message, Popconfirm,Select,TreeSelect   } from 'antd';
import {netdata} from './../../helper';
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Dragger = Upload.Dragger;
export default  class FileTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      edit:true,
      data: [],
      value:{
          myll:[]
      },
      loading:false
    };
  }
  componentWillMount(){
    this.reloadlist();
  }
  setloading(){
    this.setState({ loading: false })
}
  reloadlist(){
    this.setState({loading:true})
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"getMp3FileList"})
    }
    netdata('/MP3FileOpt.epy', r).then(this.onphonedata.bind(this));
  }
  onphonedata(res) {
    let Vdata=[];
    if(res.d.errCode == 0){
      let Vs = res.d.Values;
      for(let i=0;i<Vs.length;i++){
        Vs[i]['key']=Vs[i].id;
        Vs[i]['editable']=false;
        Vs[i]['isNew']=false;
        Vdata.push(Vs[i]);
      }
      Vdata.sort(function (a, b) { return b.key-a.key });
      this.setState({data:Vdata});
      this.state.edit = true;
    }
      setTimeout(this.setloading.bind(this),10);
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }
  componentDidMount () {
        // let r = {
        //   method: "POST",
        //   body: JSON.stringify({"opt":"getMp3FileList"})
        // }
        // netdata('/MP3FileOpt.epy', r).then(this.onphonedata.bind(this))
      this.reloadlist();
  }

  getRowByKey(key) {
    return this.state.data.filter(item => item.key === key)[0];
  }

  index = 0;
  cacheOriginData = {};
  toggleEditable(e, key) {
    e.preventDefault();
    if (this.state.edit) {
      this.setState({ edit: false });
      const target = this.getRowByKey(key);
        if (target) {
            // 进入编辑状态时保存原始数据
            if (!target.editable) {
                this.cacheOriginData[key] = { ...target };
            }
            target.editable = !target.editable;
            this.setState({ data: [...this.state.data] });
        }
    }
    else{
      message.error('请完成当前编辑！')
    }
  }
  remove(key,type) {
      if (type == "edit") {
          if (this.state.edit) {
              let that = this;
              let r = {
                  method: "POST",
                  body: JSON.stringify({"opt": "DelMp3File", "id": key})
              }
              netdata('/MP3FileOpt.epy', r).then(res => {
                  that.setState({edit: true})
                  const newData = that.state.data.filter(item => item.key !== key);
                  that.setState({data: newData});
                  message.info('删除成功！');
              })
          }
          else {
              message.error('请完成当前编辑！')
          }
      }
      else {

          this.setState({edit: true})
          const newData = this.state.data.filter(item => item.key !== key);
          this.setState({data: newData});
      }
  }
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = [...this.state.data];
    const target = this.getRowByKey(key);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key,type) {
    let postbody =""
    let that =this;
    e.persist();
    // save field when blur input
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' &&
          document.activeElement !== e.target) {
        return;
      }
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key);
      delete target.isNew;
      if (!target.Name) {
        message.error('请填写完整信息。');
        return;
      }
      else{
        postbody =JSON.stringify({"opt":"MfyMp3File","id":target.id,"Name":target.Name,"Remark":target.Remark})
        let r = {
          method: "POST",
          body: postbody
        }
        netdata('/MP3FileOpt.epy', r).then(res=>{that.setState({ edit: true }); that.toggleEditable(e, key);that.setState({ edit: true });that.reloadlist();message.success('操作成功！');})
      }
      
    }, 10);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const target = this.getRowByKey(key);
     if (this.cacheOriginData[key]) {
          Object.assign(target, this.cacheOriginData[key]);
          target.editable = false;
          delete this.cacheOriginData[key];
      }
    target.editable = false;
    this.setState({ data: [...this.state.data] });
    this.setState({ edit: true })
  }

  handleFileUpload(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            this.reloadlist();
        }
        if (status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
        } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
        }
    }

   beforeUpload(file) {
        const isMP3 = (file.type =='audio/mp3'||file.type =='audio/mpeg');
        console.log("type",isMP3);
        if (!isMP3) {
            message.error('你只能上传MP3文件!');
        }
        return isMP3;
    }

  render() {
    const columns = [{
      title: '文件名',
      dataIndex: 'Name',
      key: 'Name',
      width: '214px',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'Name', record.key)}
              placeholder="文件名"
            />
          );
        }
        return text;
      },
    },
     {
            title: '备注',
            dataIndex: 'Remark',
            key: 'Remark',
            width: '214px',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Input
                            value={text}
                            onChange={e => this.handleFieldChange(e, 'Remark', record.key)}
                            placeholder="备注"
                        />
                    );
                }
                return text;
            },
        },
     {
      title: '操作',
      key: 'action',
      width: '150px',
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a style={{marginRight:'10px'}} onClick={e => this.saveRow(e, record.key,"edit")}>保存</a>
                <a onClick={e => this.remove(record.key,"new")}>删除</a>
              </span>
            );
          }
          return (
            <span>
              <a style={{marginRight:'10px'}}  onClick={e => this.saveRow(e, record.key,'new')}>保存</a>
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a style={{marginRight:'10px'}} onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            {/* <Divider type="vertical" /> */}
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key,"edit")}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];

    return (
      <div>
        <Table
          loading={this.state.loading}
          bordered
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={(record) => {
          }}
        />
        <div className="upload-drag">
          <div className="upload-drag-container">
            <Dragger name={ 'file'} multiple={true} action={'/UploadFile.epy'} beforeUpload={f=>this.beforeUpload(f)} onChange =  {e => this.handleFileUpload(e)}>
              <p className="upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="upload-text">点击或者拖动文件到此区域用于上传文件。</p>
              <p className="upload-hint">支持单个或批量上传。严禁上传公司数据或其他重要文件。</p>
            </Dragger>
          </div>
        </div>
        <style>{`
                   .upload-drag {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        padding: 16px 0;
                        background: #fff;
                        vertical-align:middle;
                        text-align: center;
                    }
                    .upload-drag-container:hover {
                      border-color: #40a9ff;
                  }
                    .upload-drag-container{
                        display: inline-block;
                        vertical-align: middle;
                        border: 1px dashed #d9d9d9;
                        transition: border-color 0.3s;
                        cursor: pointer;
                        border-radius: 4px;
                        text-align: center;
                        width: 100%;
                        height: 100%;
                        background: #fafafa;
                        font-size: 48px;
                        color: #40a9ff;
                     }
                     .upload-drag-icon{
                         margin-bottom: 20px;
                         font-size: 48px;
                         color: #40a9ff;
                     }
                     .upload-text {
                        font-size: 16px;
                        margin: 0 0 4px;
                        color: rgba(0, 0, 0, 0.85);
                    }
                    .upload-hint {
                        font-size: 14px;
                        color: rgba(0, 0, 0, 0.45);
                    }
                    .upload {
                        font-size: 14px;
                        line-height: 1.5;
                        color: rgba(0, 0, 0, 0.65);
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                        list-style: none;
                        outline: 0;
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
