//'use strict';

import React from 'react'

//antd
import Spin from 'antd/lib/spin'

import PageHeader from '../../components/pageheader.jsx'
import PageMain from '../../components/pagemain.jsx'
//import AffixFix from '../../components/Affix.jsx'

import L from './svghelper'

export default class pageMainp extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      loading:true
    };
    setTimeout(()=>{
      this.setState({ loading: false });
    }, 1 * 1000);
  }
  render() {
    return (
      <section className="e-body">
        <PageHeader><span>图纸管理</span>研发一层</PageHeader>
        <PageMain>
          <div className="cf" style={{height:'100%'}}>
            <div className="barpanel-content cf"><div className=" clearfix"><div className="" style={{"minHeight":"100px"}}>
            <Spin spinning={this.state.loading} className="" style={{"height": "100%"}}>
              <L />
            </Spin>
            </div></div></div>
          </div>
        </PageMain>
      </section>
    )
  }
}
