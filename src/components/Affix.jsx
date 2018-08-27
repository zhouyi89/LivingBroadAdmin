
//'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
//import EventHelper from './events.js';
import $ from "jquery"
import classNames from 'classnames';
import warning from 'warning';
import PropTypes from 'prop-types';
//import update from 'immutability-helper';

function getScroll ( w, top ) {
  let ret = w[ `page${top ? 'Y' : 'X'}Offset` ];
  const method = `scroll${top ? 'Top' : 'Left'}`;
  if ( typeof ret !== 'number' ) {
    const d = w.document;
    // ie6,7,8 standard mode
    ret = d.documentElement[ method ];
    if ( typeof ret !== 'number' ) {
      // quirks mode
      ret = d.body[ method ];
    }
  }
  return ret;
}

function getOffset ( element ) {
  const body = document.body;
  const rect = element.getBoundingClientRect();
  const clientTop = element.clientTop || body.clientTop || 0;
  const clientLeft = element.clientLeft || body.clientLeft || 0;
  const scrollTop = getScroll( window, true );
  const scrollLeft = getScroll( window );

  return {
    top: rect.top + scrollTop - clientTop,
    left: rect.left + scrollLeft - clientLeft
  };
}

export default class AffixFix extends React.Component {

  static propTypes = {
    offsetTop: PropTypes.number,
    offsetBottom: PropTypes.number
  };

  constructor ( props ) {
    super( props );
    this.state = {
      affixStyle: null,
      elemSize: null
    };
  }


  componentDidMount () {
    warning(
      !( 'offset' in this.props ),
      '`offset` prop of Affix is deprecated, use `offsetTop` instead.'
    );
    //console.log(true);
    let win = $(window)
    win.bind('scroll', this.handleScroll)
    win.bind('resize', this.handleScroll)
    //this.scrollEvent = EventHelper.addEvent( window, 'scroll', this.handleScroll );
    //this.resizeEvent = EventHelper.addEvent( window, 'resize', this.handleScroll );
    //this.handleScroll(this);
  }

  componentWillUnmount () {
    let win = $(window)
    win.unbind('scroll', this.handleScroll)
    win.unbind('resize', this.handleScroll)
    //EventHelper.removeEvent(window, 'scroll', this.handleScroll);
    //EventHelper.removeEvent(window, 'resize', this.handleScroll);
    //return;
    /*
    if (this.scrollEvent) {
      this.scrollEvent.remove();
    }
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }*/
  }


  handleScroll = e => {
    //console.log(e);
    let { offsetTop, offsetBottom, offset } = this.props;

    // Backwards support
    offsetTop = offsetTop || offset;

    const scrollTop = getScroll(window, true);
    const scrollLeft = getScroll(window);
    const elem = ReactDOM.findDOMNode(this);
    const elemOffset = getOffset(elem);
    const boxSize = {
      width: elem.offsetWidth,
      height: elem.offsetHeight
    };
    const elemSize = {
      width: ReactDOM.findDOMNode(this.refs.fixedNode).offsetWidth,
      height: ReactDOM.findDOMNode(this.refs.fixedNode).offsetHeight
    };

    const offsetMode = {};
    if (typeof offsetTop !== 'number' && typeof offsetBottom !== 'number') {
      offsetMode.top = true;
      offsetTop = 0;
    } else {
      offsetMode.top = typeof offsetTop === 'number';
      offsetMode.bottom = typeof offsetBottom === 'number';
    }

    if (scrollTop > elemOffset.top - offsetTop && offsetMode.top) {
      // Fixed Top
      // rainx 运行窗口变化改变 left 值
      if ( ( !this.state.affixStyle || elemOffset.left - scrollLeft !== this.state.affixStyle.left ) || e.type==='resize') {
        this.setState({
          affixStyle: {
            position: 'fixed',
            top: offsetTop,
            left: elemOffset.left - scrollLeft,
            width: boxSize.width + 'px'
          },
          elemSize: {
            width: elemSize.width + 'px',
            height: elemSize.height + 'px'
          }
        });
      }
    } else if (scrollTop < elemOffset.top + elemSize.height + offsetBottom - window.innerHeight &&
               offsetMode.bottom) {
      // Fixed Bottom
      // rainx 运行窗口变化改变 left 值
      if (!this.state.affixStyle || e.type==='resize') {
        this.setState({
          affixStyle: {
            position: 'fixed',
            bottom: offsetBottom,
            left: elemOffset.left - scrollLeft,
            width: boxSize.width + 'px'
          },
          elemSize: {
            width: elemSize.width + 'px',
            height: elemSize.height + 'px'
          }
        });
      }
    } else if (this.state.affixStyle) {
      this.setState({
        affixStyle: null,
        elemSize: null
      });
    }
  }

  render() {
    // eslint-disable-next-line
    const { offsetTop, offsetBottom, ...props } = this.props
    const className = classNames({'ant-affix': this.state.affixStyle})
      // rainx 保持原有的占用高度// width: this.state.elemSize.width,
    const size = this.state.elemSize ? {height: this.state.elemSize.height} : {};
    /*
    return (
    <div ref="fixedNode">
      <Affix {...props} offsetTop={64} style={this.state.affixStyle}>
        {this.props.children}
      </Affix>
    </div>)*/
    return (
      <div {...props} style={size}>
        <div className={className} ref="fixedNode" style={this.state.affixStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
