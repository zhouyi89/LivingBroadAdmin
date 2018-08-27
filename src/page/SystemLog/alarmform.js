import React from 'react';
import { Form, Button ,DatePicker,Select,Tree,Popover } from 'antd';
import moment from 'moment';
import { netdata } from './../../helper'
const FormItem = Form.Item;
const {  RangePicker } = DatePicker;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class alarmform extends React.Component {
    state = {
        gdata: [],
        value:[]
    };
    handleChange = (e) => {
        this.setState({
            checkNick: e.target.checked,
        }, () => {
            this.props.form.validateFields(['nickname'], { force: true });
        });
    }
    handleSubmit= (e) =>{
        var that =this;
        e.preventDefault();
        let search = [];
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let start=  values["timerange"][0].format('YYYY-MM-DD HH:mm:ss');
            let end=  values["timerange"][1].format('YYYY-MM-DD HH:mm:ss');
            let alarmtype=  values["alarmtype"]
            let deviceids=this.state.value;
            let outdeviceids=""
            let alarmtypes=""
            if(deviceids.length!==0){
                for(let i=0;i<deviceids.length;i++){
               
                if(i===deviceids.length-1){
                    outdeviceids+=deviceids[i].toString()
                }else{
                    outdeviceids+=deviceids[i].toString()+","

                }
            }}else{
                outdeviceids="-1"
            }
            if(alarmtype.length!==0){
                for(let i=0;i<alarmtype.length;i++){
               
                if(i===alarmtype.length-1){
                    alarmtypes+=alarmtype[i].toString()
                }else{
                    alarmtypes+=alarmtype[i].toString()+","

                }
            }}else{
                alarmtypes="1,2"
            }
            search.push(start);
            search.push(end);
            search.push(outdeviceids);
            search.push(alarmtypes);
            const { store } = that.props;
            store.setState({ searchAlarmValue: search});
        });
    }

    componentWillMount(){
        var that = this;
        let r = {
          method: "POST",
          body: JSON.stringify({"opt":"getTree"})
        }
        netdata('/topoly/regionTreeOpt.epy', r).then(that.ondatatree.bind(that))
      }
    
      ondatatree(res) {
          if (res.s === false) {
            Notification['error']({
              message: '数据请求错误',
              description: JSON.stringify(res.d),
            });
            return;
          }
          if(res.d.errCode == 0){
          let  gData = res.d.Values;
          this.setState({gdata:gData})
          //  this.getTreeDic(gData);
          }
          else{
      
          }
        }

    
    renderTreeNodes = (data) => {
        return data.map((item) => {

    
     
          if (item.children.length != 0) {  
            return (
              <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}>
                  {this.renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          else{
            return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
          }
        
    });
    }
//     onChange = (value, label, extra) => {
//         let nodes =extra.allCheckedNodes;
//         let values=[];
//         console.log(nodes)
//         if(nodes.length===0){
            
//         }else if(typeof(nodes[0].node)=="undefined"){
// values.push(nodes[0].key)
//         }else{
//           for(let i=0;i<nodes.length;i++){
//             values.push(nodes[i].node.key)
//         }
     
//         }
  
        
//          this.setState({ value :values});
//       }
onCheck = (checkedKeys,e) => {
    this.setState({ value :checkedKeys});
           
      }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {gdata } = this.state;
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择时间！' }],
        };
        // const tProps = { 
        //     showSearch:true,     
        //     treeCheckable: true,
        //     showCheckedStrategy: SHOW_PARENT,
        //     searchPlaceholder: '请选择区域',
        //     style: {
        //       width: 500,
        //     },
        //     // onChange: this.onChange,
        //     onSelect:this.onSelect,
        //   };
        return (
            <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
                <FormItem  label="时间范围">
                    {getFieldDecorator(`timerange`,{
                        initialValue:[moment(Date.now()), moment(Date.now())],
                    })(
                        <RangePicker />
                    )}
                </FormItem>
                <FormItem  label="设备">
                    {/* {getFieldDecorator(`device`,{
                        initialValue:[-1],
                    })(
                        <TreeSelect {...tProps} >{this.renderTreeNodes(gdata)}</TreeSelect>
                    )} */}
                    <Popover  placement="bottom" content={  <div style={{height:"550px",overflow:"auto"}}>    <Tree  checkable onCheck={this.onCheck.bind(this)} selectable={false}>
                                                                        {this.renderTreeNodes(gdata)}
                                                                </Tree></div>}
       trigger="click">

                    <Button>设置需要查询的设备</Button>
                    </Popover>
                </FormItem>
                <FormItem  label="告警类型">
                    {getFieldDecorator(`alarmtype`,{
                        initialValue:['1', '2'],
                    })(
                        <Select
                        mode="multiple"
                        style={{width: '200px'}}
                        >
                            <Option value="1">设备上线</Option>
                            <Option value="2">设备离线</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem style={{float: "right",marginRight:0}}>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >
                        查 询
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

export default alarmform