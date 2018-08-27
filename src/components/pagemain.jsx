//'use strict';

import React from 'react'
import $ from "jquery"
import PropTypes from 'prop-types';
import '../index.css';

export default class PageFrame extends React.Component {
  static propTypes = {
    offsetTop: PropTypes.number,
    offsetBottom: PropTypes.number
  };

  constructor ( props ) {
    super( props );
    this.hook = false;
    this.state = {
      "style":{"width": "0px", "float": "left", "minHeight": "513px"},
      "ver":0,
    };
  }
  componentDidMount () {
    $(window).bind('resize', this.handleScroll );
    this.handleScroll();
  }

  componentWillUnmount () {
    $(window).unbind('resize', this.handleScroll);
  }

  handleScroll = e => {
    this.setState({"style":{
      "width": "0px", "float": "left", "minHeight": (window.innerHeight - 125)
    }});
  }
  render() {
    return (
      <div className="e-content" style={{"opacity": "1"}}>
        <div className="e-wrapper cf">
          <div className="e-wrapper-ref" ref="fixedNode" style={this.state.style}></div>
          <div style={{"float": "left", "width": "100%"}}>
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}