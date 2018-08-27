import React from 'react';
import {  } from 'antd';
import $ from "jquery"
import { withRouter } from 'react-router'
import { Link } from "react-router-dom";
import createStore from '../createStore.js';

import { netdata } from './../../helper'

import png from './img.png'

var 
projectsContainer,
projectsSlider,
singleProjectContent ,
sliderNav ;
var resizing = false;
var translate;
const appsMana = withRouter(class appsMana extends React.Component {
  constructor(props) {
    super(props);
    // 初始化 store
  }
  state = {

  };
  
  componentDidMount(){
    let that =this;
		projectsContainer = $('.cd-projects-wrapper');
    projectsSlider = projectsContainer.children('.cd-slider');
    // projectsSlider = $('.cd-slider');
		singleProjectContent = $('.cd-project-content');
    sliderNav = $('.cd-slider-navigation');
    
    //if on desktop - set a width for the projectsSlider element
    that.setSliderContainer();
    // $(window).on('resize', function(){
    //   //on resize - update projectsSlider width and translate value
    //   if( !resizing ) {
    //     (!window.requestAnimationFrame) ? that.setSliderContainer() : window.requestAnimationFrame(that.setSliderContainer);
    //     resizing = true;
    //   }
    // });
  
  
    //select a single project - open project-content panel
    // projectsContainer.on('click', '.cd-slider a', function(event) {
    //   event.preventDefault();
    //   if( $(this).parent('li').next('li').is('.current') ) {
    //     that.prevSides(projectsSlider);
    //   } else if ( $(this).parent('li').prev('li').prev('li').prev('li').is('.current')) {
    //     that.nextSides(projectsSlider);
    //   }
    // });
  
    // //close single project content
    // singleProjectContent.on('click', '.close', function(event){
    //   event.preventDefault();
    //   singleProjectContent.removeClass('is-visible');
    // });
  
    //go to next/pre slide - clicking on the next/prev arrow
    sliderNav.on('click', '.next', function(){
      that.nextSides(projectsSlider);
    });
    sliderNav.on('click', '.prev', function(){
      that.prevSides(projectsSlider);
    });
  
    //go to next/pre slide - keyboard navigation
    $(document).keyup(function(event){
      if(event.which=='37'  && !(sliderNav.find('.prev').hasClass('inactive')) ) {
        that.prevSides(projectsSlider);
      } else if( event.which=='39'  && !(sliderNav.find('.next').hasClass('inactive')) ) {
        that.nextSides(projectsSlider);
      } else if(event.which=='27' && singleProjectContent.hasClass('is-visible')) {
        singleProjectContent.removeClass('is-visible');
      }
    });
  
    projectsSlider.on('swipeleft', function(){
        console.log(1111111111111111)
      ( !(sliderNav.find('.next').hasClass('inactive')) ) && that.nextSides(projectsSlider);
    });
  
    projectsSlider.on('swiperight', function(){
      ( !(sliderNav.find('.prev').hasClass('inactive')) ) && that.prevSides(projectsSlider);
    });

  };


	setSliderContainer() {
    let that =this;
		var mq =window.getComputedStyle(document.querySelector('.cd-projects-wrapper'), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
    
		if(mq == 'desktop') {
			var	slides = projectsSlider.children('li'),
				slideWidth = slides.eq(0).width(),
				marginLeft = Number(projectsSlider.children('li').eq(1).css('margin-left').replace('px', '')),
				sliderWidth = ( slideWidth + marginLeft )*( slides.length + 1 ) + 'px',
				slideCurrentIndex = projectsSlider.children('li.current').index();
			projectsSlider.css('width', sliderWidth);
			( slideCurrentIndex != 0 ) && that.setTranslateValue(projectsSlider, (  slideCurrentIndex * (slideWidth + marginLeft) + 'px'));
		} else {
			projectsSlider.css('width', '');
			that.setTranslateValue(projectsSlider, 0);
		}
		resizing = false;
	}
  checkMQ() {
		//check if mobile or desktop device
	}
	 nextSides(slider) {
     let that =this;
		var actual = slider.children('.current'),
			index = actual.index(),
			following = actual.nextAll('li').length,
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));

		index = (following > 4 ) ? index + 3 : index + following - 2;
		//calculate the translate value of the slider container
		translate = index * (width + marginLeft) + 'px';

		slider.addClass('next');
		this.setTranslateValue(slider, translate);
		slider.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			that.updateSlider('next', actual, slider, following);
		});

		if( $('.no-csstransitions').length > 0 ) that.updateSlider('next', actual, slider, following);
	}

	 prevSides(slider) {
     let that =this;
		var actual = slider.children('.previous'),
			index = actual.index(),
			width = actual.width(),
			marginLeft = Number(slider.children('li').eq(1).css('margin-left').replace('px', ''));
		// console.log(marginLeft);

		translate = index * (width + marginLeft) + 'px';

		slider.addClass('prev');
		this.setTranslateValue(slider, translate);
		slider.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			that.updateSlider('prev', actual, slider);
		});

		if( $('.no-csstransitions').length > 0 ) that.updateSlider('prev', actual, slider);
	}
	 setTranslateValue(item, translate) {
		item.css({
		    '-moz-transform': 'translateX(-' + translate + ')',
		    '-webkit-transform': 'translateX(-' + translate + ')',
			'-ms-transform': 'translateX(-' + translate + ')',
			'-o-transform': 'translateX(-' + translate + ')',
			'transform': 'translateX(-' + translate + ')',
		});
	}
	updateSlider(direction, actual, slider, numerFollowing) {
		if( direction == 'next' ) {
			slider.removeClass('next').find('.previous').removeClass('previous');
			actual.removeClass('current');
			if( numerFollowing > 4 ) {
				actual.addClass('previous').next('li').next('li').next('li').addClass('current');
			} else if ( numerFollowing == 4 ) {
				actual.next('li').next('li').addClass('current');
				actual.prev('li').addClass('previous');
			} else if( numerFollowing == 3 ) {
				actual.next('li').addClass('current');
				actual.prev('li').prev('li').addClass('previous');
			}
		} else {
			slider.removeClass('prev').find('.current').removeClass('current');
			actual.removeClass('previous').addClass('current');
			if(actual.prevAll('li').length > 2 ) {
				actual.prev('li').prev('li').prev('li').addClass('previous');
			} else {
				( !slider.children('li').eq(0).hasClass('current') ) && slider.children('li').eq(0).addClass('previous');
			}
		}
		
		this.updateNavigation();
  }
  
	 updateNavigation() {
		//update visibility of next/prev buttons according to the visible slides
		var current = projectsContainer.find('li.current');
		(current.is(':first-child')) ? sliderNav.find('.prev').addClass('inactive') : sliderNav.find('.prev').removeClass('inactive');
		(current.nextAll('li').length < 4 ) ? sliderNav.find('.next').addClass('inactive') : sliderNav.find('.next').removeClass('inactive');
	}
  render() {
    return (
      <section id="myebody" className="e-body" style={{ height: window.innerHeight,backgroundColor: "#f6f9fe" }}>
        <div className="my-content" >
        <div className="cd-projects-wrapper projects-visible">
		<ul className="cd-slider">                
         
                  
			<li className="current slides-in"> 
       <Link to="/DisplayBoard"> 
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>设备概览</h2> 
						<p>各类设备的汇总信息.</p>
					</div>
				</a> </Link>
			</li>

			<li className="slides-in">
      <Link to="/NetworkMana"> 
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>设备管理</h2>
						<p>各类型设备参数管理和参数设置.</p>
					</div>
				</a>
        </Link>
			</li>

			<li className="slides-in">
      <Link to="/tree"> 
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>设备添加</h2>
						<p>添加新设备.</p>
					</div>
				</a>
        </Link>
			</li>

			<li className="slides-in">
        <Link to="/onlineHisMana" >
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>在线率历史</h2>
						<p>各区域的在线率历史数据查询.</p>
					</div>
				</a>
        </Link>
			</li>

			<li className="slides-in">
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>GIS地图</h2>
						<p>GIS地图展示终端状态.</p>
					</div>
				</a>
			</li>
{/* 
			<li className="slides-in">
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>统计报表</h2>
						<p>终端分区域布署统计报表.</p>
					</div>
				</a>
			</li> */}

			<li className="slides-in">
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>建设中</h2>
						<p>功能扩展中.</p>
					</div>
				</a>
			</li>
			
			<li className="slides-in">
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>建设中</h2>
						<p>功能扩展中.</p>
					</div>
				</a>
			</li>

			{/* <li className="slides-in">
				<a >
					<img src={png} alt="project image"/>
					<div className="project-info">
						<h2>Project 9</h2>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
					</div>
				</a>
			</li> */}
		</ul>

		<ul className="cd-slider-navigation cd-img-replace">
    <li><a  className="prev inactive">Prev</a></li>
    <li><a  className="next">Next</a></li>
		</ul> 
	</div>




      <style>{`
    
.cd-btn {
  display: inline-block;
  padding: 1.4em 2em;
  border-radius: 50em;
  background-color: #eebb00;
  box-shadow: 0 1px 20px rgba(238, 187, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  -webkit-transition: box-shadow 0.2s;
  -moz-transition: box-shadow 0.2s;
  transition: box-shadow 0.2s;
}
.no-touch .cd-btn:hover {
  box-shadow: 0 1px 30px rgba(238, 187, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.cd-img-replace {
  /* replace text with image */
  color: transparent;
  overflow: hidden;
  text-indent: 100%;
  white-space: nowrap;
}

/* -------------------------------- 

Intro page

-------------------------------- */
.cd-intro-block {
  position: relative;
  z-index: 2;
  height: 100vh;
  width: 100%;
  background-color: #262f3b;
  /* used to vertical align its content */
  display: table;
  -webkit-transition: -webkit-transform 0.5s;
  -moz-transition: -moz-transform 0.5s;
  transition: transform 0.5s;
  -webkit-transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
  -moz-transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
  transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
}
.cd-intro-block::after {
  /* arrow icon visible when .cd-intro-block slides out */
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  bottom: auto;
  right: auto;
  -webkit-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -ms-transform: translateX(-50%) translateY(-50%);
  -o-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  top: 95%;
  height: 24px;
  width: 24px;
  background: url(../img/cd-arrow-back.svg) no-repeat center center;
  opacity: 0;
  -webkit-transition: opacity 0.2s;
  -moz-transition: opacity 0.2s;
  transition: opacity 0.2s;
}
.cd-intro-block .content-wrapper {
  /* vertical align the .cd-intro-block content */
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.cd-intro-block h1 {
  width: 90%;
  margin: 0 auto .6em;
  font-size: 2.4rem;
  color: #ebebeb;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.cd-intro-block.projects-visible {
  /* translate the .cd-intro-block element to reveal the projects slider */
  -webkit-transform: translateY(-90%);
  -moz-transform: translateY(-90%);
  -ms-transform: translateY(-90%);
  -o-transform: translateY(-90%);
  transform: translateY(-90%);
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.6);
  cursor: pointer;
}
.cd-intro-block.projects-visible:after {
  /* show arrow icon */
  opacity: 1;
}
@media only screen and (min-width: 900px) {
  .cd-intro-block::after {
    top: 97.5%;
  }
  .cd-intro-block h1 {
    font-size: 4.4rem;
    font-weight: 300;
  }
  .cd-intro-block.projects-visible {
    -webkit-transform: translateY(-95%);
    -moz-transform: translateY(-95%);
    -ms-transform: translateY(-95%);
    -o-transform: translateY(-95%);
    transform: translateY(-95%);
  }
}

/* -------------------------------- 

Projects Slider

-------------------------------- */
.cd-projects-wrapper {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  background-color: #b7b7b7;
  -webkit-transition: visibility 0s 0.5s;
  -moz-transition: visibility 0s 0.5s;
  transition: visibility 0s 0.5s;
}
.cd-projects-wrapper::before {
  /* never visible - this is used in jQuery to check the current MQ */
  content: 'mobile';
  display: none;
}
.cd-projects-wrapper.projects-visible {
  visibility: visible;
  -webkit-transition: visibility 0s 0s;
  -moz-transition: visibility 0s 0s;
  transition: visibility 0s 0s;
}
@media only screen and (min-width: 900px) {
  .cd-projects-wrapper::before {
    /* never visible - this is used in jQuery to check the current MQ */
    content: 'desktop';
  }
}

.cd-slider {
  padding-top: 10vh;
  height: 100%;
  overflow-y: auto;
}
.projects-visible .cd-slider {
  /* smooth scrolling on iOS */
  -webkit-overflow-scrolling: touch;
}
.cd-slider li {
  margin: 4%;
  opacity: 0;
  border-radius: .25em;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  -webkit-transition: opacity 0s 0.5s;
  -moz-transition: opacity 0s 0.5s;
  transition: opacity 0s 0.5s;
  /* Force hardware acceleration */
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.cd-slider li.slides-in {
  -webkit-transition: opacity 0s 0s;
  -moz-transition: opacity 0s 0s;
  transition: opacity 0s 0s;
  opacity: 1;
  -webkit-animation: cd-translate 0.5s;
  -moz-animation: cd-translate 0.5s;
  animation: cd-translate 0.5s;
}
.cd-slider a {
  display: block;
  height: 100%;
  width: 100%;
}
.cd-slider img {
  display: block;
  border-radius: .25em .25em 0 0;
  width: 100%;
}
.cd-slider .project-info {
  padding: 1em 1.6em;
  background-color: #ebebeb;
  border-radius: 0 0 .25em .25em;
}
.cd-slider h2 {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1.2;
}
.cd-slider p {
  font-size: 0.7rem;
  opacity: .6;
  padding: .3em 0;
  /* truncate text with ellipsis if too long */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cd-slider h2, .cd-slider p {
  line-height: 1.2;
  color: #0f1926;
}
@media only screen and (min-width: 900px) {
  .cd-slider {
    padding: 0;
    overflow: hidden;
    -webkit-transition: -webkit-transform 0.5s;
    -moz-transition: -moz-transform 0.5s;
    transition: transform 0.5s;
    /* Force hardware acceleration */
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .cd-slider::after {
    clear: both;
    content: "";
    display: table;
  }
  .cd-slider li {
    position: relative;
    float: left;
    width: 17vw;
    margin: 0 0 0 3vw;
    top: 50%;
    -webkit-transform: translateX(400%) translateY(-50%) rotate(-10deg);
    -moz-transform: translateX(400%) translateY(-50%) rotate(-10deg);
    -ms-transform: translateX(400%) translateY(-50%) rotate(-10deg);
    -o-transform: translateX(400%) translateY(-50%) rotate(-10deg);
    transform: translateX(400%) translateY(-50%) rotate(-10deg);
    -webkit-transition: opacity 0s 0.3s, -webkit-transform 0s 0.3s;
    -moz-transition: opacity 0s 0.3s, -moz-transform 0s 0.3s;
    transition: opacity 0s 0.3s, transform 0s 0.3s;
  }
  .cd-slider li:first-of-type {
    margin-left: 9vw;
  }
  .cd-slider li.slides-in {
    /* this class is used to trigger the entrance animation */
    -webkit-animation: none;
    -moz-animation: none;
    animation: none;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  .cd-slider li.slides-in:first-of-type {
    /* change transition duration/delay for the entrance animation */
    -webkit-transition: -webkit-transform 0.55s 0s;
    -moz-transition: -moz-transform 0.55s 0s;
    transition: transform 0.55s 0s;
  }
  .cd-slider li.slides-in:nth-of-type(2) {
    -webkit-transition: -webkit-transform 0.53s 0.05s;
    -moz-transition: -moz-transform 0.53s 0.05s;
    transition: transform 0.53s 0.05s;
  }
  .cd-slider li.slides-in:nth-of-type(3) {
    -webkit-transition: -webkit-transform 0.5s 0.1s;
    -moz-transition: -moz-transform 0.5s 0.1s;
    transition: transform 0.5s 0.1s;
  }
  .cd-slider li.slides-in:nth-of-type(4) {
    -webkit-transition: -webkit-transform 0.48s 0.15s;
    -moz-transition: -moz-transform 0.48s 0.15s;
    transition: transform 0.48s 0.15s;
  }
  .cd-slider.next li.current {
    /* next slide animation */
    -webkit-animation: cd-slide-1 0.5s;
    -moz-animation: cd-slide-1 0.5s;
    animation: cd-slide-1 0.5s;
  }
  .cd-slider.next li.current + li {
    -webkit-animation: cd-slide-2 0.5s;
    -moz-animation: cd-slide-2 0.5s;
    animation: cd-slide-2 0.5s;
  }
  .cd-slider.next li.current + li + li {
    -webkit-animation: cd-slide-3 0.5s;
    -moz-animation: cd-slide-3 0.5s;
    animation: cd-slide-3 0.5s;
  }
  .cd-slider.next li.current + li + li + li + li {
    -webkit-animation: cd-slide-4 0.5s;
    -moz-animation: cd-slide-4 0.5s;
    animation: cd-slide-4 0.5s;
  }
  .cd-slider.next li.current + li + li + li + li + li {
    -webkit-animation: cd-slide-5 0.5s;
    -moz-animation: cd-slide-5 0.5s;
    animation: cd-slide-5 0.5s;
  }
  .cd-slider.next li.current + li + li + li + li + li ~ li {
    -webkit-animation: cd-slide-6 0.5s;
    -moz-animation: cd-slide-6 0.5s;
    animation: cd-slide-6 0.5s;
  }
  .cd-slider.prev li {
    /* previous slide animation */
    -webkit-animation: cd-slide-7 0.5s;
    -moz-animation: cd-slide-7 0.5s;
    animation: cd-slide-7 0.5s;
  }
  .cd-slider.prev li.previous {
    /* previous slide animation - the previous class is used to target the slide which was visible right before the current one */
    -webkit-animation: cd-slide-1 0.5s;
    -moz-animation: cd-slide-1 0.5s;
    animation: cd-slide-1 0.5s;
  }
  .cd-slider.prev li.previous + li {
    -webkit-animation: cd-slide-2 0.5s;
    -moz-animation: cd-slide-2 0.5s;
    animation: cd-slide-2 0.5s;
  }
  .cd-slider.prev li.previous + li + li {
    -webkit-animation: cd-slide-3 0.5s;
    -moz-animation: cd-slide-3 0.5s;
    animation: cd-slide-3 0.5s;
  }
  .cd-slider.prev li.current + li {
    -webkit-animation: cd-slide-4 0.5s;
    -moz-animation: cd-slide-4 0.5s;
    animation: cd-slide-4 0.5s;
  }
  .cd-slider.prev li.current + li + li {
    -webkit-animation: cd-slide-5 0.5s;
    -moz-animation: cd-slide-5 0.5s;
    animation: cd-slide-5 0.5s;
  }
  .cd-slider.prev li.current, .cd-slider.prev li.current + li + li ~ li {
    -webkit-animation: none;
    -moz-animation: none;
    animation: none;
  }
}

@-webkit-keyframes cd-slide-1 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-85%);
  }
}
@-moz-keyframes cd-slide-1 {
  0%, 100% {
    -moz-transform: translateY(-50%);
  }
  50% {
    -moz-transform: translateY(-50%) translateX(-85%);
  }
}
@keyframes cd-slide-1 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-85%);
    -moz-transform: translateY(-50%) translateX(-85%);
    -ms-transform: translateY(-50%) translateX(-85%);
    -o-transform: translateY(-50%) translateX(-85%);
    transform: translateY(-50%) translateX(-85%);
  }
}
@-webkit-keyframes cd-slide-2 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-55%);
  }
}
@-moz-keyframes cd-slide-2 {
  0%, 100% {
    -moz-transform: translateY(-50%);
  }
  50% {
    -moz-transform: translateY(-50%) translateX(-55%);
  }
}
@keyframes cd-slide-2 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-55%);
    -moz-transform: translateY(-50%) translateX(-55%);
    -ms-transform: translateY(-50%) translateX(-55%);
    -o-transform: translateY(-50%) translateX(-55%);
    transform: translateY(-50%) translateX(-55%);
  }
}
@-webkit-keyframes cd-slide-3 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-23%);
  }
}
@-moz-keyframes cd-slide-3 {
  0%, 100% {
    -moz-transform: translateY(-50%);
  }
  50% {
    -moz-transform: translateY(-50%) translateX(-23%);
  }
}
@keyframes cd-slide-3 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-23%);
    -moz-transform: translateY(-50%) translateX(-23%);
    -ms-transform: translateY(-50%) translateX(-23%);
    -o-transform: translateY(-50%) translateX(-23%);
    transform: translateY(-50%) translateX(-23%);
  }
}
@-webkit-keyframes cd-slide-4 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(23%);
  }
}
@-moz-keyframes cd-slide-4 {
  0%, 100% {
    -moz-transform: translateY(-50%);
  }
  50% {
    -moz-transform: translateY(-50%) translateX(23%);
  }
}
@keyframes cd-slide-4 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(23%);
    -moz-transform: translateY(-50%) translateX(23%);
    -ms-transform: translateY(-50%) translateX(23%);
    -o-transform: translateY(-50%) translateX(23%);
    transform: translateY(-50%) translateX(23%);
  }
}
@-webkit-keyframes cd-slide-5 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(55%);
  }
}
@-moz-keyframes cd-slide-5 {
  0%, 100% {
    -moz-transform: translateY(-50%);
  }
  50% {
    -moz-transform: translateY(-50%) translateX(55%);
  }
}
@keyframes cd-slide-5 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(55%);
    -moz-transform: translateY(-50%) translateX(55%);
    -ms-transform: translateY(-50%) translateX(55%);
    -o-transform: translateY(-50%) translateX(55%);
    transform: translateY(-50%) translateX(55%);
  }
}
@-webkit-keyframes cd-slide-6 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(65%);
  }
}
@-moz-keyframes cd-slide-6 {
  0%, 100% {
    -moz-transform: translateY(-50%);
  }
  50% {
    -moz-transform: translateY(-50%) translateX(65%);
  }
}
@keyframes cd-slide-6 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(65%);
    -moz-transform: translateY(-50%) translateX(65%);
    -ms-transform: translateY(-50%) translateX(65%);
    -o-transform: translateY(-50%) translateX(65%);
    transform: translateY(-50%) translateX(65%);
  }
}
@-webkit-keyframes cd-slide-7 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-95%);
  }
}
@-moz-keyframes cd-slide-7 {
  0%, 100% {
    -moz-transform: translateY(-50%);
  }
  50% {
    -moz-transform: translateY(-50%) translateX(-95%);
  }
}
@keyframes cd-slide-7 {
  0%, 100% {
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }
  50% {
    -webkit-transform: translateY(-50%) translateX(-95%);
    -moz-transform: translateY(-50%) translateX(-95%);
    -ms-transform: translateY(-50%) translateX(-95%);
    -o-transform: translateY(-50%) translateX(-95%);
    transform: translateY(-50%) translateX(-95%);
  }
}
/* -------------------------------- 

Project slider navigation

-------------------------------- */
.cd-slider-navigation {
  display: none;
}
.cd-slider-navigation a {
  position: absolute;
  top: 50%;
  bottom: auto;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  left: 0;
  height: 60px;
  width: 4%;
  background: url(${require("./cd-arrow.svg")})  no-repeat center center;
  -webkit-transition: opacity 0.2s 0s, visibility 0s 0s;
  -moz-transition: opacity 0.2s 0s, visibility 0s 0s;
  transition: opacity 0.2s 0s, visibility 0s 0s;
}
.cd-slider-navigation a.next {
  right: 0;
  left: auto;
}
.cd-slider-navigation a.prev {
  -webkit-transform: translateY(-50%) rotate(180deg);
  -moz-transform: translateY(-50%) rotate(180deg);
  -ms-transform: translateY(-50%) rotate(180deg);
  -o-transform: translateY(-50%) rotate(180deg);
  transform: translateY(-50%) rotate(180deg);
}
.cd-slider-navigation a.inactive {
  visibility: hidden;
  opacity: 0;
  -webkit-transition: opacity 0.2s 0s, visibility 0s 0.2s;
  -moz-transition: opacity 0.2s 0s, visibility 0s 0.2s;
  transition: opacity 0.2s 0s, visibility 0s 0.2s;
}
@media only screen and (min-width: 900px) {
  .cd-slider-navigation {
    display: block;
  }
}

/* -------------------------------- 

Project content panel 

-------------------------------- */
.cd-project-content {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
  background-color: #ebebeb;
  /* Force Hardware Acceleration */
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: translateY(100%);
  -moz-transform: translateY(100%);
  -ms-transform: translateY(100%);
  -o-transform: translateY(100%);
  transform: translateY(100%);
  -webkit-transition: -webkit-transform 0.4s 0s, visibility 0s 0.4s;
  -moz-transition: -moz-transform 0.4s 0s, visibility 0s 0.4s;
  transition: transform 0.4s 0s, visibility 0s 0.4s;
  -webkit-transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
  -moz-transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
  transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
}
.cd-project-content > div {
  height: 100%;
  overflow-y: auto;
  padding: 4em 2em;
}
.cd-project-content > div > * {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.cd-project-content.is-visible {
  visibility: visible;
  -webkit-transform: translateY(0);
  -moz-transform: translateY(0);
  -ms-transform: translateY(0);
  -o-transform: translateY(0);
  transform: translateY(0);
  -webkit-transition: -webkit-transform 0.4s 0s, visibility 0s 0s;
  -moz-transition: -moz-transform 0.4s 0s, visibility 0s 0s;
  transition: transform 0.4s 0s, visibility 0s 0s;
  -webkit-transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
  -moz-transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
  transition-timing-function: cubic-bezier(0.67, 0.15, 0.83, 0.83);
}
.cd-project-content.is-visible > div {
  /* smooth scrolling on iOS */
  -webkit-overflow-scrolling: touch;
}
.cd-project-content h2 {
  font-size: 2.4rem;
  font-weight: bold;
}
.cd-project-content em {
  display: block;
  font-size: 1.8rem;
  font-style: italic;
  margin: 1em auto;
}
.cd-project-content p {
  margin-bottom: 1em;
  font-size: 1.4rem;
  color: #6f757c;
}
.cd-project-content em, .cd-project-content p {
  line-height: 1.6;
}
.cd-project-content .close {
  display: block;
  height: 32px;
  width: 32px;
  position: absolute;
  top: 10px;
  right: 10px;
  background: url(../img/cd-close-dark.svg) no-repeat center center;
}
@media only screen and (min-width: 900px) {
  .cd-project-content h2 {
    font-size: 6rem;
  }
  .cd-project-content em {
    font-size: 2.4rem;
  }
  .cd-project-content p {
    font-size: 1.8rem;
  }
  .cd-project-content .close {
    top: 30px;
    right: 5%;
  }
}

/* -------------------------------- 

Keyframes

-------------------------------- */
@-webkit-keyframes cd-translate {
  0% {
    opacity: 0;
    -webkit-transform: translateY(100px);
  }
  100% {
    -webkit-transform: translateY(0);
    opacity: 1;
  }
}
@-moz-keyframes cd-translate {
  0% {
    opacity: 0;
    -moz-transform: translateY(100px);
  }
  100% {
    -moz-transform: translateY(0);
    opacity: 1;
  }
}
@keyframes cd-translate {
  0% {
    opacity: 0;
    -webkit-transform: translateY(100px);
    -moz-transform: translateY(100px);
    -ms-transform: translateY(100px);
    -o-transform: translateY(100px);
    transform: translateY(100px);
  }
  100% {
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    -o-transform: translateY(0);
    transform: translateY(0);
    opacity: 1;
  }
}


h2,p{
		margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
        
        
        
        `}</style>



        </div>
      </section>

    )
  }

}
)
export default appsMana;