import React, { PureComponent } from 'react';
import { Form ,Input,Row, Col,message,Select,InputNumber,TreeSelect} from 'antd';
import {netdata} from './../../helper';
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
let treeDic =[];
export default class QAMForm extends PureComponent {
        constructor(props) {
                super(props);

                this.state = {
                        data: []
                };
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
                                netdata('/BroadcastChlOpt.epy', r).then(
                                    res=>{
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
                                postbody =JSON.stringify({"opt":"mfyBroadcastChl","id":this.props.item.id, "Name":values.Name==null?"":values.Name,"ChannelType":values.ChannelType==null?"":values.ChannelType,"CodeFormat":values.CodeFormat==null?"":values.CodeFormat,"AudiobandWidth":values.AudioBandwidth==null?"":values.AudioBandwidth, "VideoPID":values.VideoPID==null?"":values.VideoPID, "AudioPID":values.AudioPID==null?"":values.AudioPID, "PCRPID":values.PCRPID==null?"":values.PCRPID, "RegionId":values.Region==null?"":values.Region, "SignalMode":values.SignalMode==null?"":values.SignalMode, "ModuleFreq":values.ModuleFreq==null?"":values.ModuleFreq,"QAM":values.QAM==null?"":values.QAM,"Enable":values.Enable==null?"":values.Enable});
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
                                                <FormItem label={'名称'}>
                                                        {getFieldDecorator('Name', {
                                                                rules: [{ required: true, message: '请输入名称!' }],
                                                                initialValue: this.props.item.Name,
                                                        })(
                                                                <Input id="Name" placeholder="请输入节目名称" />
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
                                                <Select id='SignalMode' initialValue="0" size="default" placeholder="请选择" style={{ width: '100%' }}>
                                                    <Option value="0">C</Option>
                                                    <Option value="1">T</Option>
                                                    <Option value="2">S</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
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
                                </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <FormItem label={'描述'}>
                                        {getFieldDecorator('Description', {
                                            rules: [{ required: false}],
                                            initialValue:  this.props.item.Description
                                        })(
                                            <TextArea rows={4} placeholder="请输入描述信息" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                );
        }
}










