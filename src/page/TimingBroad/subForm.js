import React from 'react';
import { Form, Input, Button ,DatePicker} from 'antd';
const FormItem = Form.Item;
class subForm extends React.Component {
    state = {
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
    });     
  }
  componentDidMount(){
    this.props.store.subscribe(() => {
        const { BroadcastData,id } = this.props.store.getState();
        this.props.form.setFieldsValue({
            Name: BroadcastData[id].Name,   
        });

      });

  }
  NameDATA(){
    let NameDATA;
    this.props.form.validateFields((err, values) => {
        NameDATA= values
        // console.log("values",values)

    })
    return NameDATA;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
                <Form layout="inline" onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem  label="名称：" >
                    {getFieldDecorator(`Name`, {
                        initialValue:"",
                    })(
                        <Input style={{width:"400px"}}/>
                    )}
                    </FormItem>
                    <FormItem style={{float: "right",marginRight:10}}>
                    <Button
                        type="primary"
                        icon="save"
                        onClick={this.props.saveSub}
                    >
                        保 存
                    </Button>
                    </FormItem>
                    {/* <FormItem style={{float: "right",marginRight:10}}>
                    <Button
                        icon="check"
                    >
                        启 用
                    </Button>
                    </FormItem> */}
                </Form>
    );
  }
}

export default subForm