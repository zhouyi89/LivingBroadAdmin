import React from 'react';
import { Form, Select,Slider,TimePicker,Checkbox,Col } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
class Timerange extends React.Component {
    constructor(props) {
      super(props);
  
      // const value = this.props.value || {};
      this.state = {
        start: '',
        end: '',
      };
    }
    componentWillReceiveProps(nextProps) {
      if ('value' in nextProps) {
        const value = nextProps.value;
        this.setState(value);
      }
    }
    onchangestart=(time, timeString)=>{
        this.setState({start:timeString})
        this.triggerChange({start:timeString});
    }
    onchangeend=(time, timeString)=>{
      this.setState({end:timeString})
      this.triggerChange({end:timeString});
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
    render() {
      const { size } = this.props;
      const state = this.state;
      return (
        <span>
         <TimePicker allowEmpty={false} value={moment(state.start, 'HH:mm')} format={'HH:mm'} onChange={this.onchangestart.bind(this)} style={{width:"100px"}}/>
            ~
          <TimePicker allowEmpty={false} value={moment(state.end, 'HH:mm')} format={'HH:mm'} onChange={this.onchangeend.bind(this)} style={{width:"100px"}}/>
          
        </span>
      );
    }
  }


class Playcircle extends React.Component {
  constructor(props) {
    super(props);

    // const value = this.props.value;
    this.state = {
      mode: '',
      dayselect: [],
    };
  }
  
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      // if(value.mode=="2"){
      //   this.setState({show:false});
      // }
      // else{
      //   this.setState({show:true});
      // }
      this.setState(value);
    }
  }
  // handleNumberChange = (e) => {
  //   const number = parseInt(e.target.value || 0, 10);
  //   if (isNaN(number)) {
  //     return;
  //   }
  //   if (!('value' in this.props)) {
  //     this.setState({ number });
  //   }
  //   this.triggerChange({ number });
  // }
  handledayChange = (circle) => {
    this.setState({mode:circle})
    this.triggerChange({mode:circle});
  }
  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }
  onchangedaysel =(key)=>{
    this.setState({dayselect:key})
    this.triggerChange({dayselect:key});
  }
  render() {
    const { size } = this.props;
    const state = this.state;
    const options = [
        { label: '周日', value: '7' },
        { label: '周一', value: '1' },
        { label: '周二', value: '2' },
        { label: '周三', value: '3' },
        { label: '周四', value: '4' },
        { label: '周五', value: '5' },
        { label: '周六', value: '6' },
      ];
    return (
      <span>
    <Col span={4}>
        <Select
            value={state.mode}
            onChange={this.handledayChange}
        >
            <Option value="1">每周</Option>
            <Option value="2">每天</Option>
        </Select>
      </Col>
      <Col span={1}>
        <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
        </span>
      </Col>
      <Col span={19}>
       {this.state.mode==="1"? <CheckboxGroup options={options} value={state.dayselect} onChange={this.onchangedaysel.bind(this)}/> :null}
      </Col>





      </span>
    );
  }
}

class basicForm extends React.Component {
  state={
    start:"",
    end:""
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  checkPrice = (rule, value, callback) => {
    if (value.number > 0) {
      callback();
      return;
    }
    callback('Price must greater than zero!');
  }
  basicDATA(){
    let basicDATA;
    this.props.form.validateFields((err, values) => {
      basicDATA= values
        // console.log("values",values)

    })
    return basicDATA;
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
        const { BroadcastData,id } = this.props.store.getState();
        // this.setState({Name:BroadcastData[id].Name})
        let dayselect = BroadcastData[id].DaySelect.split(",");
        this.props.form.setFieldsValue({
          level:BroadcastData[id].LevelId,   
          vol:BroadcastData[id].Volume,
          timerange:{ start: BroadcastData[id].StartTime, end: BroadcastData[id].EndTime },
          playcircle:{ mode: BroadcastData[id].CircleMode, dayselect: dayselect }
        });
        this.setState({start:BroadcastData[id].StartTime,end:BroadcastData[id].EndTime})
      });

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
        labelCol: {
          xs: { span: 1 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 7 },
          sm: { span: 7 },
        },
      };

      const formItemLayouteee = {
        labelCol: {
          xs: { span: 1 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 17 },
          sm: { span: 17 },
        },
      };
    return (
      <Form onSubmit={this.handleSubmit}>
        {/* <FormItem 
        {...formItemLayout}
        label="Price">
          {getFieldDecorator('price', {
            initialValue: { number: 0, currency: 'rmb' },
            rules: [{ validator: this.checkPrice }],
          })(<PriceInput />)}
        </FormItem> */}
        <FormItem
        {...formItemLayout}
         label="消息级别">
          {getFieldDecorator('level', {
          })(
            <Select size="default" placeholder="请选择" style={{ width: '100%' }} >
            <Option value="6">一般</Option>
            <Option value="7">较大</Option>
            <Option value="8">重大</Option>
            <Option value="9">特别重大</Option>
          </Select>
              )}
        </FormItem>
        <FormItem
        {...formItemLayout}
         label="音量大小">
          {getFieldDecorator('vol', {
          })(
            <Slider min={0} max={32} step={8} marks={{ 0: '0', 8: '8', 16: '16', 24: '24', 32: '32' }} />
              )}
        </FormItem>
        <FormItem
        {...formItemLayout}
         label="播放时段">
          {getFieldDecorator('timerange', {
            initialValue: { start: this.state.start, end: this.state.end },
          })(
            <Timerange />
              )}
        </FormItem>
        <FormItem
        {...formItemLayouteee}
        label="inline"
         label="播放周期">
          {getFieldDecorator('playcircle', {
            initialValue: { mode: '1', dayselect: '1' },
          })(
            <Playcircle />
              )}
        </FormItem>
      </Form>
    );
  }
}

export default basicForm