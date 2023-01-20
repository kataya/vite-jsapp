import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";
import "./style.css";


const basemap = new Basemap({
  portalItem: {
      id: "accf3eff22254ed69e23afeb094a4881" //"street-vector"の日本語版
  }
});

const map = new Map({
  //basemap: "streets-vector",
  basemap: basemap,
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  zoom: 8,
  center: [139.715512, 35.678257], // 皇居を中心にした周辺
});

