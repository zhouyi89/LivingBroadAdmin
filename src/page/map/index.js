//'use strict';

import React from 'react'
import Spin from 'antd/lib/spin'
//, Alert, Menu, Layout,
//import { Link } from 'react-router'
//Router, Route, , hashHistory, IndexRoute, Redirect, IndexLink
import PageHeader from '../../components/pageheader.jsx'
import PageMain from '../../components/pagemain.jsx'
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
//import './ControlPan/L.Control.Pan.ie.css'

export default class pageMain extends React.Component {
  constructor ( props ) {
    super( props );
    this.state = {
      loading:true
    };
  }
  componentDidMount () {
    setTimeout(()=>{
      this.setState({ loading: false });
    }, 1 * 1000);
  }
  render() {
    //console.log(this.props)
    return (
      <section className="e-body">
        <PageHeader>地图</PageHeader>
        <PageMain>
          <div className="map-wrap___Cs4HJ">
            <div className="" style={{"height": "100%"}}>
              <Spin spinning={this.state.loading} className="" style={{"height": "100%"}}>
                <Mapbox />
              </Spin>
            </div>
          </div>
        </PageMain>
      </section>
    )
  }
}

//测试配置

let cost_underground = 12.55;
let cost_above_ground = 17.89;

let html = [
        '<table>',
        // eslint-disable-next-line
        ' <tr><td class="cost_label">Cost Above Ground:</td><td class="cost_value">${total_above_ground}</td></tr>',
        // eslint-disable-next-line
        ' <tr><td class="cost_label">Cost Underground:</td><td class="cost_value">${total_underground}</td></tr>',
        '</table>'
    ].join('');
let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let Ruler = L.Control.LinearMeasurement.extend({
    layerSelected: function(e){

        /* cost should be in feet */

        var distance = e.total.scalar;

        if(e.total.unit === 'mi'){
            distance *= e.sub_unit;

        } else if(e.total.unit === 'km'){
            distance *= 3280.84;

        } else if(e.total.unit === 'm'){
            distance *= 3.28084;
        }

        let data = {
            total_above_ground: numberWithCommas(L.Util.formatNum(cost_above_ground * distance, 2)),
            total_underground: numberWithCommas(L.Util.formatNum(cost_underground * distance, 2))
        };

        let content = L.Util.template(html, data),
            popup = L.popup().setContent(content);

        e.total_label.bindPopup(popup, { offset: [45, 0] });
        //e.total_label.openPopup();
    }
});
/*
map.addControl(new Ruler({
  unitSystem: 'metric',
  color: '#FF0080'
}));*/
//测量配置结束


const mapid = 'map_srcpagemapindexjs'

let myIcon = L.icon({
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41]
});
//center: [31.207391, 121.608203],
    let options = {
      //crs: L.CRS.EPSGB3857,
      attributionControl:false,
      panControl: false,
      zoomsliderControl: false,
      zoomControl: false,
      center: [31.5, 120.3],
      zoom: 13,
      minZoom:11,
      maxZoom:15,
      maxBounds:[[31.7, 120],[31.3, 120.6]]
    };
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
      "谷歌地图": normalMap,
      //baidu: new L.TileLayer.BaiduLayer("Normal.Map", { crs : L.CRS.EPSGB3857}),
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
//Office: L.marker(L.latLng(31.207391, 121.608203)).bindPopup('I\'m working Shanghai in SAP Labs!')
/*    var overlayMaps = {
        Office:L.marker(L.latLng(31.207391, 121.608203)).bindPopup('这是我的一个测试点!')
    };*/
let overlayMaps = {
  Office:L.marker([31.5, 120.3], {icon: myIcon}).bindPopup('这是我的一个测试点!')
};
options.layers = [null, overlayMaps.Office];
let clayer = "卫星地图"
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
      return L.CRS.EPSGB3857
  } else {
      return L.CRS.EPSG3857
  }
}
//<iframe className="map-iframe___vA_t0" src="http://map.baidu.com/"></iframe>
class Mapbox extends React.Component {
  componentDidMount() {
    layerinit();
    options.crs = NameToCrs()
    let map = L.map(mapid, options);
    L.control.pan().addTo(map);
    L.control.zoomslider().addTo(map);
    //unitSystem: 'metric',
    map.addControl(new Ruler({color: '#FF0080', position: 'bottomleft',}));
    L.control.attribution({prefix: false}).addTo(map);

    let old = options.crs
    map.on('baselayerchange', function(e) {
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

    L.control.layers(baseMaps, overlayMaps).addTo(map);
    //L.Control.measureControl().addTo(map);
    this.map = map;
  }
  componentWillUnmount() {
    //L.control.layers(baseMaps, overlayMaps).removeFrom(this.map);
    this.map.remove();
    this.map = null;
  }
  render() {
    return <div id={mapid} style={{height:'100%'}}></div>
  }
}