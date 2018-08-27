//'use strict';

import React from 'react'

//antd
import Spin from 'antd/lib/spin'

import PageHeader from '../../components/pageheader.jsx'
import PageMain from '../../components/pagemain.jsx'

import L from './flow'

export default class pageMainp extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      loading:true
    };
    setTimeout(()=>{
      this.setState({ loading: false });
    }, 1 * 10);
  }
  render() {
    return (
      <section className="e-body">
        <PageHeader><span>业务</span>业务流程</PageHeader>
        <PageMain>
          <div className="cf" style={{height:'100%'}}>
            <div className="barpanel-content cf" style={{"margin":"0 0px 0px"}}>
              <div className=" clearfix">
                <div className="" style={{"minHeight":"100px"}}>
                  <Spin spinning={this.state.loading} className="" style={{"height": "100%"}}>
                    <L history = {this.props.history} />
                  </Spin>
                </div>
              </div>
            </div>
          </div>
        </PageMain>
      </section>
    )
  }
}
