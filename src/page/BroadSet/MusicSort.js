import React, { PureComponent } from 'react';
import { Icon, Button,Table } from 'antd';
import { netdata } from './../../helper';
import Sortable from 'sortablejs';
import pngmusic from './music.png';
import deletebn from './dist/delete.png';
import drag from './dist/drag.png';
let updateList = [];
let glsortable;
export default class FileTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        listdata:[]
    };
}
  // sortableContainersDecorator = (componentBackingInstance) => {
  //   // check if backing instance not null
  //   if (componentBackingInstance) {
  //     let options = {
  //       group: {
  //          name: "shared",
  //         pull: "clone",
  //         // put:false
  //       },
  //       animation: 150,
  //     };
  //     Sortable.create(componentBackingInstance, options);
  //   }
  // };
  componentWillMount() {
    this.setState({listdata:this.props.targetlist})
  }
  bindclick(Event){
     if(Event.target.className==="e-body"||Event.target.className==="table-operationsZZ"||Event.target.className==="jmjm"){
        if(typeof(this.refs.jmslide)!=="undefined"){
          this.removeClass(this.refs.jmslide,"slideopen")
        }
          
      }
  }

  componentWillUnmount(){
    document.onclick = function(Event) { 

    }
  }
  componentDidMount(){
    let that=this;
    // console.log(document.getElementById("getallitem").childNodes,"getallitem")
    // document.addEventListener("click", this.bindclick.bind(this),false);
    updateList=document.getElementById("getallitem").childNodes;
    document.onclick = function(Event) { 
      if(Event.target.className==="e-body"||Event.target.className==="table-operationsZZ"||Event.target.className==="jmjm"){
        if(typeof(that.refs.jmslide)!=="undefined"){
          that.removeClass(that.refs.jmslide,"slideopen")
        }
          
      }
      }
  }
  renderall(data) {

    var wrap = data.map(function (item) {
      return (<li id={item.key} type={item.key}><Icon type="delete" className="js-remove" /><img src={pngmusic} style={{ width: "15px", height: "15px", marginRight: "10px" }} />{item.title}</li>)

    });
    return wrap;
  }
  renderlist(data) {

    var wrap = data.map(function (item) {
      return (<li id={item.key} type={item.key}><Icon type="delete" className="js-remove" /><img src={pngmusic} style={{ width: "15px", height: "15px", marginRight: "10px" }} />{item.title}</li>)

    });
    return wrap;
  }
  getupdateList() {
    return updateList
  }
  // sortableGroup2Decorator = (componentBackingInstance) => {
  //   // check if backing instance not null
  //   if (componentBackingInstance) {
  //     let options = {
  //       draggable: "li", // Specifies which items inside the element should be sortable
  //       chosenClass: "chosen",
  //       animation: 200,
  //       group: {
  //         name: "shared",
  //         // pull: "clone",
  //         // put:false
  //       },
  //       onEnd: function (/**Event*/evt) {
  //         updateList = evt.target.childNodes;
  //         console.log(evt.target.childNodes, "end")
  //       },
  //       onAdd: function (/**Event*/evt) {
  //         updateList = evt.target.childNodes;
  //         console.log(evt.target.childNodes, "add")
  //       },
  //       filter: '.js-remove',

  //       onFilter: function (evt) {

  //         evt.item.parentNode.removeChild(evt.item);
  //         updateList = evt.from.childNodes;
  //         console.log(evt, evt.item, "ilter")
  //       }
  //     };
  //     Sortable.create(componentBackingInstance, options);
  //   }
  // };
  // sortableGroup1Decorator = (componentBackingInstance) => {
  //   // check if backing instance not null
  //   if (componentBackingInstance) {
  //     let options = {
  //       draggable: "li", // Specifies which items inside the element should be sortable
  //       chosenClass: "chosen",
  //       animation: 200,
  //       group: {
  //         name: "shared",
  //         pull: "clone",
  //         put: false
  //       },
  //       sort: false
  //     };
  //     Sortable.create(componentBackingInstance, options);
  //   }
  // };

  sortableTR = (componentBackingInstance) => {
    // check if backing instance not null
    if (componentBackingInstance) {
      let options = {
        draggable: "tr", // Specifies which items inside the element should be sortable
        handle: '.jmjm1',
        chosenClass: "chosen",
        // ghostClass:"",
         animation: 50,
        group: {
          name: "shared",
          // pull: "clone",
          // put:false
        },
        onEnd: function (/**Event*/evt) {
           updateList=evt.target.childNodes;
        },
        onAdd: function (/**Event*/evt) {
           updateList=evt.target.childNodes;
        },
        filter: '.deletebn',

        onFilter: function (evt) {

          evt.item.parentNode.removeChild(evt.item);
           updateList=evt.from.childNodes;
        }
      };
      glsortable=  Sortable.create(componentBackingInstance, options);
    }
  };
  addtritem(){
    // let data =this.state.listdata;
    // data.push({key:12,title:"ajsjaja",Remark:"1121212121"})
    //  this.setState({listdata:data})
    // this.refs.jmslide
    this.addClass(this.refs.jmslide,"slideopen")
  }

  closejmslide(){
    this.removeClass(this.refs.jmslide,"slideopen")
  }
  addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
  }

  removeClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  }
  toggleClass(obj, cls) {
    if (this.hasClass(obj, cls)) {
      this.removeClass(obj, cls);
    } else {
      this.addClass(obj, cls);
    }
  }
  hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }
  renderlistTable(data){
    var wrap = data.map(function (item) {
      return (
        <tr id={item.key} type={item.key} >
        <td className="jmjm1">
          <span className="jmjm">
            <img className="dragtag" style={{ cursor: "pointer" }} src={drag}></img>
          </span>

        </td>
        <td className="jmjm">
          <span className="jmjm">
           
            {item.title}
      
          </span>
        </td>
        <td className="jmjm">
          <span className="jmjm">
         
            {item.Remark}
      
          </span>
        </td>
        <td className="jmjm">
          <span className="jmjm">
            <img className="deletebn" style={{ cursor: "pointer" }} src={deletebn}></img>
          </span>
        </td>
      </tr>
)

    });
    return wrap;
  }
  render() {
    let that =this;
    const columns = [{
      title: '名称',
      dataIndex: 'title',
      key: 'title',
      width:300
      // render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '操作',
      key: 'action',
      width:80,
      fixed: 'right',
      render: (text, record) => (
        <Button type="primary" onClick={rr=>{
              let data =that.state.listdata;
            data.push({key:record.key,title:record.title,Remark:record.Remark});
            that.setState({listdata:data},()=>{updateList=document.getElementById("getallitem").childNodes;});
            
          
          }}>
          加入节目单
        </Button>
      ),
    }];
    return (
      <div className="container" style={{ minWidth: "890px", overflow: "hidden" }} ref={this.sortableContainersDecorator}>
        {/* <div className="group">
                  <h2 className="group-title">节目曲库</h2>
                  <ul className="group-list" id="myorlist" ref={this.sortableGroup1Decorator}>
                    {this.renderall(this.props.musicdata)}
                </ul>
                  
                </div>
                <div className="group">
                  <h2 className="group-title">节目单</h2>
                  <ul className="group-list" id="myupdatelist" ref={this.sortableGroup2Decorator}>
                    {this.renderlist(this.props.targetlist)}
                  </ul>
                </div> */}
        <div className="table-operationsZZ" style={{ height: "22px" }}>
          <div className="jiemudan" >节目单 </div>
          <Button style={{ position: "absolute", right: "-7px" }} onClick={this.addtritem.bind(this)} type="primary" icon="plus">添加节目</Button>

        </div>




        <div className="ant-table-wrapper">
          <div className="ant-spin-nested-loading">
            <div className="ant-spin-container">
              <div className="ant-table ant-table-middle ant-table-bordered ant-table-scroll-position-left">
                <div className="ant-table-content">
                  <div className="ant-table-scroll">
                    <div className="ant-table-body" style={{ overflowX: "auto" }}>
                      <table id="jmdtable" className="ant-table-fixed" style={{ width: "1200px" }}>
                        <colgroup>
                          <col style={{ width: "10%", minWidth: "20px" }} />
                          <col style={{ width: "45%", minWidth: "120px"}} />
                          <col style={{ width: "35%", minWidth: "120px"}} />
                          <col style={{ width: "10%", minWidth: "20px" }} />
                        </colgroup>
                        <thead className="ant-table-thead">
                          <tr >
                            <th className="jmjm">
                              <span className="jmjm">
                                
                                拖动把手
			                      	</span>
                            </th>
                            <th className="jmjm">
                              <span className="jmjm">
                                名称
			                      	</span>
                            </th>
                            <th className="jmjm">
                              <span className="jmjm">
                                描述
			                      	</span>
                            </th>
                            <th className="jmjm">
                              <span className="jmjm">
                                操作
				                      </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody id="getallitem" className="ant-table-tbody" ref={this.sortableTR}>
                          {this.renderlistTable(this.state.listdata)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div ref="jmslide" className="jmslide jmslidein " >
         <div className="jiemudan " style={{left: "10px" }}>节目曲库 </div>
          <Button style={{ position: "absolute", right: "10px" }} onClick={this.closejmslide.bind(this)} type="primary" icon="double-right">收起</Button>
          <Table bordered scroll={{ x: 400 }} size="middle" style={{    marginTop: "36px"}} columns={columns} dataSource={this.props.musicdata} />

        </div>


        <style>{`
                .jmjm1{
                  cursor:move;
                }
                .jmslidein{
                  right:-350px;
                }
                .jmslidein.slideopen{
                  right:0;
                }
                .jmslide{
                  height: ${window.innerHeight-64}px;
                  width: 350px;
                  background: #fff;
                  position: fixed;
                  top: 64px;
                  padding:10px;
                  -webkit-box-shadow: 0 0 10px #cad0d0;
                  -moz-box-shadow: 0 0 10px #cad0d0;
                  box-shadow: 0 0 10px #cad0d0;
                  -webkit-transition: all 0.3s ease;
                  -moz-transition: all 0.3s ease;
                  transition: all 0.3s ease;
                }







            #jmdtable td,#jmdtable th{
                  text-align: center;
            }

            #jmdtable .ant-table-tbody>tr:hover{
              background-color: #fff;
            }
            #jmdtable .ant-table-tbody>tr>td, #jmdtable .ant-table-thead>tr>th {
              padding: 8px 8px;
          }
                #myupdatelist::-webkit-scrollbar-track
          {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: #fff;
          }

          #myupdatelist::-webkit-scrollbar
          {
            width: 6px;
            background-color: #fff;
          }

          #myupdatelist::-webkit-scrollbar-thumb
          {
            background-color:rgba(70, 68, 68, 0.17);
          }
          #myorlist::-webkit-scrollbar-track
          {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            background-color: #fff;
          }

          #myorlist::-webkit-scrollbar
          {
            width: 6px;
            background-color: #fff;
          }

          #myorlist::-webkit-scrollbar-thumb
          {
            background-color:rgba(70, 68, 68, 0.17);
          }



                  .js-remove{
                    -webkit-transition: opacity .2s;
                    transition: opacity .2s;
                    opacity: 0;
                    cursor: -webkit-grabbing;
                    color: #c00;
                    padding-right: 10px;

                  }
                  #myupdatelist li:hover .js-remove {
                      opacity: 1;
                      cursor: pointer;
                  }
                  .chosen{
                    -webkit-box-shadow: 0 0 10px rgba(0, 204, 204, .5);
                    -moz-box-shadow: 0 0 10px rgba(0, 204, 204, .5);
                    box-shadow: 0 0 10px rgba(0, 204, 204, .5);
                  }
                  ul.group-list{
     
                    max-width: 425px;

                    margin-left: 5px;
                    text-align: left;
                    height:90%;
                    overflow: auto;
                  }
                  ul.group-list li{

                    padding: 3px 0px;   
                    font-size:15px;
                    cursor: -webkit-grabbing;
                  }
 
                  .group {
                    height: 97%;
                    width: 46%;
                    min-width: 245px;
                    text-align: center;
                    margin-top: 15px;
                    margin-left: 5px;
                    margin-right: 30px;
                    display: inline-block;
                    vertical-align: top;
                    border: 1px solid #d9d9d9;
                }
                  .group-title{
                    padding: 10px;
                    border-bottom: 1px solid #d9d9d9;
                  }
                  

                  .container .table-operationsZZ {
                    margin-bottom: 16px;
                  }
                  
                  .table-operationsZZ > button {
                    margin-right: 8px;
                  }

                    .jiemudan{
                      position: absolute;
                      left: 0px;
                      font-size: 15px;
                      border-left: 4px solid #108ee9;
                      color: #108ee9;
                      padding-left: 10px;
                      margin-top: 3px;
                    }
                  
                  `}</style>
      </div>
    );
  }
}
