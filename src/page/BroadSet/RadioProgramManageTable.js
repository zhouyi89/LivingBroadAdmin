import React from 'react';
import { Button,Form ,Affix,message} from 'antd';
import {netdata} from './../../helper';
import { withRouter } from 'react-router'
import RadioProgramTable from './RadioProgramTable';
import RadioProgramForm from './RadioProgramForm';
const RadioProgramManageTable= withRouter(class RadioProgramManageTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            treeData: [],
            data:[],
            treeDic:[],
            item:'',
            loading:false
        };
    }
    handleData(nData){
        this.setState({data:nData});
    }

    componentWillMount () {
        let r = {
            method: "POST",
            body: JSON.stringify({"opt":"getTree"})
        }
        netdata('/topoly/regionTreeOpt.epy', r).then(this.onareadata.bind(this));
    }
    onareadata(res) {
        if (res.s === false) {
            Notification['error']({
                message: '数据请求错误',
                description: JSON.stringify(res.d),
            });
            this.reloadlist();
            return;
        }
        if(res.d.errCode == 0){
            this.setState({treeData:res.d.Values});
        }
        this.reloadlist();
    }

    setloading(){
        this.setState({ loading: false })
    }
    reloadlist(){
        this.setState({loading:true});
        let r = {
            method: "POST",
            body: JSON.stringify({"opt":"getBroadcastChlList"})
        }
        netdata('/BroadcastChlOpt.epy', r).then(this.ondata.bind(this));
    }

    ondata(res) {
        if(res.d.errCode === "Cookie过期"){
            this.props.history.replace('/power')
          }
        if (res.s === false) {
            Notification['error']({
                message: '数据请求错误',
                description: JSON.stringify(res.d),
            });
            this.setState(res.d)
            return;
        }
        if(res.d.errCode == 0){
            let broadCastData = res.d.Values;
            for(let i=0;i<broadCastData.length;i++) {
                broadCastData[i].key = broadCastData[i].id;
               }
            broadCastData.sort(function (a, b) { return b.key-a.key });
            this.setState({data:broadCastData});
            setTimeout(this.setloading.bind(this),10);
        }
    }

    goSave(id) {
       var detail = document.getElementById('detail');
       var lstTable = document.getElementById('mytable');
       var detail_header= document.getElementById('detail-header');
       var lstTable_header = document.getElementById('myoptable-header');
       detail_header.style.display = 'block';
       lstTable_header.style.display = 'none';

        detail.style.display = 'block';
        lstTable.style.display = 'none';
        this.setState({item:''});
        if(id!=null)
        {
            this.state.data.map((item) => {
               if(item.id === id)
               {
                   this.setState({item:item});
               }
            });
        }
    }

    goBack(){
        var detail = document.getElementById('detail');
        var lstTable = document.getElementById('mytable');
        var detail_header= document.getElementById('detail-header');
        var lstTable_header = document.getElementById('myoptable-header');
        detail_header.style.display = 'none';
        lstTable_header.style.display = 'block';
        detail.style.display = 'none';
        lstTable.style.display = 'block';
        this.reloadlist();
    }

    AddUser() {
        if(this.state.item=='' || this.state.item ==null){
            console.log('add','add');
            this.formRef.addMember();
        }

        else
        {
            console.log('edit','edit');
            this.formRef.editMember();
        }

    }
    deleteBatch(){
        this.refs.RadioProgramTable.bacthDelete();
    }


    render() {
        const WrappeForm = Form.create()(RadioProgramForm);
        return (
          <div>
            <div>
                <Affix offsetTop={64}>
                    <div className="table-operations" id='myoptable-header'>
                        <Button icon="plus" onClick={this.goSave.bind(this)}>添加</Button>
                        <Button icon="reload" onClick={this.reloadlist.bind(this)}>刷新</Button>
                        <Button icon="close-circle-o" onClick={this.deleteBatch.bind(this)}>批量删除</Button>
                    </div>
                    <div className="table-operations" id='detail-header' style={{display:'none'}}>
                        <Button icon="save" onClick={this.AddUser.bind(this)}>保存后返回</Button>
                        <Button icon="rollback" onClick={this.goBack.bind(this)}>返回</Button>
                    </div>
                </Affix>
                <div id="mytable" style={{padding:"0 24px"}}>
                    <RadioProgramTable loading={this.state.loading} ref="RadioProgramTable" treeData={this.state.treeDic} tableData={this.state.data} handleData={this.handleData.bind(this)} goSave={this.goSave.bind(this)}/>
                </div>

                <div id='detail' style={{padding:"0 24px",display:'none'}}>
                    <WrappeForm wrappedComponentRef={(inst) => this.formRef = inst} treeData={this.state.treeData} item={this.state.item} goBack={this.goBack.bind(this)}/>
                </div>
            </div>

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
        );
    }
}
)
export default RadioProgramManageTable;