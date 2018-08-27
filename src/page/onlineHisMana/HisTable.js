import React from 'react';
import { Table, Button, Form, Input,Affix,Tag,Icon } from 'antd';
import { withRouter } from 'react-router'
import XLSX from 'xlsx';
let gData;
let tmpDown;
const HisTable =withRouter(
class HisTable extends React.Component {
         state = {
             sourcedata: [],
         };


         outputexcel(){
            
              var type="xlsx";
              let data =this.props.sourcedata;
            let json=[];
              for(let i=0;i<data.length;i++){
                json.push({"index":i,"时间":data[i].time,"在线设备":data[i].online,"设备总数":data[i].total,"在线率":data[i].rate})
              }
                    // var json = [{ 主页: "111", 名称: "6800", 数量: "6800", 昵称: "广告主网" }, { 主页: "433", 名称: "6800", 数量: "6800", 昵称: "广告主网" }, { 名称: "22", 商家: "6800", 数量: "6800", 昵称: "广告主网", }, { 名称: "43", 商家: "6800", 数量: "6800", 昵称: "广告主网", }, { 店家: "43", 价格: "6800", 数量: "6800", 昵称: "广告主网", }];
                    var tmpdata = json[0];
                    json.unshift({});
                    var keyMap = []; //获取keys
                    //keyMap =Object.keys(json[0]);
                    for (var k in tmpdata) {
                        keyMap.push(k);
                        json[0][k] = k;
                    }
                  var tmpdata = [];//用来保存转换好的json 
                        json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
                            v: v[k],
                            position: (j > 25 ? this.getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
                        }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
                            v: v.v
                        });
                        var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
                        var tmpWB = {
                            SheetNames: ['mySheet'], //保存的表标题
                            Sheets: {
                                'mySheet': Object.assign({},
                                    tmpdata, //内容
                                    {
                                        '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                                    })
                            }
                        };
                        tmpDown = new Blob([this.s2ab(XLSX.write(tmpWB, 
                            {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
                            ))], {
                            type: ""
                        }); //创建二进制对象写入转换好的字节流
                    var href = URL.createObjectURL(tmpDown); //创建对象超链接
                    document.getElementById("hf").href = href; //绑定a标签
                    document.getElementById("hf").click(); //模拟点击实现下载
                    setTimeout(function() { //延时释放
                        URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
                    }, 100);
            
                  }
                   s2ab(s) { //字符串转字符流
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
                 // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
                 getCharCol(n) {
                    let temCol = '',
                    s = '',
                    m = 0
                    while (n > 0) {
                        m = n % 26 + 1
                        s = String.fromCharCode(m + 64) + s
                        n = (n - m) / 26
                    }
                    return s
                }
         componentDidMount() {

         };
         render() {
             const {sourcedata} = this.state;
             const columns = [{
                 title: '时间',
                 dataIndex: 'time',
                 key: 'time',
             }, {
                title: '在线设备数',
                dataIndex: 'online',
                key: 'online',
            }, {
                title: '设备总数',
                dataIndex: 'total',
                key: 'total',
            }, {
                title: '在线率',
                dataIndex: 'rate',
                key: 'rate',
                render:(val)=>{return val+"%"}
            }];
             return (
                 <div id="affix"> <Button style={{    margin: "0 0 10px 24px"}} size='default' onClick={this.outputexcel.bind(this)}><Icon type="file-excel" />导出EXCEL</Button><a href="" download={"history.xlsx"} id="hf"></a> 
                     <div id="myoptable" style={{padding: "0 24px"}}>
                         <Table pagination={{pageSize: 20, showSizeChanger: true, showQuickJumper: true}} dataSource={this.props.sourcedata}
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
export default HisTable;