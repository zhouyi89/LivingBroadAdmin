//'use strict';

import React from 'react'
import { Radio,notification } from 'antd';
import ReactDOM from 'react-dom';
// import Hls from 'hls.js'
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
// import ReactHLS from 'react-hls';
import 'leaflet.pm';
import 'leaflet.pm/dist/leaflet.pm.css';  


import './dist/leaflet.awesome-markers.js'
import './dist/leaflet.awesome-markers.css'
// import './dist/Leaflet.Photo.js'
// import './dist/Leaflet.Photo.css'
import './dist/leaflet-search.js'
import './dist/leaflet-search.css'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import {netdata} from './../../../helper';
import imd from "./icon.gif"
// import gifphoto from "./dist/testphoto.gif"
//import './ControlPan/L.Control.Pan.ie.css'
import $ from 'jquery'
import './dist/leaflet.migrationLayer.js'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let cost_underground = 12.55;
let cost_above_ground = 17.89;

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

var redMarker = L.AwesomeMarkers.icon({
  icon: 'star',
  prefix:'fa',
  spin:false,
  markerColor: 'orange', iconColor: 'black'
});
var greenMarker = L.AwesomeMarkers.icon({
  icon: 'star',
  prefix:'fa',
  spin:false,
  markerColor: 'blue', iconColor: 'white'
});

var darkredMarker = L.AwesomeMarkers.icon({
  icon: 'home',
  prefix:'fa',
  spin:false,
  markerColor: 'darkred', iconColor: 'white'
});

///+++++++++++++   leafletphoto,js
// L.Photo = L.FeatureGroup.extend({
// 	options: {
// 		icon: {						
// 			iconSize: [40, 40]
// 		}
// 	},

// 	initialize: function (photos, options) {
// 		L.setOptions(this, options);
// 		L.FeatureGroup.prototype.initialize.call(this, photos);
// 	},

// 	addLayers: function (photos) {
// 		if (photos) {
// 			for (var i = 0, len = photos.length; i < len; i++) {
// 				this.addLayer(photos[i]);
// 			}
// 		}
// 		return this;
// 	},

// 	addLayer: function (photo) {	
// 		L.FeatureGroup.prototype.addLayer.call(this, this.createMarker(photo));
// 	},

// 	createMarker: function (photo) {
// 		var marker = L.marker(photo, {
// 			icon: L.divIcon(L.extend({
// 				html: '<div style="background-image: url(' + photo.thumbnail + ');"></div>​',
// 				className: 'leaflet-marker-photo'
// 			}, photo, this.options.icon)),
// 			title: photo.caption || ''
// 		});		
// 		marker.photo = photo;
// 		return marker;
// 	}
// });

// L.photo = function (photos, options) {
// 	return new L.Photo(photos, options);
// };

// if (L.MarkerClusterGroup) {

// 	L.Photo.Cluster = L.MarkerClusterGroup.extend({
// 		options: {
// 			featureGroup: L.photo,		
// 			maxClusterRadius: 100,		
// 			showCoverageOnHover: false,
// 			iconCreateFunction: function(cluster) {
// 				return new L.DivIcon(L.extend({
// 					className: 'leaflet-marker-photo', 
// 					html: '<div style="background-image: url(' + cluster.getAllChildMarkers()[0].photo.thumbnail + ');"></div>​<b>' + cluster.getChildCount() + '</b>'
// 				}, this.icon));
// 		   	},	
// 			icon: {						
// 				iconSize: [40, 40]
// 			}		   		
// 		},

// 		initialize: function (options) {	
// 			options = L.Util.setOptions(this, options);
// 			L.MarkerClusterGroup.prototype.initialize.call(this);
// 			this._photos = options.featureGroup(null, options);
// 		},

// 		add: function (photos) {
// 			this.addLayer(this._photos.addLayers(photos));
// 			return this;
// 		},

// 		clear: function () {
// 			this._photos.clearLayers();
// 			this.clearLayers();
// 		}

// 	});

// 	L.photo.cluster = function (options) {
// 		return new L.Photo.Cluster(options);	
// 	};

// }
///+++++++++++++

// var photoLayer = L.photo.cluster().on('click', function (evt) {
//   var photo = evt.layer.photo,
//   template = '<video id="myhlsvideo" preload="meta"  autoplay ></video>';
// evt.layer.bindPopup(L.Util.template(template, photo), {
//   className: 'leaflet-popup-photo',
//   minWidth: 400
// });


// evt.layer.openPopup();

// var video = document.getElementById('myhlsvideo');
// if(Hls.isSupported()) {
//   var hls = new Hls();
//   hls.loadSource('http://ivi.bupt.edu.cn/hls/cctv9.m3u8');
//   hls.attachMedia(video);
//   hls.on(Hls.Events.MANIFEST_PARSED,function() {
//     video.play();
// });
// }


// });


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
let markerinfo =[];
let markers2 = null;
let oneCorner = null;
let twoCorner = null; 
let Range = null;
const mrks = [];
const mrksarr ={};
const mrksarrlatlng ={};
let selmrks = [];
var mystore =null;
let markerDic=[];
let center=[];
let migrationLayer; 

let lineinfodata=[];
let lineinfodataall={};
class Mapbox extends React.Component {
    constructor(props) {
    super(props);
    }
    state ={}
    renderMarkers = (data) => {
          if(data.length === 0)
            return '';
          for(let i=0;i<data.length;i++){
            if(data[i].eocT == 1&&data[i].DevType=='1'){
              markerDic[data[i].id]=data[i]
            }
            if (data[i].children.length !== 0) {
              this.renderMarkers(data[i].children);
            }
          }
        }
    linedataFilter(arr1,arr2){
      var temp = []; //临时数组1 
 
      var temparray = [];//临时数组2 
       
      for (var i = 0; i < arr2.length; i++) { 
       
      temp[arr2[i]["to"][0]+arr2[i]["to"][1]] = true;
       
      }; 

      for (var i = 0; i < arr1.length; i++) { 
      if (!temp[arr1[i]["to"][0]+arr1[i]["to"][1]]) { 
       
      temparray.push(arr1[i]); 
       
      } ; 
       
      }; 
        return temparray;

      
    }



    addClass(obj, cls) {
      if (!this.hasClass(obj, cls)) obj.className += " " + cls;
    }
  
    removeClass(obj, cls) {
      if (this.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
      }
    }
    toggleClass(obj, cls) {
      if (this.hasClass(obj, cls)) {
        this.removeClass(obj, cls);
      } else {
        this.addClass(obj, cls);
      }
    }
    hasClass(obj, cls) {
      return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    
  componentDidMount() {

    // layerinit();
    options =JSON.parse(localStorage.options)
    options.layers = [baseMaps["本地地图"]];
    options.crs = NameToCrs()
    let map = L.map(mapid, options);
    markers = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius : 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });
    mystore =this.props.store;
    this.props.store.subscribe(() => {
      const { checkedKeystore,clearlayer,markerinfostore ,lineinfo,lineid,infoids,linechange,alarm} = this.props.store.getState();
      // if(lineinfo){
      //   if(polygonLayer!="")
      //   { map.removeLayer(polygonLayer);}
      //   let lineinfodatatmp=[];
      //   if(markerinfostore.length<=90){
      //   for(let i= 0 ;i<markerinfostore.length;i++){
      //     if(i==0)
      //     {
      //       lineinfodatatmp.push({
      //       "id":lineid,
      //       "from": center,
      //       "to": markerinfostore[i][1],
      //       "labels": ["应急平台", markerinfostore[i][0]],
      //       "color": alarm? "#ff3a31":"#ff7e2b"
      //     })
      //   }else{
      //       lineinfodatatmp.push({
      //       "id":lineid,
      //       "from": center,
      //       "to": markerinfostore[i][1],
      //       "labels": [null, markerinfostore[i][0]],
      //       "color":alarm? "#ff3a31":"#ff7e2b"
      //     })
      //     }
      //   }
      //   lineinfodataall[lineid]=lineinfodatatmp;
      // let llll=  this.linedataFilter(lineinfodatatmp,lineinfodata)
      //  for(let k=0;k<llll.length;k++){
      //   lineinfodata.push(llll[k])
      //  }
      //   migrationLayer.setData(lineinfodata);
      //   migrationLayer.show();
      //   mystore.setState({ lineinfo:false })
      // }
      // else{
      //   mystore.setState({ lineinfo:false })
      //   notification['info']({
      //     message: '所选音柱数量过多，动画不予显示！',
      //   });
      // }
      // }
      // if(linechange){
      //   let data=[];
      
      //   if(infoids.length===0){
      //     lineinfodata=data;
      //     migrationLayer.setData([]);
      //     migrationLayer.hide();
      //   }
      //   else{
      //     let dataline={}
      //           for(let i=0;i<infoids.length;i++){
      //         //      for(let j=0;j<lineinfodata.length;j++){
      //         //       if(infoids[i]==lineinfodata[j]["id"]){
      //         //         data.push(lineinfodata[j])
      //         //       }

      //         // }
      //         for(let dd in lineinfodataall){
      //                  if(infoids[i]==dd){
      //                   dataline[dd]=lineinfodataall[dd];
      //                   }
      //         }
      //       } 
      //       lineinfodataall =dataline;
      //       let XXXX=[];
      //       for(let dd in lineinfodataall){
      //         let oo=[];
      //          oo=  this.linedataFilter(lineinfodataall[dd],XXXX)
      //          for(let i=0;i<oo.length;i++){
      //            XXXX.push(oo[i])
      //          }
      //       }     
      //       migrationLayer.setData(XXXX);
      //       migrationLayer.show();
      //   }
      
           
        
      //       mystore.setState({ linechange:false })
      // }
      // try {
      if(clearlayer){
        if(polygonLayer!="")
        { map.removeLayer(polygonLayer);}
      }
      markers.clearLayers();
      markerinfo=[]
      for(let i =0;i<checkedKeystore.length;i++){
       // selmrks[i].addTo(map);
       if(typeof(mrksarr[parseInt(checkedKeystore[i])])!="undefined"){
        markers.addLayer(mrksarr[parseInt(checkedKeystore[i])].setIcon(greenMarker));
        markerinfo.push(mrksarrlatlng[parseInt(checkedKeystore[i])])
       }
      } 
      let arr=[];
      let arr1=[];
  


        for(let dd in mrksarr){
            let tag =true;
            for(let i =0;i<checkedKeystore.length;i++){
                      if(dd==parseInt(checkedKeystore[i])){
                //  markers.addLayer(mrksarr[dd]);
                tag=false;
                // arr[dd]=     mrksarr[dd];
              }
            }
            if(tag){
              arr[dd]=     mrksarr[dd];
            }
        }
       
        for(let i =0;i<arr.length;i++){
          // selmrks[i].addTo(map);
          if(typeof(arr[i])!="undefined"){ 
            
               markers.addLayer(arr[i].setIcon(redMarker));
          
          }
         } 
         
         if(JSON.stringify(markerinfo) !== JSON.stringify(markerinfostore))
         {mystore.setState({ markerinfostore:markerinfo });}

  map.addLayer(markers); 
  
// } catch (error) {
  
// }
      
    });


    // let photos=[];
    // photos.push({
    //   lat: 31.530409293959394,
    //   lng: 120.27239799499513,
    //   url: gifphoto,
    //   caption: "hello",
    //   thumbnail: gifphoto,
    //   video: "2122222" 
    // });

    // photoLayer.add(photos).addTo(map);

    // layerinit();

    // // options.crs = NameToCrs()
    // console.log("options",options)
    // let map = L.map(mapid, options);
    L.control.zoomslider({position: 'topright'}).addTo(map);
    center =[options.center[1],options.center[0]];
  //  let centermarker=   L.marker([options.center[0],options.center[1]],{icon:darkredMarker}).addTo(map).bindPopup("<h1>管理中心</h1>");
   var data = [];
        
     migrationLayer = new L.migrationLayer({
        map: map,
        data: data,
        pulseRadius:30,
        pulseBorderWidth:1,
        arcWidth:0.5,
        arcLabel:false,
        arcLabelFont:'10px sans-serif',
        }
    );
    migrationLayer.addTo(map);

var options = {
  position: 'topright', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
  drawMarker: false, // adds button to draw markers
  drawPolyline: false, // adds button to draw a polyline
  drawRectangle: true, // adds button to draw a rectangle
  drawPolygon: true, // adds button to draw a polygon
  drawCircle: true, // adds button to draw a cricle
  cutPolygon: false, // adds button to cut a hole in a polygon
  editMode: false, // adds button to toggle edit mode for all layers
  removalMode: false, // adds a button to remove layers

};

// add leaflet.pm controls to the map
map.pm.addControls(options);
// map.pm.setPathOptions({
//   color: 'blue',
//   fillColor: 'black',
//   fillOpacity: 0.4,
// });


    L.control.custom({
      position: 'topright',
      content: '<div id="deletelayer" class="leaflet-pm-toolbar leaflet-bar leaflet-control"><a class="leaflet-buttons-control-button"><div class="control-icon leaflet-pm-icon-delete"></div></a></div>',
      style:
      {
        margin: '0',
        padding: '0px 0px 0 0'
      },
    }).addTo(map);








let that =this;
let polygonLayer="";
map.on('pm:drawstart', function(e) {
  e.shape; // the name of the shape being drawn (i.e. 'Circle')
  e.workingLayer; // the leaflet layer displayed while drawing
  if(polygonLayer!="")
 { map.removeLayer(polygonLayer);}
});

map.on('pm:create', function(e) {
  e.shape; // the name of the shape being drawn (i.e. 'Circle')
  polygonLayer= e.layer; // the leaflet layer created
  // {lat: 31.49074876475237, lng: 120.31282424926759}

  
  // polygonLayer.on('pm:edit', function(ee) {
  //   var  checkedKeys =[];
  //   for(var dd in mrksarr){
  //     var latlng = mrksarr[dd].getLatLng();
  //     if(ee.shape=="Circle"){
  //       if(that.isPointInCircle(latlng,ee.target._mRadius,ee.target.layer._latlng)){
  //         selmrks.push(mrksarr[dd])
  //         checkedKeys.push(dd);
  //       } 
  //     }
  //     else{
  //     if(that.IsPtInPoly(latlng["lng"],latlng["lat"],ee.target._latlngs[0])){
  //       selmrks.push(mrksarr[dd])
  //       checkedKeys.push(dd);
  //     } 
  //   }
  //   }  

  //   console.log(checkedKeys,"checkedKeys")
  //   mystore.setState({ checkedKeystore:checkedKeys,clearlayer:false });
  //   localStorage.checkedKeysIndex=checkedKeys;  
  // });
  var  checkedKeys =[];
  for(var dd in mrksarr){
    var latlng = mrksarr[dd].getLatLng();
    if(e.shape=="Circle"){
      if(that.isPointInCircle(latlng,e.layer._mRadius,e.layer._latlng)){
        selmrks.push(mrksarr[dd])
        checkedKeys.push(dd);
      } 
    }
    else{
          if(that.IsPtInPoly(latlng["lng"],latlng["lat"],e.layer._latlngs[0])){
            selmrks.push(mrksarr[dd])
            checkedKeys.push(dd);
          } 
    }

  }  

  mystore.setState({ checkedKeystore:checkedKeys,clearlayer:false });
  localStorage.checkedKeysIndex=checkedKeys;
});

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
    $('#deletelayer').click(function(){
      if(polygonLayer!="")
      { map.removeLayer(polygonLayer);}
    });

// map.on("popupopen",function(e){
//       console.log(e,"1212")
// })

// map.on("popupclose",function(e){
//   console.log(e,"1dddd32")
// })
    // L.control.layers(baseMaps).addTo(map);
    // $('#movebtn').click(function(){
    //   map.dragging.enable();
    //   BatchSelectionMode = false;
    //   if(Range != null)
    //     map.removeLayer(Range);
    //   $('.ant-radio-button-wrapper').removeClass("ant-radio-button-wrapper-checked")
    //   $('#movebtn').addClass("ant-radio-button-wrapper-checked");
    // });

    // $('#selectbtn').click(function(){
    //   // var myGroup=L.layerGroup(selmrks); 
    //   // myGroup.clearLayers(); 
    //   if(Range != null)
    //     map.removeLayer(Range);    
    //   Range = L.rectangle([[0,0],[0,0]], {color:"#000000", weight:1});
    //   map.addLayer(Range); 
    //   map.dragging.disable();
    //   BatchSelectionMode = true;
    //   $('.ant-radio-button-wrapper').removeClass("ant-radio-button-wrapper-checked")
    //   $('#selectbtn').addClass("ant-radio-button-wrapper-checked");
    // });


    // for(let i=0;i<100;i++){
    //   var marker = L.marker([31.52+i/1000, 120.2-i/500], { icon: myIcon });
    //   mrks.push(marker);
    //   mrksarr[i]=marker;
    // }
    // for(let i=100;i<200;i++){
    //   var marker = L.marker([31.521111+i/1400, 120.211-i/2500], { icon: myIcon });
    //   mrks.push(marker);
    //   mrksarr[i]=marker;
    // }
    let r = {
      method: "POST",
      body: JSON.stringify({"opt":"getTree"})
    }
    netdata('/topoly/regionTreeOpt.epy', r).then(res=>{
      this.renderMarkers(res.d.Values);
      this.props.store.setState({markerDic:markerDic})
       markers.clearLayers();
      for(let dd in markerDic){


        // markers.clearLayers();
        // for(let i =0;i<checkedKeystore.length;i++){
        //  // selmrks[i].addTo(map);
        //  if(typeof(mrksarr[parseInt(checkedKeystore[i])])!="undefined"){
        //   markers.addLayer(mrksarr[parseInt(checkedKeystore[i])]);
        //  }
        // } 
        // map.addLayer(markers); 
         if(markerDic[dd].latitude==""){

         }
         else{
            let lat =parseFloat(markerDic[dd].latitude);
            let lng =parseFloat(markerDic[dd].longitude);
            let id =markerDic[dd].desc;
            let logicaddr =markerDic[dd].logicaddr;

            let NetManageIp =markerDic[dd].NetManageIp;
            let ReadStr =markerDic[dd].ReadStr;
            let WriteStr =markerDic[dd].WriteStr;
          // let lat =31.501287521196705;
          // let lng =120.28106689453126;
          if(!isNaN(markerDic[dd].latitude)){
            //  let marker = L.marker([lat ,lng ], { icon: myIcon }).bindPopup("<h2 >"+id+"</h2>("+logicaddr+")"+'<span class="ant-badge ant-badge-status ant-badge-not-a-wrapper"><span class="ant-badge-status-dot ant-badge-status-success"></span><span class="ant-badge-status-text">正常</span></span>');
           let marker = L.marker([lat ,lng ], { icon: redMarker }).on('click', function(e) {
            // that.props.devitemClick(devicesList["dev1"][dd].id,id,devicesList["dev1"][dd].state,"f1")
            that.props.setSet({devicetitle:markerDic[dd].desc+"("+markerDic[dd].logicaddr+")",devicelatlng:markerDic[dd].latitude+","+markerDic[dd].longitude
            ,deviceinfo:markerDic[dd].id
            })
            that.removeClass(document.getElementById("deviceInfobox"), "close");

       }).on("mouseover",function(e){
         this.openPopup();

       }).on("mouseout",function(e){
         this.closePopup();

       }).bindPopup('<div id="clickbutton" class="device__item"><div class="device__deco"><svg class="device__deco-img"version="1.1"id="Layer_1"preserveAspectRatio="none"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"width="300px"height="100px"viewBox="0 0 300 100"enable-background="new 0 0 300 100"xml:space="preserve"><path class="deco-layer deco-layer--1"opacity="0.6"fill="#FFFFFF"d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z"/><path class="deco-layer deco-layer--2"opacity="0.6"fill="#FFFFFF"d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z"/><path class="deco-layer deco-layer--3"opacity="0.7"fill="#FFFFFF"d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z"/><path class="deco-layer deco-layer--4"fill="#FFFFFF"d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z"/></svg><div class="device__price">'+id+'</div><h3 class="device__title">'+logicaddr+'</h3></div><ul class="device__feature-list"><li class="device__feature">写社区串：'+WriteStr+'</li><li class="device__feature">读社区串：'+ReadStr+'</li><li class="device__feature">IP地址：'+NetManageIp+'</li></ul></div>');
            mrksarr[dd]=marker;
            mrksarrlatlng[dd]=[id,[lng ,lat]];
         try {
            markers.addLayer(marker);
         } catch (error) {
           
         }
           
    
          }
       
         }


      }
      map.addLayer(markers); 

      //-----------------search
      let searchlst=[]
      for(let jj in mrksarrlatlng){
        searchlst.push( {
          "type": "Feature",
          "id": "node/"+jj,
          "properties": {
            "@id": "node/"+jj,
            "amenity": "Xbar",
            "name": mrksarrlatlng[jj][0]
          },
          "geometry": {
            "type": "Point",
            "coordinates": mrksarrlatlng[jj][1]
          }
        })
      }
          var bar = {
            "type": "FeatureCollection",
            "generator": "overpass-turbo",
            "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
            "timestamp": "2015-08-08T19:03:02Z",
            "features": searchlst
          };

        var	geojsonOpts = {
            pointToLayer: function(feature, latlng) {
              return L.marker(latlng, {
                icon: L.divIcon({
                  // className: feature.properties.amenity,
                  // iconSize: L.point(16, 16),
                   opacity:0
                  // html: feature.properties.amenity[0].toUpperCase(),
                })
              });
            }
          };
      
          var poiLayers = L.layerGroup([
            L.geoJson(bar, geojsonOpts)
          ])
          .addTo(map);
          L.control.search({
            layer: poiLayers,
            position: 'topright',
            initial: false,
            propertyName: 'name',
            buildTip: function(text, val) {
              var type = val.layer.feature.properties.amenity;
              let info =""
              if(type=="Xbar"){
                info="音柱";
              }
              return '<a href="#" class="'+type+'">'+text+'<b>'+info+'</b></a>';
            }
          })
          .addTo(map);
      
 //-----------------



      // markerDic.map((item)=>{
      //   let marker = L.marker([item.latitude, item.longitude], { icon: myIcon });
      //   mrksarr[item.id.tostring()]=marker;
      // })
    })





    
    //  var marker1 = L.marker([31.501287521196705, 120.28106689453126], { icon: myIcon });
    // mrksarr["1018"]=marker1;
    // var marker2 = L.marker([31.51416661041471, 120.30097961425783], { icon: myIcon });
    // mrksarr["1019"]=marker2;
    // var marker3 = L.marker([31.517093428642774, 120.26321411132814], { icon: myIcon });
    // mrksarr["1020"]=marker3;
    // var marker4 = L.marker([31.506556454002624, 120.26939392089844], { icon: myIcon });
    // mrksarr["1022"]=marker4;


    // map.on('mousemove', MouseMove);
    // map.on("click ", MouseClick);
    // var BatchSelectionMode = false;
    // var Dragging = false;
    // function MouseClick(e){
    //   if(BatchSelectionMode === false){
    //     return;
    //   }
    //     // {markers.removeLayer(mrksarr[1]);
    //   Dragging = !Dragging;
    //   if(Dragging){
    //     oneCorner = e.latlng;  
    //   }
    //   else{
    //     GetSelectMarkers();
    //     //self.PutToList();
    //   }
    // }
    // function MouseMove(e){
    //   if(BatchSelectionMode === false)
    //     return;
    //   if(Dragging){
    //     twoCorner = e.latlng;
    //     var bounds = [oneCorner, twoCorner];
    //     Range.setBounds(bounds);
    //   }
    // } 
    // function GetSelectMarkers(){
    //   // for(let i = 0;i < selmrks.length;i++){
    //   //   map.removeLayer(selmrks[i])
    //   // } 
    //   markers.clearLayers();
    //   selmrks = []
    //   if(oneCorner == null || twoCorner == null)
    //     return;
    //   var HorMid =  (oneCorner.lat + twoCorner.lat)/2
    //   var HorDis = Math.abs(oneCorner.lat - HorMid);
    //   var VerMid = (oneCorner.lng + twoCorner.lng)/2
    //   var VerDis = Math.abs(oneCorner.lng - VerMid);
    //   // for(let i = 0;i < mrks.length;i++){
    //   //     var latlng = mrks[i].getLatLng();
    //   //     if((Math.abs(latlng["lat"] - HorMid) < HorDis) && (Math.abs(latlng["lng"] - VerMid) < VerDis)){
    //   //       selmrks.push(mrks[i])
    //   //      // map.removeLayer(mrks[i])
    //   //   //   mrks[i].addTo(map);
    //   //     }        
    //   // } 
    //   var  checkedKeys =[];
    //   for(var dd in mrksarr){
    //     var latlng = mrksarr[dd].getLatLng();
    //     if((Math.abs(latlng["lat"] - HorMid) < HorDis) && (Math.abs(latlng["lng"] - VerMid) < VerDis)){
    //       selmrks.push(mrksarr[dd])
    //      // map.removeLayer(mrks[i])
    //   //   mrks[i].addTo(map);
    //       checkedKeys.push(dd);
    //     } 
    //   }  
    //   // for(let i = 0;i < selmrks.length;i++){
    //   //  // selmrks[i].addTo(map);
    //   //   markers.addLayer(selmrks[i]);
    //   // } 
    //   // map.addLayer(markers); 
    //   mystore.setState({ checkedKeystore:checkedKeys });
    //   localStorage.checkedKeysIndex=checkedKeys;
    // }
    // map.on('click', function (e) {
    //   // console.log(e.latlng.lat,e.latlng.lng)
    //   var popup = L.popup()
    //     .setLatLng(e.latlng)
    //     .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    //     .openOn(map);
    // });

   this.map = map;


  }
  isPointInCircle(point, radius,center){
    //point与圆心距离小于圆形半径，则点在圆内，否则在圆外


    var dis = this.getDistance(point, center);
    if(dis <= radius){
        return true;
    } else {
        return false;
    }
}
getDistance(point,center){
  let pk = 180 / 3.14169;
  let a1 = point.lat / pk;
  let a2 = point.lng / pk;
  let b1 = center.lat / pk;
  let b2 = center.lng / pk;
  let t1 = Math.cos(a1) * Math.cos(a2) * Math.cos(b1) * Math.cos(b2);
  let t2 = Math.cos(a1) * Math.sin(a2) * Math.cos(b1) * Math.sin(b2);
  let t3 = Math.sin(a1) * Math.sin(b1);
  let tt = Math.acos(t1 + t2 + t3);
  return 6371000 * tt;
}




  // getDistance(point1,point2) {       // 从form的表单中分别提取两个点的横、纵坐标
  //   var x1 = point1.lat;   // 第一个点的横坐标
  //   var y1 = point1.lng;   // 第一个点的纵坐标
  //   var x2 = point2.lat;   // 第二个点的横坐标
  //   var y2 = point2.lng;   // 第二个点的纵坐标
  //   var xdiff = x2 - x1;            // 计算两个点的横坐标之差
  //   var ydiff = y2 - y1;            // 计算两个点的纵坐标之差
  //   return  Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);   // 计算两点之间的距离，并将结果返回表单元素
  //   }
  IsPtInPoly(ALon, ALat, APoints) {  
    var iSum = 0,  
        iCount;  
    var dLon1, dLon2, dLat1, dLat2, dLon;  
    if (APoints.length < 3) return false;  
    iCount = APoints.length;  
    for (var i = 0; i < iCount; i++) {  
        if (i == iCount - 1) {  
            dLon1 = APoints[i].lng;  
            dLat1 = APoints[i].lat;  
            dLon2 = APoints[0].lng;  
            dLat2 = APoints[0].lat;  
        } else {  
            dLon1 = APoints[i].lng;  
            dLat1 = APoints[i].lat;  
            dLon2 = APoints[i + 1].lng;  
            dLat2 = APoints[i + 1].lat;  
        }  
        //以下语句判断A点是否在边的两端点的水平平行线之间，在则可能有交点，开始判断交点是否在左射线上  
        if (((ALat >= dLat1) && (ALat < dLat2)) || ((ALat >= dLat2) && (ALat < dLat1))) {  
            if (Math.abs(dLat1 - dLat2) > 0) {  
                //得到 A点向左射线与边的交点的x坐标：  
                dLon = dLon1 - ((dLon1 - dLon2) * (dLat1 - ALat)) / (dLat1 - dLat2);  
                if (dLon < ALon)  
                    iSum++;  
            }  
        }  
    }  
    if (iSum % 2 != 0)  
        return true;  
    return false;  
}


  componentWillUnmount() {
 
    //L.control.layers(baseMaps, overlayMaps).removeFrom(this.map);
    this.map.remove();
    this.map = null;

  }
  // componentWillMount(){   
  //   let that =this;
  //       let r = {
  //     method: "POST",
  //     body: JSON.stringify({"opt":"getMapInfo"})
  //   }
  //   netdata('/topoly/regionTreeOpt.epy', r).then(that.ondata.bind(this));
  // }
  // ondata(res) {
  //   if (res.s === false) {
  //     Notification['error']({
  //       message: '数据请求错误',
  //       description: JSON.stringify(res.d),
  //     });
  //     return;
  //   }
  //   if (res.d.errCode == 0) {
  //     // let options11 = res.d.Values;
  //     options.zoom=15
  //   }
  // }



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

#resizediv2 .leaflet-popup-content {
  margin: 0;
}
#resizediv2 .leaflet-popup-content-wrapper{
	    background: transparent;
    color: #333;
    -webkit-box-shadow: none;
    box-shadow: none;
	
}
#resizediv2 .leaflet-popup-photo .leaflet-popup-content-wrapper{
  background: #FFF;
  box-shadow: 0 3px 14px rgba(0,0,0,0.4);
}
#resizediv2 .leaflet-popup-content {
  
    line-height: 1.4;
}
.leaflet-marker-icon:hover{
  width:62px;
  height:62px;
}
#resizediv2  .leaflet-control-zoomslider{
  margin-right:36px
}


.leaflet-touch .leaflet-control-zoomslider a:hover {
  width: 30px;
  line-height: 30px;
}
        `}</style>
    </div>
  }
}
export default Mapbox;