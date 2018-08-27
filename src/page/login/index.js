//'use strict';

import React from 'react'
import LoginFooter from './footer'
import LoginForm from './form'

import './index.css'
import webm from './top.webm'
import mylogo from './mylogo.png'
export default class pageLogin extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      loading:true
    };
  }

   render() {
    return (
      // <div data-reactroot="" className="login-view___20k2g">
      //   <div className="left-bg___DP2nG">
      //     <div className="left-bg-title___fLDIv">
      //       <div className="left-logo__lt">
      //       </div>
      //     </div>
      //   </div>
      //   <div className="right-panel___SmvwX">
      //     <div className="login-form___1rW3i">
      //       <div className="login-form-title___11oiF">
      //         {process.env.REACT_APP_WEBSITE_NAME}
      //         <span className="login-form-version___1SiTs">Ver 1.0.0</span>
      //       </div>
      //       <LoginForm />
      //     </div>
      //     <LoginFooter />
      //   </div>
      // </div>
      <div className="part-login">
      <div className="intro-wrapper">
          <div className="intro-detail">
              <div className="detail-wrapper">
                  {/* <div className="title">
                      <h2>应急广播</h2>
                  </div>
                  <div className="detail">
                      <h3>管理系统</h3>
                  </div> */}
                  <img width="450" src={mylogo}></img>
              </div>
          </div>
      </div>

      <div className="intro-video">
          <video id="video" className="video" autoPlay="autoplay" loop="loop" src={webm}>
          </video>
      </div> 
      <div className="mod-login">
              <div className="login-inner">
              <LoginForm />
              </div>

        </div>
        <span className="lootomlogo">Lootom</span>
        <LoginFooter />
      <style>{`
      .lootomlogo{
        z-index: 100;
        color: #FFF;
        font-size: 25px;
        position: absolute;
        left: 15px;
        top: 9px;
      }
.ant-btn-lg{
  background-color: #86ce2f;
  color: #FFF;
  height: 45px;
}
.ant-input-lg {
  /* padding: 6px 7px; */
  height: 45px;
}
              .intro-video{
                position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
    background: url(${require("./part-login@2x.jpg")}) no-repeat;
    background-size: cover;
    overflow: hidden;
        }

       .intro-video .video{
                position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
        }

        .part-login{

        }
.intro-wrapper{
     position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    z-index: 100;
}
.intro-wrapper .intro-detail{

}

.intro-wrapper .intro-detail .detail-wrapper{
    position: absolute;
    right: 15%;
    top: 44%;
    -webkit-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);

}
.intro-wrapper .intro-detail .detail-wrapper .title{
    opacity: 1;
        font-size: 56px;
    color: #FFF;

}
.intro-wrapper .intro-detail .detail-wrapper .detail{
    color: #FFF;
    font-size: 35px;
    opacity: 1;

}
.part-login .detail h3 {
    /*font-size: .36rem;*/
    text-align: justify;
    letter-spacing: 57px;
    /*width: 3.65rem;*/
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
    /*line-height: .4rem;*/
  
            font-weight: inherit;
}
.part-login .title h2 {
    /*font-size: .9rem;*/
    /*margin-bottom: .32rem;*/
    white-space: nowrap; 
         margin: 0;
         font-family: SimHei;
}
.part-login .login-inner {
  padding:60px 20px;
    width: 440px;
    height: 390px;
    position: absolute;
    left: 15%;
    top: 49%;
    background-color: transparnt;
    -webkit-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
}
.part-login .mod-login {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    z-index: 100
}
      
      
      `}</style>
        </div>


    )
  }
}
