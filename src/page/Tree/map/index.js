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
//import './ControlPan/L.Control.Pan.ie.css'
import $ from 'jquery'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

let cost_underground = 12.55;
let cost_above_ground = 17.89;

let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const mapid = 'map_srcpagemapindexjs'

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
//center: [31.207391, 121.608203],
let options ;
// {
//   //crs: L.CRS.EPSGB3857,
//   attributionControl: false,
//   panControl: false,
//   zoomsliderControl: false,
//   zoomControl: false,
//   center: [31.5, 120.3],
//   zoom: 13,
//   minZoom: 11,
//   maxZoom: 15,
//   maxBounds: [[31.9, 120], [31.3, 120.6]]
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
let map;
let markerlst=null;
let markerinnilst=null;
class Mapbox extends React.Component {
    constructor(props) {
    super(props);
    }
    state ={
      latlng:[]
    }
    
  componentDidMount() {
    options =JSON.parse(localStorage.options);
    options.layers = [baseMaps["本地地图"]];
    map = L.map(mapid, options);
    var markerinni;
   var Kid = this.props.MapRowId;
     var Devicedata = this.props.Devicedata;
    var lat1;
    var lng1;
    for(let i=0;i<Devicedata.length;i++){
      if(Devicedata[i].id==Kid){
        lat1=Devicedata[i].latitude;
        lng1=Devicedata[i].longitude;
      }
    }
    console.log(lat1,lng1,Kid)
    // layerinit();
    options.crs = NameToCrs()
    // layerinit();
    this.props.store.subscribe(() => {
      // var Kid = this.props.MapRowId;
      if(markerlst!=null){
        map.removeLayer(markerlst)
      }
      var lat;
      var lng;
      const { devicedata,id } = this.props.store.getState();
      for(let i=0;i<devicedata.length;i++){
        if(devicedata[i].id==id){
          lat=devicedata[i].latitude;
          lng=devicedata[i].longitude;
        }
      }
      markerinni = L.marker([lat,lng], { icon: myIcon });
      markerinni.addTo(map);
      map.panTo([lat,lng]);
      markerlst=markerinni;
    });
    // // options.crs = NameToCrs()
    // console.log("options",options)
    // let map = L.map(mapid, options);
    L.control.pan({position: 'topright',zIndex:500}).addTo(map);
    // L.control.zoomslider({position: 'topright',style:
    // {
    //   right: '101px',
    // }}).addTo(map);
    L.control.attribution({ prefix: false }).addTo(map);

    let old = options.crs
    map.on('baselayerchange', function (e) {
      clayer = e.name
      console.log(e)
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
    if(markerlst!=null){
      map.removeLayer(markerlst)
    }

    markerinni = L.marker([lat1,lng1], { icon: myIcon });
    markerinni.addTo(map);
    markerlst=markerinni;


    map.on('mousemove', MouseMove);
    map.on("click ", MouseClick.bind(this));
    var BatchSelectionMode = false;
    var Dragging = false;
    function MouseClick(e){
      if(BatchSelectionMode === false){
        if(markerlst!=null){
          map.removeLayer(markerlst)
        }        
        const { store1 } = this.props;
        store1.setState({ latlng: e.latlng });
         var marker = L.marker([e.latlng.lat,e.latlng.lng], { icon: myIcon });
         marker.addTo(map);
         markerlst =marker;
        return;
      }
    }
    function MouseMove(e){
      if(BatchSelectionMode === false)
        return;
      if(Dragging){
        twoCorner = e.latlng;
        var bounds = [oneCorner, twoCorner];
        Range.setBounds(bounds);
      }
    } 
    function GetSelectMarkers(){
      // for(let i = 0;i < selmrks.length;i++){
      //   map.removeLayer(selmrks[i])
      // } 
      markers.clearLayers();
      selmrks = []
      if(oneCorner == null || twoCorner == null)
        return;
      var HorMid =  (oneCorner.lat + twoCorner.lat)/2
      var HorDis = Math.abs(oneCorner.lat - HorMid);
      var VerMid = (oneCorner.lng + twoCorner.lng)/2
      var VerDis = Math.abs(oneCorner.lng - VerMid);
      // for(let i = 0;i < mrks.length;i++){
      //     var latlng = mrks[i].getLatLng();
      //     if((Math.abs(latlng["lat"] - HorMid) < HorDis) && (Math.abs(latlng["lng"] - VerMid) < VerDis)){
      //       selmrks.push(mrks[i])
      //      // map.removeLayer(mrks[i])
      //   //   mrks[i].addTo(map);
      //     }        
      // } 
  
      // for(let i = 0;i < selmrks.length;i++){
      //  // selmrks[i].addTo(map);
      //   markers.addLayer(selmrks[i]);
      // } 
      // map.addLayer(markers); 

    }
    // map.on('click', function (e) {
    //   // console.log(e.latlng.lat,e.latlng.lng)
    //   var popup = L.popup()
    //     .setLatLng(e.latlng)
    //     .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    //     .openOn(map);
    // });

   this.map = map;


  }
  componentWillUnmount() {
    //L.control.layers(baseMaps, overlayMaps).removeFrom(this.map);
    this.map.remove();
    this.map = null;
  }
  render() {
    return <div id={mapid} style={{ height: '100%' }} ></div>
  }
}
export default Mapbox;