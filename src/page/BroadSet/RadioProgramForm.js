import React, { PureComponent } from 'react';
import { Form ,Input,Row, Col,Switch,Select,InputNumber,TreeSelect,message} from 'antd';
import {netdata} from './../../helper';
const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let treeDic =[];
export default class RadioProgramForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            let haveregionchild = false
            item.children.map(item=>{
              if(item.eocT === 0){
                haveregionchild = true;
              }
            })
            if(haveregionchild){
            if(item.eocT != 1){
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
            }
          }
          else{
            if(item.eocT!=1){
               return <TreeNode title={<span>{item.desc}</span>} value={item.id} key={item.id} dataRef={item}/>
            }
           
          }
        });
    }

    addMember(){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    let postbody ="";
                    postbody =JSON.stringify({"opt":"newBroadcastChl", "Name":values.Name==null?"":values.Name,"ChannelType":values.ChannelType==null?"":values.ChannelType,"CodeFormat":values.CodeFormat==null?"":values.CodeFormat,"AudiobandWidth":values.AudioBandwidth==null?"":values.AudioBandwidth, "VideoPID":values.VideoPID==null?"":values.VideoPID, "AudioPID":values.AudioPID==null?"":values.AudioPID, "PCRPID":values.PCRPID==null?"":values.PCRPID, "RegionId":values.Region==null?"":values.Region, "SignalMode":values.SignalMode==null?"":values.SignalMode, "ModuleFreq":values.ModuleFreq==null?"":values.ModuleFreq,"QAM":values.QAM==null?"":values.QAM,"Enable":values.Enable==null?"":values.Enable});
                    let r = {
                        method: "POST",
                        body: postbody
                    }
                    netdata('/BroadcastChlOpt.epy', r).then(res=>{
                        this.props.goBack();
                         message.info("添加成功!");
                        }
                    );
                }
            });
    }
    editMember(){
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let postbody ="";
                postbody =JSON.stringify({"opt":"mfyBroadcastChl","id":this.props.item.id, "Name":values.Name==null?"":values.Name,"ChannelType":values.ChannelType==null?"":values.ChannelType,"CodeFormat":values.CodeFormat==null?"":values.CodeFormat,"AudiobandWidth":values.AudioBandwidth==null?"":values.AudioBandwidth, "VideoPID":values.VideoPID==null?"":values.VideoPID, "AudioPID":values.AudioPID==null?"":values.AudioPID, "PCRPID":values.PCRPID==null?"":values.PCRPID, "RegionId":values.Region==null?"":values.Region, "SignalMode":values.SignalMode==null?"":values.SignalMode, "ModuleFreq":values.ModuleFreq==null?"":values.ModuleFreq,"QAM":values.QAM==null?"":values.QAM,"Enable":values.Enable=="checked"?true:values.Enable});
                let r = {
                    method: "POST",
                    body: postbody
                }
                netdata('/BroadcastChlOpt.epy', r).then(
                    res=>{
                        this.props.goBack();
                        message.info("编辑成功!");
                    }
                );
            }
        });
    }

    render() {
        const { getFieldDecorator} = this.props.form;
        return (
            <Form style={{padding: '24px',background: '#fbfbfb',border: '1px solid #d9d9d9'}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem label={'节目名称'}>
                            {getFieldDecorator('Name', {
                                rules: [{ required: true, message: '请输入节目名称!' }],
                                initialValue: this.props.item.Name,
                            })(
                                <Input id="Name" placeholder="请输入节目名称" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'节目类型'}>
                            {getFieldDecorator('ChannelType', {
                                rules: [{ required: false}],
                                initialValue: this.props.item.ChannelType,
                            })(
                            <Select id={'ChannelType'} initialValue="0" size="default" placeholder="请选择" style={{ width: '100%' }}>
                                <Option value="0">音频</Option>
                                <Option value="1">视频</Option>
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem label={'编码格式'}>
                            {getFieldDecorator('CodeFormat', {
                                rules: [{ required: false}],
                                initialValue:this.props.item.CodeFormat,
                            })(
                                <Select id="CodeFormat" initialValue="0" size="default" placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">MPEG-1</Option>
                                    <Option value="1">MP3</Option>
                                    <Option value="2">AAC</Option>
                                    <Option value="3">AC3</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'音频带宽'}>
                            {getFieldDecorator('AudioBandwidth', {
                                rules: [{ required: false}],
                                initialValue:this.props.item.AudioBandwidth,
                            })(
                                <Select id="AudioBandwidth" initialValue="0" size="default" placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">16</Option>
                                    <Option value="1">32</Option>
                                    <Option value="2">64</Option>
                                    <Option value="3">128</Option>
                                    <Option value="4">256</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem label={'视频PID'}>
                            {getFieldDecorator('VideoPID', {
                                rules: [{ required: false,message: '请输入视频PID!'}],
                                initialValue: this.props.item.VideoPID,
                            })(
                            <Input id="VideoPID" placeholder="请输入视频PID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'音频PID'}>
                            {getFieldDecorator('AudioPID', {
                                rules: [{ required: true,message: '请输入音频PID!'}],
                                initialValue: this.props.item.AudioPID,
                            })(
                            <Input id="AudioPID" placeholder="音频PID" />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem label={'PCR PID'}>
                            {getFieldDecorator('PCRPID', {
                                rules: [{ required: false}],
                                initialValue: this.props.item.PCRPID,
                            })(
                                <Input id="PCRPID"placeholder="请输入PCR PID" />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'控制区编码'}>
                            {getFieldDecorator('Region', {
                                rules: [{ required: true, message: '请选择区域编码!'}],
                                initialValue:this.props.item.RegionId!=null? parseInt(this.props.item.RegionId):"",
                            })(
                                <TreeSelect
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="选择区域"
                                    treeDefaultExpandAll
                                    showCheckedStrategy={SHOW_PARENT}>
                                    {this.renderTreeNodes(this.props.treeData)}
                                </TreeSelect>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem label={'信号模式'}>
                            {getFieldDecorator('SignalMode', {
                                rules: [{ required: false}],
                                initialValue: this.props.item.SignalMode,
                            })(
                                <Select initialValue="0" size="default" placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">C</Option>
                                    <Option value="1">T</Option>
                                    <Option value="2">S</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'调制频率'}>
                            {getFieldDecorator('ModuleFreq', {
                                rules: [{ required: false}],
                                initialValue:  this.props.item.ModuleFreq,
                            })(
                                <InputNumber id={'ModuleFreq'} min={0} max={10000} initialValue={163} style={{ width: '100%' }}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <FormItem label={'QAM'}>
                            {getFieldDecorator('QAM', {
                                rules: [{ required: false}],
                                initialValue:  this.props.item.QAM
                        })(
                                <Select id={'QAM'} initialValue="0" size="default" placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">16</Option>
                                    <Option value="1">32</Option>
                                    <Option value="2">64</Option>
                                    <Option value="3">128</Option>
                                    <Option value="4">256</Option>
                                </Select>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={'是否启用？'}>
                            {getFieldDecorator('Enable', {
                                rules: [{ required: false}],
                                valuePropName:'checked',
                                initialValue:this.props.item.Enable=='true'?'checked':''
                            })(
                                <Switch />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}










