//'use strict';

import React from 'react'
import { Radio } from 'antd';

import L from 'leaflet'
//import './leaflet-baidu'
import './leaflet.ChineseTmsProviders'
import 'leaflet-draw'
//import 'leaflet.measurecontrol'
import './ControlZoomslider/L.Control.Zoomslider'
import './ControlPan/L.Control.Pan'
import './LinearMeasurement/Leaflet.LinearMeasurement'

import './ControlZoomslider/L.Control.Zoomslider.css'
import './ControlPan/L.Control.Pan.css'
import './LinearMeasurement/Leaflet.LinearMeasurement.css'
import './Leaflet.Control.Custom.js'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import {netdata} from './../../../helper';
import imd from "./icon.gif"
import green from "./green.gif"
import red from "./red.gif"
//import './ControlPan/L.Control.Pan.ie.css'
import $ from 'jquery'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let cost_underground = 12.55;
let cost_above_ground = 17.89;
let map;
let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const mapid = 'map_srcpagemapindexjs'

// let myIcon = L.icon({
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   tooltipAnchor: [16, -28],
//   shadowSize: [41, 41]
// });


let myIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
var LeafIcon = L.Icon.extend({
  options: {
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      // iconSize:     [60, 60],
      shadowSize:   [0, 0],
      iconAnchor:   [25,25],
      shadowAnchor: [0,0],
      popupAnchor:  [0, 0]
  }
  });
var TTIcon = new LeafIcon({iconUrl:imd});
var greenIcon = new LeafIcon({iconUrl:green});
var redIcon = new LeafIcon({iconUrl:red});
//center: [31.207391, 121.608203],
// let options = {
//   //crs: L.CRS.EPSGB3857,
//   attributionControl: false,
//   panControl: false,
//   zoomsliderControl: false,
//   zoomControl: false,
//   center: [31.5, 120.3],
//   zoom: 14,
//   minZoom: 11,
//   maxZoom: 15,
//   maxBounds: [[31.9, 120], [31.3, 120.6]]
// };
let options;
//  {
//   //crs: L.CRS.EPSGB3857,
  // attributionControl: false,
  // panControl: false,
  // zoomsliderControl: false,
  // zoomControl: false,
  // center: [39.215745, 118.506512],
  // zoom: 12,
  // minZoom: 11,
  // maxZoom: 16,
  // maxBounds: [[39.551558, 118.157640], [38.876986, 118.993974]]
// };
/*
  googlelite: new L.TileLayer.BaiduLayer("CustomStyle.Map.googlelite"),
  grassgreen: new L.TileLayer.BaiduLayer("CustomStyle.Map.grassgreen"),
  midnight: new L.TileLayer.BaiduLayer("CustomStyle.Map.midnight"),
  pink: new L.TileLayer.BaiduLayer("CustomStyle.Map.pink"),
  darkgreen: new L.TileLayer.BaiduLayer("CustomStyle.Map.darkgreen"),
  bluish: new L.TileLayer.BaiduLayer("CustomStyle.Map.bluish"),
  grayscale: new L.TileLayer.BaiduLayer("CustomStyle.Map.grayscale"),
  hardedge: new L.TileLayer.BaiduLayer("CustomStyle.Map.hardedge"),*/
let normalMap = L.tileLayer.chinaProvider('LocalG.Normal.Map', {
  crs: L.CRS.EPSG3857,
  maxZoom: 18,
  minZoom: 5
})
let satelliteMap = L.tileLayer.chinaProvider('LocalG.Satellite.Map', {
  maxZoom: 18,
  minZoom: 5
});
let satelliteRoad = L.tileLayer.chinaProvider('LocalG.Satellite.Road', {
  maxZoom: 18,
  minZoom: 5
});
let g2 = L.layerGroup([satelliteMap, satelliteRoad]);
let baseMaps = {
  "卫星地图": g2,
  "本地地图": normalMap,
  "高德": L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
    crs: L.CRS.EPSG3857,
    maxZoom: 18,
    minZoom: 5
  })
  /*,
  satellite: new L.TileLayer.BaiduLayer("Satellite.Map"),
  road: new L.TileLayer.BaiduLayer("Satellite.Road"),
  cnormal: new L.TileLayer.BaiduLayer("CustomStyle.Map.normal"),
  light: new L.TileLayer.BaiduLayer("CustomStyle.Map.light"),
  dark: new L.TileLayer.BaiduLayer("CustomStyle.Map.dark"),
  redalert: new L.TileLayer.BaiduLayer("CustomStyle.Map.redalert"),
  grayscale: new L.TileLayer.BaiduLayer("CustomStyle.Map.grayscale"),

  mysytle: new L.TileLayer.BaiduLayer("CustomStyle.Map", {styles: 't%3Abuilding%7Ce%3Ag%7Cc%3A%23cccccc%2Ct%3Aroad%7Ce%3Aall%7Cc%3A%23999999%2Ct%3Aland%7Ce%3Aall%7Cc%3A%2376a5af%2Ct%3Agreen%7Ce%3Aall%7Cc%3A%236aa84f%2Ct%3Amanmade%7Ce%3Aall%7Cc%3A%23eeeeee%2Ct%3Aboundary%7Ce%3Aall%7Cc%3A%23444444'})*/
};
let clayer = "本地地图"
let layerinit = () => {
  if (baseMaps[clayer] === undefined) {
    clayer = "卫星地图"
    options.layers[0] = normalMap
  }
  else {
    options.layers[0] = baseMaps[clayer]
  }
}
let NameToCrs = () => {
  if (clayer === 'baidu') {
    return L.CRS.EPSG3857
  } else {
    return L.CRS.EPSG3857
  }
}
let markers = null;
let markers2 = null;
let oneCorner = null;
let twoCorner = null; 
let Range = null;
const mrks = [];
const mrksarr ={};
let selmrks = [];
var mystore =null;
let markerDic=[];
class Mapbox extends React.Component {
    constructor(props) {
    super(props);
    }
    state ={}
    renderMarkers = (data) => {
          if(data.length === 0)
            return '';
          for(let i=0;i<data.length;i++){
            if(data[i].eocT == 1){
              markerDic[data[i].id]=data[i]
            }
            if (data[i].children.length !== 0) {
              this.renderMarkers(data[i].children);
            }
          }
        }
        rendermarker(devicesList){
          let that =this;
          for(let dd in devicesList["dev1"]){
            if(devicesList["dev1"][dd].latitude==""){
    
            }
            else{
               let lat =parseFloat(devicesList["dev1"][dd].latitude);
               let lng =parseFloat(devicesList["dev1"][dd].longitude);
               let id =devicesList["dev1"][dd].desc;
               let logicaddr =devicesList["dev1"][dd].logicaddr;
               let NetManageIp =devicesList["dev1"][dd].NetManageIp;
               let ReadStr =devicesList["dev1"][dd].ReadStr;
               let WriteStr =devicesList["dev1"][dd].WriteStr;
             // let lat =31.501287521196705;
             // let lng =120.28106689453126;
             let icontag;
                switch (devicesList["dev1"][dd].state) {
                  case 0:
                    icontag=greenIcon;
                    break;
                  case 4:
                   icontag=redIcon;
                    break;   
                  case 32:
                    icontag=TTIcon;
                    break;         
                  default:
                    break;
                }
             if(!isNaN(devicesList["dev1"][dd].latitude)){
              let marker = L.marker([lat ,lng ], { icon: icontag }).on('click', function(e) {
                   that.props.devitemClick(devicesList["dev1"][dd].id,id,devicesList["dev1"][dd].state,"f1")
              }).on("mouseover",function(e){
                this.openPopup();

              }).on("mouseout",function(e){
                this.closePopup();

              })
              .bindPopup('<div class="device__item"><div class="device__deco"><svg class="device__deco-img"version="1.1"id="Layer_1"preserveAspectRatio="none"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"width="300px"height="100px"viewBox="0 0 300 100"enable-background="new 0 0 300 100"xml:space="preserve"><path class="deco-layer deco-layer--1"opacity="0.6"fill="#FFFFFF"d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z"/><path class="deco-layer deco-layer--2"opacity="0.6"fill="#FFFFFF"d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z"/><path class="deco-layer deco-layer--3"opacity="0.7"fill="#FFFFFF"d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z"/><path class="deco-layer deco-layer--4"fill="#FFFFFF"d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z"/></svg><div class="device__price">'+id+'</div><h3 class="device__title">'+logicaddr+'</h3></div><ul class="device__feature-list"><li class="device__feature">设备类型：音柱</li><li class="device__feature">写社区串：'+WriteStr+'</li><li class="device__feature">读社区串：'+ReadStr+'</li><li class="device__feature">IP地址：'+NetManageIp+'</li></ul></div>');
              markers.addLayer(marker);
       
             }
          
            }
         }
         for(let dd in devicesList["dev2"]){
          if(devicesList["dev2"][dd].latitude==""){
    
          }
          else{
             let lat =parseFloat(devicesList["dev2"][dd].latitude);
             let lng =parseFloat(devicesList["dev2"][dd].longitude);
             let id =devicesList["dev2"][dd].desc;
             let logicaddr =devicesList["dev2"][dd].logicaddr;
    
    
             let NetManageIp =devicesList["dev2"][dd].NetManageIp;
             let ReadStr =devicesList["dev2"][dd].ReadStr;
             let WriteStr =devicesList["dev2"][dd].WriteStr;
           // let lat =31.501287521196705;
           // let lng =120.28106689453126;
           let icontag;
           switch (devicesList["dev2"][dd].state) {
             case 0:
               icontag=greenIcon;
               break;
             case 4:
              icontag=redIcon;
               break;   
             case 32:
               icontag=TTIcon;
               break;         
             default:
               break;
           }
           if(!isNaN(devicesList["dev2"][dd].latitude)){
             //  let marker = L.marker([lat ,lng ], { icon: myIcon }).bindPopup("<h2 >"+id+"</h2>("+logicaddr+")"+'<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">正常</span></span>');
             let marker = L.marker([lat ,lng ], { icon: icontag }).on('click', function(e) {
              that.props.devitemClick(devicesList["dev2"][dd].id,id,devicesList["dev2"][dd].state,"f2")
         }).on("mouseover",function(e){
           this.openPopup();

         }).on("mouseout",function(e){
           this.closePopup();

         }).bindPopup('<div class="device__item"><div class="device__deco"><svg class="device__deco-img"version="1.1"id="Layer_1"preserveAspectRatio="none"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"width="300px"height="100px"viewBox="0 0 300 100"enable-background="new 0 0 300 100"xml:space="preserve"><path class="deco-layer deco-layer--1"opacity="0.6"fill="#FFFFFF"d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z"/><path class="deco-layer deco-layer--2"opacity="0.6"fill="#FFFFFF"d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z"/><path class="deco-layer deco-layer--3"opacity="0.7"fill="#FFFFFF"d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z"/><path class="deco-layer deco-layer--4"fill="#FFFFFF"d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z"/></svg><div class="device__price">'+id+'</div><h3 class="device__title">'+logicaddr+'</h3></div><ul class="device__feature-list"><li class="device__feature">设备类型：多路语音合成器</li><li class="device__feature">写社区串：'+WriteStr+'</li><li class="device__feature">读社区串：'+ReadStr+'</li><li class="device__feature">IP地址：'+NetManageIp+'</li></ul></div>');
             markers.addLayer(marker);
     
           }
        
          }
       }
       for(let dd in devicesList["dev3"]){
        if(devicesList["dev3"][dd].latitude==""){
    
        }
        else{
           let lat =parseFloat(devicesList["dev3"][dd].latitude);
           let lng =parseFloat(devicesList["dev3"][dd].longitude);
           let id =devicesList["dev3"][dd].desc;
           let logicaddr =devicesList["dev3"][dd].logicaddr;
      
    
           let NetManageIp =devicesList["dev3"][dd].NetManageIp;
           let ReadStr =devicesList["dev3"][dd].ReadStr;
           let WriteStr =devicesList["dev3"][dd].WriteStr;
           let icontag;
           switch (devicesList["dev3"][dd].state) {
             case 0:
               icontag=greenIcon;
               break;
             case 4:
              icontag=redIcon;
               break;   
             case 32:
               icontag=TTIcon;
               break;         
             default:
               break;
           }
         if(!isNaN(devicesList["dev3"][dd].latitude)){
           //  let marker = L.marker([lat ,lng ], { icon: myIcon }).bindPopup("<h2 >"+id+"</h2>("+logicaddr+")"+'<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">正常</span></span>');
           let marker = L.marker([lat ,lng ], { icon: icontag }).on('click', function(e) {
            that.props.devitemClick(devicesList["dev3"][dd].id,id,devicesList["dev3"][dd].state,"f3")
       }).on("mouseover",function(e){
         this.openPopup();

       }).on("mouseout",function(e){
         this.closePopup();

       }).bindPopup('<div class="device__item"><div class="device__deco"><svg class="device__deco-img"version="1.1"id="Layer_1"preserveAspectRatio="none"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"width="300px"height="100px"viewBox="0 0 300 100"enable-background="new 0 0 300 100"xml:space="preserve"><path class="deco-layer deco-layer--1"opacity="0.6"fill="#FFFFFF"d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z"/><path class="deco-layer deco-layer--2"opacity="0.6"fill="#FFFFFF"d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z"/><path class="deco-layer deco-layer--3"opacity="0.7"fill="#FFFFFF"d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z"/><path class="deco-layer deco-layer--4"fill="#FFFFFF"d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z"/></svg><div class="device__price">'+id+'</div><h3 class="device__title">'+logicaddr+'</h3></div><ul class="device__feature-list"><li class="device__feature">设备类型：短信网关</li><li class="device__feature">写社区串：'+WriteStr+'</li><li class="device__feature">读社区串：'+ReadStr+'</li><li class="device__feature">IP地址：'+NetManageIp+'</li></ul></div>');
           markers.addLayer(marker);
    
         }
      
        }
     }
     for(let dd in devicesList["dev4"]){
      if(devicesList["dev4"][dd].latitude==""){
    
      }
      else{
         let lat =parseFloat(devicesList["dev4"][dd].latitude);
         let lng =parseFloat(devicesList["dev4"][dd].longitude);
         let id =devicesList["dev4"][dd].desc;
         let logicaddr =devicesList["dev4"][dd].logicaddr;
    
    
         let NetManageIp =devicesList["dev4"][dd].NetManageIp;
         let ReadStr =devicesList["dev4"][dd].ReadStr;
         let WriteStr =devicesList["dev4"][dd].WriteStr;
         let icontag;
         switch (devicesList["dev4"][dd].state) {
           case 0:
             icontag=greenIcon;
             break;
           case 4:
            icontag=redIcon;
             break;   
           case 32:
             icontag=TTIcon;
             break;         
           default:
             break;
         }
       if(!isNaN(devicesList["dev4"][dd].latitude)){
         //  let marker = L.marker([lat ,lng ], { icon: myIcon }).bindPopup("<h2 >"+id+"</h2>("+logicaddr+")"+'<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">正常</span></span>');
         let marker = L.marker([lat ,lng ], { icon: icontag }).on('click', function(e) {
          that.props.devitemClick(devicesList["dev4"][dd].id,id,devicesList["dev4"][dd].state,"f4")
     }).on("mouseover",function(e){
       this.openPopup();

     }).on("mouseout",function(e){
       this.closePopup();

     }).bindPopup('<div class="device__item"><div class="device__deco"><svg class="device__deco-img"version="1.1"id="Layer_1"preserveAspectRatio="none"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"width="300px"height="100px"viewBox="0 0 300 100"enable-background="new 0 0 300 100"xml:space="preserve"><path class="deco-layer deco-layer--1"opacity="0.6"fill="#FFFFFF"d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z"/><path class="deco-layer deco-layer--2"opacity="0.6"fill="#FFFFFF"d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z"/><path class="deco-layer deco-layer--3"opacity="0.7"fill="#FFFFFF"d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z"/><path class="deco-layer deco-layer--4"fill="#FFFFFF"d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z"/></svg><div class="device__price">'+id+'</div><h3 class="device__title">'+logicaddr+'</h3></div><ul class="device__feature-list"><li class="device__feature">设备类型：数字编码控制器</li><li class="device__feature">写社区串：'+WriteStr+'</li><li class="device__feature">读社区串：'+ReadStr+'</li><li class="device__feature">IP地址：'+NetManageIp+'</li></ul></div>');
         markers.addLayer(marker);
    
       }
    
      }
    }
    for(let dd in devicesList["dev5"]){
      if(devicesList["dev5"][dd].latitude==""){
    
      }
      else{
         let lat =parseFloat(devicesList["dev5"][dd].latitude);
         let lng =parseFloat(devicesList["dev5"][dd].longitude);
         let id =devicesList["dev5"][dd].desc;
         let logicaddr =devicesList["dev5"][dd].logicaddr;
     
    
         let NetManageIp =devicesList["dev5"][dd].NetManageIp;
         let ReadStr =devicesList["dev5"][dd].ReadStr;
         let WriteStr =devicesList["dev5"][dd].WriteStr;
         let icontag;
         switch (devicesList["dev5"][dd].state) {
           case 0:
             icontag=greenIcon;
             break;
           case 4:
            icontag=redIcon;
             break;   
           case 32:
             icontag=TTIcon;
             break;         
           default:
             break;
         }
       if(!isNaN(devicesList["dev5"][dd].latitude)){
         //  let marker = L.marker([lat ,lng ], { icon: myIcon }).bindPopup("<h2 >"+id+"</h2>("+logicaddr+")"+'<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">正常</span></span>');
         let marker = L.marker([lat ,lng ], { icon: icontag }).on('click', function(e) {
          that.props.devitemClick(devicesList["dev5"][dd].id,id,devicesList["dev5"][dd].state,"f5")
     }).on("mouseover",function(e){
       this.openPopup();

     }).on("mouseout",function(e){
       this.closePopup();

     }).bindPopup('<div class="device__item"><div class="device__deco"><svg class="device__deco-img"version="1.1"id="Layer_1"preserveAspectRatio="none"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"width="300px"height="100px"viewBox="0 0 300 100"enable-background="new 0 0 300 100"xml:space="preserve"><path class="deco-layer deco-layer--1"opacity="0.6"fill="#FFFFFF"d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z"/><path class="deco-layer deco-layer--2"opacity="0.6"fill="#FFFFFF"d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z"/><path class="deco-layer deco-layer--3"opacity="0.7"fill="#FFFFFF"d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z"/><path class="deco-layer deco-layer--4"fill="#FFFFFF"d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z"/></svg><div class="device__price">'+id+'</div><h3 class="device__title">'+logicaddr+'</h3></div><ul class="device__feature-list"><li class="device__feature">设备类型：播控机</li><li class="device__feature">写社区串：'+WriteStr+'</li><li class="device__feature">读社区串：'+ReadStr+'</li><li class="device__feature">IP地址：'+NetManageIp+'</li></ul></div>');
         
        markers.addLayer(marker);
    
       }
    
      }
    }


    map.addLayer(markers); 

        }
  componentDidMount() {
    // layerinit();
    options =JSON.parse(localStorage.options)
    options.layers = [baseMaps["本地地图"]];
    options.crs = NameToCrs()
    map = L.map(mapid, options);
    markers = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius : 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });
    let dlist= this.props.store.getState();
    markers.clearLayers();
    this.rendermarker(dlist.devicesList);
    // mystore =this.props.store;
    this.props.store.subscribe(() => { 
      const { devicesList } = this.props.store.getState();
      if(this.map != null)
  {    markers.clearLayers();
      this.rendermarker(devicesList);}
        // for(let i=0;i<mrksarr.length;i++){
        //   markers.addLayer(mrksarr[i]);
        // }
        // map.addLayer(markers); 

    });
    // layerinit();

    // // options.crs = NameToCrs()
    // console.log("options",options)
    // let map = L.map(mapid, options);
    // L.control.pan({position: 'topright'}).addTo(map);
    // L.control.zoomslider({position: 'topright'}).addTo(map);
    // L.control.attribution({ prefix: false }).addTo(map);

    L.control.custom({
      position: 'topleft',
      content: '<ul><li class="lendli"><div class="orderLend"><span class="lend" style="background-color:  rgb(46, 174, 89);"></span>在线</div></li><li class="lendli"><div class="orderLend"><span class="lend" style="background-color:  rgb(229, 23, 23);"></span>离线</div></li><li class="lendli"><div class="orderLend"><span class="lend" style="background-color:  rgb(16, 142, 233);"></span>广播中</div></li></ul>',
      classes: '',
      style:
      {
        margin: '10px',
        padding: '0px 0px 0 0',
        cursor: 'pointer',
      },
      datas:
      {
        'foo': 'bar',
      },
      events:
      {
      }
    }).addTo(map);
    let old = options.crs
    map.on('baselayerchange', function (e) {
      clayer = e.name
      let n
      if (e.name === 'baidu') {
        n = L.CRS.EPSGB3857
      } else {
        n = L.CRS.EPSG3857
      }
      if (old === n) {
        return
      }
      old = n
      let c = map.getCenter()
      let z = map.getZoom()
      map.options.crs = old
      map.setView(c, z)
    });



    
   this.map = map;


  }
  componentWillUnmount() {
    //L.control.layers(baseMaps, overlayMaps).removeFrom(this.map);
    this.map.remove();
    this.map = null;

  }

  render() {
    return <div id={mapid} style={{ height: '100%' }} >
      <style>{`
      img.leaflet-marker-icon.leaflet-zoom-animated.leaflet-interactive{
        animation: run 0.6s steps(12) infinite;
      }

      @keyframes run {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100px 0; // 12帧
  }
}

		.device__item {
    font-family: "Nunito", sans-serif;
    cursor: default;
    color: #84697c;
    background: #fff;
    box-shadow: 0 0 10px rgba(46, 59, 125, 0.23);
    border-radius: 20px 20px 10px 10px;
    text-align: center;
    width: 301px
}
.device__deco {
    border-radius: 10px 10px 0 0;
    background: #7a90ff;
    padding: 2em 0 5em;
    position: relative;
}
.device__deco-img {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 55px;
}
.device__price {
    font-size: 2em;
    font-weight: bold;
    padding: 0;
    color: #fff;
    margin: 0 0 0.25em 0;
    line-height: 0.75;
}
.device__title {
    font-size: 0.75em;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 5px;
    color: #ffd5bd;
}
.device__feature-list {
    margin: 0;
    padding: 0.25em 0 1.5em;
    list-style: none;
    text-align: center;
}
.device__feature {
    padding: 0.3em 0;
}


#resizediv2 .leaflet-popup-content-wrapper{
	    background: transparent;
    color: #333;
    -webkit-box-shadow: none;
    box-shadow: none;
	
}
#resizediv2 .leaflet-popup-content {
    margin: 0 19px;
    line-height: 1.4;
}
.orderLend .lend {
    border-radius: 3px;
    margin-right: 5px;
    display: inline-block;
    height: 14px;
    width: 16px;
    vertical-align: -2px;
}
.lendli{
  margin-bottom: 3px;
}
#resizediv2 .leaflet-top, .leaflet-bottom {
    z-index: 999;
}

        `}</style>
    </div>
  }
}
export default Mapbox;