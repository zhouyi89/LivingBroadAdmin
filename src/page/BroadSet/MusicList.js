import React from 'react';
import {Row,Col, Button,Transfer,Icon,message,Affix,Form,Input,notification} from 'antd';
import { withRouter } from 'react-router'
import {netdata} from './../../helper';

import MusicTable from './MusicTable';
import MusicSort from './MusicSort'
const FormItem = Form.Item;


const MusicList= withRouter(  class MusicList extends React.Component {

        constructor(props) {
                super(props);

                this.state = {
                        musiclist:[],
                        listname:"",
                        listdesc:"",
                        targetKeys: [],
                        musics:[],
                        id:"",
                        showright:false,
                        newtag:false
                };
        }
        
        componentWillMount () {
                 this.reload();
                this.reloadmusic();
        }
        componentDidMount () {
               
          }
          reloadmusic(){
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
                    Vdata.push({
                        key: Vs[i].id,
                        title: Vs[i].Name,
                        Remark:Vs[i].Remark
                      });

                  }
                  this.setState({musics:Vdata});
                }
              }
          reload(){
                         let r = {
                  method: "POST",
                  body: JSON.stringify({"opt":"getFileListTable"})
                }
                netdata('/FileListOpt.epy', r).then(this.ondata.bind(this))       
          }

          ondata(res) {
            if (res.s === false) {
                notification['error']({
                message: '数据请求错误',
                description: JSON.stringify(res.d),
              });
              return;
            }
            if(res.d.errCode == 0){
              this.setState({musiclist:res.d.Values})
            }
            else{
        
            }
          }
        addlist(){
                // let name =this.state.listname;
                
                // if(name==""){
                //         message.error('请输入歌单名！');
                        
                //         return ;
                // }
                this.setState({newtag:true,showright:true,listname:"",listdesc:"",targetKeys: []});
                // let name ="新建歌单";
                // let r = {
                //         method: "POST",
                //         body: JSON.stringify({"opt":"NewFileList","Name":name,"Desc":"","FileList":""})
                //       }
                //       netdata('/FileListOpt.epy', r).then(this.ondatanew.bind(this))
        }
        ondatanew(res) {
                if (res.s === false) {
                        notification['error']({
                    message: '数据请求错误',
                    description: JSON.stringify(res.d),
                  });
                  return;
                }
                if(res.d.errCode == 0){
                        this.reload();
                        this.setState({showright:false})
                }
                else{
            
                }
              }
        deletelist(item,e){
                let r = {
                        method: "POST",
                        body: JSON.stringify({"opt":"DelFileList","id":item.id})
                      }
                      netdata('/FileListOpt.epy', r).then(this.ondatadel.bind(this))
        }
        ondatadel(res) {
                if (res.s === false) {
                        notification['error']({
                    message: '数据请求错误',
                    description: JSON.stringify(res.d),
                  });
                  return;
                }
                if(res.d.errCode == 0){
                        this.reload();
                        this.setState({showright:false})
                        // this.setState({musiclist:musiclist})
                }
                else{
            
                }
              }
        licheck(item,e){
                 let data =this.state.musiclist;
                 let musics =this.state.musics;
                 let mytargetdata=[]
                for(let i=0;i<data.length;i++){
                        if(data[i].id==item.id){
                                let FileList=data[i].FileList.split(",");
                                for(let i=0;i<FileList.length;i++){
                                        for(let j =0;j<musics.length;j++){
                                                 if(FileList[i]==musics[j].key){
                                                        mytargetdata.push(musics[j]);  
                                                 }
                                        }

                                }
                        }

                }
                 this.setState({newtag:false,targetKeys:mytargetdata,id:item.id,showright:true,listname:item.Name,listdesc:item.Desc})
                
              }


        rendermusiclist(list,e){
                let that =this;
                var wrap = list.map(function (item) {
                        
                        return (<li class="licheck" onClick={that.licheck.bind(that,item)}>
                        {item.Name}
                        <div className="buttons">
                          <button className="deleteButton" ><Icon type="delete" onClick={that.deletelist.bind(that,item)}/></button>
                        </div>
                      </li>);
                }); 
                return wrap;
        }
        inputchange(value){
                this.setState({listname:value.target.value})
        }
        descchange(value){
                this.setState({listdesc:value.target.value}) 
        }
        handleChange = (targetKeys, direction, moveKeys) => {
                this.setState({ targetKeys });
        }

        saveData(){

                let data =this.state.musiclist;
                let id =this.state.id;
                let Name =this.state.listname;
                let Desc =this.state.listdesc;

                if(Name===""){
                        notification['error']({
                                message: '请输入节目单名称！',
                              });
                        return;
                }

                // let targetKeys =this.state.targetKeys;
                let targetKeys =this.refs.MusicSort.getupdateList();
                let POST=[]
                for(let i=0;i<data.length;i++){
                        if(data[i].id==id){
                                POST=data[i];
                        }

                }
                let file="";
                for(let i=0;i<targetKeys.length;i++){
           
                         
                        if(i===targetKeys.length-1){
                                file+=targetKeys[i].id     
                        }else{
                            file+=targetKeys[i].id+',';    
                        }  
                        


                }
                console.log(file,"file")
       
                
                if(this.state.newtag){
                let r1 = {
                        method: "POST",
                        body:  JSON.stringify({"opt":"NewFileList","Name":Name,"Desc":Desc,"FileList":file})
                      }
                      netdata('/FileListOpt.epy', r1).then(this.ondatanew.bind(this))
                }else{
               POST["opt"]="MfyFileList"       
                 POST.FileList=file;
                POST.Name =Name;
                POST.Desc =Desc;
                let r = {
                        method: "POST",
                        body: JSON.stringify(POST)
                      }
                      netdata('/FileListOpt.epy', r).then(this.ondatasave.bind(this))        
                }

              }
              ondatasave(res) {
                if (res.s === false) {
                  Notification['error']({
                    message: '数据请求错误',
                    description: JSON.stringify(res.d),
                  });
                  return;
                }
                if(res.d.errCode == 0){
                        // this.reload();\
                        message.success('保存成功！！');
                        this.setState({showright:false})
                }
                else{
            
                }
              }
              goBack(){
                      this.setState({showright:false})
              }
        render() {
   
                return(
                    <div>    
                        <Affix offsetTop={64}>
{  !this.state.showright? <div className="table-operations" id='myoptable-header'>
                                <Button icon="plus" onClick={this.addlist.bind(this)}>添加</Button>
                                <Button icon="reload" onClick={this.reload.bind(this)}>刷新</Button>
                                {/* <Button icon="close-circle-o" onClick={this.deleteBatch.bind(this)}>批量删除</Button> */}
                        </div>:
                        <div className="table-operations" id='detail-header' >
                                <div>    
                                        <Col span={6}>     
                                                       <FormItem  label={'名称'}>

                                        <Input value={this.state.listname} onChange={this.inputchange.bind(this)}/>
                                        </FormItem> 
                                        </Col>
                                        <Col span={6}> 
                                        <FormItem  label={'描述'}>

                                        <Input value={this.state.listdesc} onChange={this.descchange.bind(this)}/>
                                        </FormItem> 
                                        </Col>
                                        </div> 
                                        <div style={{float: "right"}}>   
                                <Button icon="rollback" style={{marginLeft:"20px",marginRight:"10px",    height:" 32px"}} onClick={this.goBack.bind(this)}>返回</Button>
                                <Button icon="save" style={{height:" 32px"}} onClick={this.saveData.bind(this)}>保存后返回</Button>
                                
                                </div>   
           
                        </div>}
                </Affix>
{!this.state.showright?<div id="mytable" style={{padding:"0 24px"}}>
                     <MusicTable  ref="MusicTable" musicdata={this.state.musics} tableData={this.state.musiclist}  goSave={this.licheck.bind(this)}  remove={this.deletelist.bind(this)}/>
                
                </div>
:
                <div id='detail' style={{padding:"0 24px"}}>

          {/* <Col span={3} style={{margin:"0 30px 0 0"}}>
                <FormItem label={'名称'}>

                     <Input value={this.state.listname} onChange={this.inputchange.bind(this)}/>
                </FormItem> 
               <FormItem label={'描述'}>

                     <Input value={this.state.listdesc} onChange={this.descchange.bind(this)}/>
                </FormItem>
        </Col> */}
        <Col span={24}>
           
        {/* <FormItem label={'歌单列表'}> */}
                {/* <Transfer
                        dataSource={this.state.musics}
                        titles={['曲库', '歌单列表']}
                        render={item => item.title}
                        targetKeys={this.state.targetKeys}
                        onChange={this.handleChange}
                        listStyle={{
                        width: "45%",
                        height: window.innerHeight-64-14-38-32,
                        }}
                />    */}
                <MusicSort ref="MusicSort" musicdata={this.state.musics} targetlist={this.state.targetKeys}/>
                {/* </FormItem>  */}
       </Col>
                </div>}
                
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
                        z-index:0;
                    }
                    .ant-affix .table-operations {
                        padding: 8px 24px;
                        background: #fff;
                        border-bottom: 1px solid #ececec;
                        box-shadow: 0 2px 6px rgba(100, 100, 100, 0.1);
                        margin-left: 2px;
                        height: 48px;
                    }
                    .table-operations > button {
                    margin-right: 8px;
                    }
                    #myoptable .ant-table-tbody>tr>td, #myoptable .ant-table-thead>tr>th {
                        padding: 10px 8px;
                        word-break: break-all;
                    }

                    #detail-header .ant-row{
                            display:flex;
                            margin-bottom:8px;
                    }

                    `}

                </style>
                </div>
                
                )
        }
}
)
export default MusicList;