import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm,Select,TreeSelect,Form   } from 'antd';
import {netdata} from './../../helper';
import { withRouter } from 'react-router'
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let gData = [];
let treeDic =[];
let oldData=[]
export default  class phonetable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      edit:true,
      data: [],
      value:{
          myll:[]
      },
      loading:false,
      Passworderror:""
    };
  }
  componentWillMount(){
    this.reloadphonelist();
  }
  setloading(){
    this.setState({ loading: false })
}
  reloadphonelist(){
    this.setState({loading:true})
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"getPhoneAuth"})
    }
    netdata('/PhoneAuthOpt.epy', r).then(this.onphonedata.bind(this));
  }
  onphonedata(res) {
    let Vdata=[];
    if(res.d.errCode == 0){
      let Vs = res.d.Values;
      for(let i=0;i<Vs.length;i++){
        Vs[i]['key']=Vs[i].id;
        Vs[i]['editable']=false;
        Vs[i]['isNew']=false;
        treeDic[Vs[i].RegionId] =Vs[i].RegionName;
        Vdata.push(Vs[i]);
      }
      this.setState({data:Vdata});
      setTimeout(this.setloading.bind(this),10);
      this.state.edit = true;
    }
    else{
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }
  componentDidMount () {
        let r = {
          method: "POST",
          body: JSON.stringify({"opt":"getTree"})
        }
        netdata('/topoly/regionTreeOpt.epy', r).then(this.ondata.bind(this))
  }
  ondata(res) {
    let sd = {loading: false}
    if (res.s === false) {
      Notification['error']({
        message: '数据请求错误',
        description: JSON.stringify(res.d),
      });
      this.setState(sd)
      return;
    }
    if(res.d.errCode == 0){
      gData = res.d.Values;
    }
    else{

    }
  }
  getRowByKey(key) {
    return this.state.data.filter(item => item.key === key)[0];
  }


  index = 0;
  cacheOriginData = {};
  handleSubmit = (e) => {
    e.preventDefault();
  }
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

    if(type=="edit"){

      if (this.state.edit) { 
    let that = this;
      let r = {
        method: "POST",
        body: JSON.stringify({"opt":"delPhoneAuth", "id":key})
      }
      netdata('/PhoneAuthOpt.epy', r).then(res=>{
            that.setState({ edit: true })
              const newData = that.state.data.filter(item => item.key !== key);
              that.setState({ data: newData });
              message.info('删除成功！');
      })
       }
      else{
        message.error('请完成当前编辑！')
      }
   
   
    }
    else{
      
             this.setState({ edit: true })
      const newData = this.state.data.filter(item => item.key !== key);
      this.setState({ data: newData }); 

 
    }

  }
  newMember = () => {
    if (this.state.edit) {
    this.setState({ edit: false })
    const newData = [...this.state.data];
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      UserName: '',
      PhoneNum: '',
      Password: '',
      Mode: '0',
      RegionId: '-1',
      editable: true,
      isNew: true,
      EBM_Lever:"6",
      Volume:"16"
    });
    this.index += 1;
    this.setState({ data: newData });
  }
  else{
    message.error('请完成当前编辑！')
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
      if(key.toString().indexOf("NEW")===0){
        target["isNew"] = true;
      }
       target[fieldName] = e.target.value;
       //console.log("newData2",newData)
       if(fieldName==="Password"){
          if(e.target.value.length===6){
            this.setState({Passworderror:"success"});
          }else{
            this.setState({Passworderror:"error"});
          }
       }
       if(fieldName==="UserName"){
        if(e.target.value.indexOf(" ") ==-1){ 
          //  target[fieldName] = e.target.value;
             this.setState({ data: newData });
          }
       }
       else{
               if(isFinite(e.target.value)&&e.target.value.indexOf(" ") ==-1){ 
      //  target[fieldName] = e.target.value;
         this.setState({ data: newData });
      }
       }

    }
  }
  handleFieldChangeSelect(e, fieldName, key) {
  const newData = [...this.state.data];
  const target = this.getRowByKey(key);
  if (target) {
    if(key.toString().indexOf("NEW")===0){
      target["isNew"] = true;
    }
    target[fieldName] = e;
    this.setState({ data: newData });
  }
}
  handleFieldChangeArea(e, fieldName, key) {
    // let txt='';
    // let vv = this.state.value;
    // vv[key]= e;
    // this.setState({ value:vv });
    // for(let i=0;i<e.length;i++){
    //     if(i==e.length-1){
    //         txt+=treeDic[e[i]]; 
    //     }
    //     else{
    //       txt+=treeDic[e[i]]+",";  
    //     }
        
    // }
    let str=''
    if(typeof(e)!=="undefined"){
      str=e.toString();
    }
    const newData = [...this.state.data];
    const target = this.getRowByKey(key);
    if (target) {
      if(key.toString().indexOf("NEW")===0){
        target["isNew"] = true;
      }
      target[fieldName] = str;
      this.setState({ data: newData });
    }
  }
  onChangeArea = (value) => {
    // const newData = [...this.state.data];
    // const target = this.getRowByKey(key);
    // if (target) {
    //   target[fieldName] = e;
    //   this.setState({ data: newData });
    // }
    this.setState({ value });
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
      if (!target.Password || !target.UserName || !target.PhoneNum||!target.RegionId||!target.Mode) {
        message.error('请填写完整信息。');
        return;
      }
      else if(target.Password.length!=6){
        message.error('请输入六位密码！');
        this.setState({Passworderror:"error"});
      }
      else{
        if(type=="new"){
          postbody =JSON.stringify({"opt":"mfyPhoneAuth", "id":target.id,"UserName":target.UserName,"PhoneNum":target.PhoneNum,"Password":target.Password,"Mode":target.Mode, "RegionId":target.RegionId,"EBM_Lever":target.EBM_Lever,"Volume":target.Volume})          
        }
        else{
          postbody =JSON.stringify({"opt":"newPhoneAuth","UserName":target.UserName,"PhoneNum":target.PhoneNum,"Password":target.Password,"Mode":target.Mode, "RegionId":target.RegionId,"EBM_Lever":target.EBM_Lever,"Volume":target.Volume})
        }
        let r = {
          method: "POST",
          body: postbody
        }
        netdata('/PhoneAuthOpt.epy', r).then(res => { that.setState({ edit: true }); 
      
      
        if(res.d.errCode == 0){
            that.toggleEditable(e, key); 
             that.setState({ edit: true }); 
            that.reloadphonelist(); 
        message.success('操作成功！');this.setState({ Passworderror: "" });}
        else{
          const target = this.getRowByKey(key);
          if(typeof(target.key)!=="number"){
            target.isNew=true;
          }
          this.setState({ data: [...this.state.data] });
          message.error(res.d.errCode);
        }
          })
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
    this.setState({ data: [...this.state.data] });
    this.setState({ edit: true })
    this.setState({Passworderror:""});
  }
  renderTreeNodes = (data) => {
    
        // if(data.length === 0)
        //   return <TreeNode title="路通应急广播管理系统"/>;
        return data.map((item) => {
          let haveregionchild = false
          item.children.map(item=>{
            if(item.eocT === 0){
              haveregionchild = true;
            }
          })
          if(haveregionchild){
            if(item.eocT != 1){
          if (item.children.length !== 0) {
            treeDic[item.id]=item.desc;
            return (
              <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          
          treeDic[item.id]=item.desc;
          return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
        }
      }
      else{
        if(item.eocT!=1){
           return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
        }
       
      }
        });
      }
  render() {
    const columns = [{
      title: '用户名',
      dataIndex: 'UserName',
      key: 'UserName',
      width: '120px',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'UserName', record.key)}
              placeholder="用户名"
            />
          );
        }
        return text;
      },
    }, {
      title: '电话号码',
      dataIndex: 'PhoneNum',
      key: 'PhoneNum',
      width: '120px',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
            maxLength="11"
              value={text}
              onChange={e => this.handleFieldChange(e, 'PhoneNum', record.key)}
              placeholder="电话号码"
            />
          );
        }
        return text;
      },
    }, {
      title: '密码',
      dataIndex: 'Password',
      key: 'Password',
      width: '120px',
      render: (text, record) => {
        if (record.editable) {
          return (
            <FormItem
            hasFeedback
            validateStatus={this.state.Passworderror}
          >
            <Input
             maxLength="6"
              value={text}
              onChange={e => this.handleFieldChange(e, 'Password', record.key)}
              placeholder="密码"
            />
            </FormItem>
          );
        }
        return text;
      },
    }, {
        title: '允许广播方式',
        dataIndex: 'Mode',
        key: 'Mode',
        width: '120px',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select defaultValue={text} style={{ width: '100%' }}
                onChange={e => this.handleFieldChangeSelect(e, 'Mode', record.key)}
              >
                <Option value="0">语音</Option>
                <Option value="1">短信</Option>
                <Option value="2">语音+短信</Option>
              </Select>
            );
          }
          else{
             switch(text){
              case "0":
                return "语音"
                break;
              case "1":
                return "短信"
                break;
              case "2":
                return "语音+短信"
                break;
            }
          }
        },
      },
      {
        title: '用户区域',
        dataIndex: 'RegionId',
        key: 'RegionId',
        width: '250px',
        render: (text, record) => {
          let dValue =[];
          dValue.push(parseInt(text));
          if (record.editable) {
            return (
                <TreeSelect
                  style={{ width: '100%' }}
                  defaultValue={dValue}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="选择区域"
                  treeDefaultExpandAll
                  onChange={e => this.handleFieldChangeArea(e, 'RegionId', record.key)}
                  showCheckedStrategy={SHOW_PARENT}
                >
              {this.renderTreeNodes(gData)}
              </TreeSelect>
            );
          }
          else{
               return treeDic[text];
          }
       
        },
      },
      {
        title: '音量',
        dataIndex: 'Volume',
        key: 'Volume',
        width: '150px',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select defaultValue={text} style={{ width: '100%' }}
              onChange={e => this.handleFieldChangeSelect(e, 'Volume', record.key)}
            >
              <Option value="0">0</Option>
              <Option value="8">8</Option>
              <Option value="16">16</Option>
              <Option value="24">24</Option>
              <Option value="32">32</Option>
            </Select>
            );
          }
          else{
               return text;
          }
       
        },
      },
      ,
      {
        title: '级别',
        dataIndex: 'EBM_Lever',
        key: 'EBM_Lever',
        width: '250px',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select defaultValue={text} style={{ width: '100%' }}
              onChange={e => this.handleFieldChangeSelect(e, 'EBM_Lever', record.key)}
            >
               <Option value="6">一般</Option>
                <Option value="7">较大</Option>
                <Option value="8">重大</Option>
                <Option value="9">特别重大</Option>
                <Option value="14">应急广播</Option>
            </Select>
            );
          }
          else{
           switch (text) {
             case "6":
             return "一般";
               break;
               case "7":
               return "较大";
                 break;
                 case "8":
                 return "重大";
                   break;
                   case "9":
                   return "特别重大";
                     break;
                     case "14":
                     return "应急广播";
                       break;
             default:
               break;
           }

          }
       
        },
      },
     {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: '100px',
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a style={{marginRight:'10px'}} onClick={e => this.saveRow(e, record.key,"edit")}>保存</a>
                {/* <Divider type="vertical" /> */}
                <a onClick={e => this.remove(record.key,"new")}>删除</a>
              </span>
            );
          }
          return (
            <span>
              <a style={{marginRight:'10px'}}  onClick={e => this.saveRow(e, record.key,'new')}>保存</a>
              {/* <Divider type="vertical" /> */}
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
          scroll={{ x: 1200}}
          rowClassName={(record) => {
            {/* return record.editable ? styles.editable : ''; */}
          }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增用户
        </Button>
        <style>{`
          #myoptable .ant-form-item{
            margin-bottom: 0;
          }
          
          `}</style>
      </div>
    );
  }
}
