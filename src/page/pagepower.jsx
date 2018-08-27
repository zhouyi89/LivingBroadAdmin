//'use strict';

import React from 'react'
//import { render } from 'react-dom'
import { withRouter } from 'react-router'
//hashHistory, Link, , IndexRoute
import PowerCheck from '../components/powercheck.jsx'
//import AppData from '../components/appdata.jsx'
import dalogin from '../data/dalogin'
import { Dly } from '../components/acshelper.js'
import QueueAnim from 'rc-queue-anim';
import $ from "jquery"
//import cookie from 'react-cookie'

//let _path = "/index"
const url = "/yy/authchk.epy";
export default  withRouter(class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {k:0,err:false,status:'process'}
    }
    onserchkcookie = (data: any, textStatus: string) => {
      this.setState({k:2,err:false,status:'process'})
      Dly(400).then(()=>{
        try{
          if (data["s"] === 0) {
            dalogin.setchecked(true)
            let newpath = "/index"
            try {
              newpath = this.props.location.state.from.pathname;
            }
            catch(eer) {
            }
            this.props.history.replace(newpath);
            return
          }
        }
        catch(err){
        }
        this.setState({k:2,err:true,status:'error'})
      });
    }
    onserchkerr = ()=> {
      this.setState({k:1,err:true,status:'error'})
    }
    chkexcute = () => {
      let uid = dalogin.getUid()
      if (uid !== undefined) {
        this.setState({k:1,err:false,status:'process'})
        $.post(url, "{opt:'chk'}", this.onserchkcookie, "json").catch(this.onserchkerr)
      } else {
        this.setState({k:0,err:true,status:'error'})
      }
/*
      if (AppData.GetV('power') === false) {
        Dly(1000 * 2).then(()=> {
          AppData.SetKV('power', true);
          this.props.router.replace(_path);
        });
      }*/
    }
    componentDidMount () {
      this.setState({k:0,err:false,status:'process'})
      Dly(400).then(this.chkexcute)
    }
    componentWillUnmount () {
    }
    render() {
      return (
        <QueueAnim type="right"><PowerCheck k={this.state.k} err={this.state.err} status={this.state.status}/></QueueAnim>
      )
  }
})

