import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Select, TreeSelect } from 'antd';
import { netdata } from './../../helper';
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

export default class UsersTable extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      edit: true,
      data: [],
      pid: 1,
      value: {
        myll: []
      },
      nameedit:false
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.datasource })
    this.setState({ pid: nextProps.pid })
    this.setState({ edit: true })
  }
  componentDidMount() {
    this.setState({ data: this.props.datasource })
    this.setState({ pid: this.props.pid })
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
      this.setState({ edit: false,nameedit:false });
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
  remove(key) {
    let r = {
      method: "POST",
      body: JSON.stringify({ "opt": "delUser", "id": key })
    }
    netdata('/RoleOpt.epy', r).then(res => {
      if (res.d.errCode == 0) {
        this.setState({ edit: true });
        const newData = this.state.data.filter(item => item.key !== key);
        this.setState({ data: newData });
      }
        this.props.onreload();
        message.info("删除成功！");
    })
  }
  removeNew(key) {
    this.setState({ edit: true });
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
  }
  newMember = () => {
    if (!this.state.edit) {
      message.error("请完成当前编辑！")
    } else {
      this.setState({ edit: false,nameedit:true });
      const newData = [...this.state.data];
      newData.push({
        key: `NEW_USER_ID_${this.index}`,
        name: '',
        nameExt: '',
        desc: '',
        Pass: '',
        editable: true,
        isNew: true,
      });
      this.index += 1;
      this.setState({ data: newData });
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
      target[fieldName] = e.target.value;
      if(key.toString().indexOf("NEW")===0){
        target["isNew"] = true;
      }
      this.setState({ data: newData });
    }
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
    this.setState({ edit: true });
  }
  saveRow(e, key) {
    e.persist();
    var that = this;
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
      if (!target.Pass || !target.name || !target.nameExt) {
        message.error('请填写完整信息。');
        return;
      }
      else {
        let r = {
          method: "POST",
          body: JSON.stringify(
            { "opt": "mfyUser", "id": target.key, "name": target.name, "nameExt": target.nameExt, "desc": target.desc, "pass": target.Pass })
        }
        netdata('/RoleOpt.epy', r).then(res => {
          if (res.d.errCode == 0) {
            this.setState({ edit: true });
            that.toggleEditable(e, key);
            this.setState({ edit: true });
            this.props.onreload();
            message.info("操作成功！");
          } else {
            message.error(res.d.errCode);
          }
        })
      }
    }, 10);
  }

  saveRowNew(e, key) {
    e.persist();
    var that = this;
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
      if (!target.Pass || !target.name || !target.nameExt) {
        message.error('请填写完整信息。');
        return;
      }
      else {
        let r = {
          method: "POST",
          body: JSON.stringify(
            { "opt": "newUser", "pid": this.state.pid, "name": target.name, "nameExt": target.nameExt, "desc": target.desc, "pass": target.Pass })
        }
        netdata('/RoleOpt.epy', r).then(res => {
          if (res.d.errCode == 0) {
              this.setState({ edit: true });
              this.toggleEditable(e, key);
              this.setState({ edit: true });
              this.props.onreload();
              message.info("操作成功！");
          } else {
            message.error(res.d.errCode);
          }
        })
      }
    }, 10);
  }
  render() {
    const columns = [{
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      render: (text, record) => {
        if (record.editable&&this.state.nameedit) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'name', record.key)}
              placeholder="用户名"
            />
          );
        }
        return text;
      },
    }, {
      title: '密码',
      dataIndex: 'Pass',
      key: 'Pass',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'Pass', record.key)}
              placeholder="密码"
            />
          );
        }
        return text;
      },
    }, {
      title: '备注',
      dataIndex: 'nameExt',
      key: 'nameExt',
      width: '25%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'nameExt', record.key)}
              placeholder="备注"
            />
          );
        }
        return text;
      },
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      width: '25%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'desc', record.key)}
              placeholder="描述"
            />
          );
        }
        return text;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (text, record) => {
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a style={{ marginRight: '10px' }} onClick={e => this.saveRowNew(e, record.key)}>保存</a>
                {/* <Divider type="vertical" /> */}
                <a onClick={e => this.removeNew(record.key)}>删除</a>
              </span>
            );
          }else{
            return (
            <span>
              <a style={{ marginRight: '10px' }} onClick={e => this.saveRow(e, record.key)}>保存</a>
              {/* <Divider type="vertical" /> */}
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
          }

        }
        return (
          <span>
            <a style={{ marginRight: '10px' }} onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            {/* <Divider type="vertical" /> */}
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];

    return (
      <div>
        <Table
        loading={this.props.loading}
          bordered
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowClassName={(record) => {
            {/* return record.editable ? styles.editable : ''; */ }
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
      </div>
    );
  }
}
