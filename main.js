// Calcite Components
//Sample : https://github.com/Esri/calcite-components-examples/tree/master/vite
import { setAssetPath } from '@esri/calcite-components/dist/components';
//import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-option-group";
import "@esri/calcite-components/dist/components/calcite-option";
import "@esri/calcite-components/dist/components/calcite-icon";
import '@esri/calcite-components/dist/calcite/calcite.css';
setAssetPath(location.href);

// JS API
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Expand from "@arcgis/core/widgets/Expand";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
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

// BasemapGallery Widgetを追加
const basemapGallery = new BasemapGallery({
  view: view
});
// Expand Widget内に配置
const bgExpand = new Expand({
  view: view,
  content: basemapGallery,
  autoCollapse: true,
});
// UIに配置
view.ui.add(bgExpand, "bottom-right");

// FeatureLayer：全国市区町村界データ 2021： Living Atlas
const cityareaLyr = new FeatureLayer({
  url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/municipalityboundaries2021/FeatureServer",
  id: "cityarea",
  opacity: 0.5,
  minScale: 5000000,
  maxScale: 50000,
  visible: true, //false,
  // 埼玉県のみになるようフィルタ定義を追加
  definitionExpression: "JCODE LIKE '11%'"
});
map.add(cityareaLyr);

function zoomToLayer(layer) {
  return layer.queryExtent().then((response) => {
    view.goTo(response.extent, {"duration":1000}).catch((error) => {
      console.error(error);
    });
  });
}

function createDefinitionExpression(subExpression) {
  const chikakojiExpression = "L01_022 LIKE '" + subExpression + "%'";
  const cityareaExpression = "JCODE LIKE '" + subExpression + "%'";
  return {chikaExp: chikakojiExpression, cityExp:cityareaExpression}
}

const pref = document.getElementById("prefSelect");
pref.addEventListener("calciteSelectChange", (event) => {
  let prefcode = event.srcElement.value;
  let {chikaExp, cityExp} = createDefinitionExpression(prefcode);
  cityareaLyr.definitionExpression = cityExp;
  zoomToLayer(cityareaLyr);
});
