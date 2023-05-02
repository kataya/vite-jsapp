// Calcite Components
// Sample : https://github.com/Esri/calcite-components-examples/tree/master/vite
import { setAssetPath } from '@esri/calcite-components/dist/components';
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-select";
import "@esri/calcite-components/dist/components/calcite-option-group";
import "@esri/calcite-components/dist/components/calcite-option";
import "@esri/calcite-components/dist/components/calcite-icon";
import "@esri/calcite-components/dist/components/calcite-loader";
import '@esri/calcite-components/dist/calcite/calcite.css';
setAssetPath(location.href);

// JS API
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Basemap from "@arcgis/core/Basemap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import LayerList from "@arcgis/core/widgets/LayerList";
import Legend from "@arcgis/core/widgets/Legend";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer";

// Style
import "./style.css";

// calcite-components-examples - vite を参考にして loader はコードで追加
// https://github.com/Esri/calcite-components-examples/blob/master/vite/main.js
const loader = document.createElement('calcite-loader');
document.body.appendChild(loader);
//loader.active = true; // v1.0.7 で不要みたい
loader.text = "loading ...";


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
    padding: { // calcite-action-bar 用にpadding を設定
        left:49
    }
});
view.ui.move("zoom", "bottom-right"); // default の zoom をMapViewer と同じ右下レイアウトへ移動

// widgetをそれぞれのcalcite-panel 内の container に追加
const basemapGallery = new BasemapGallery({
    view: view,
    container: "basemaps-container"
});

const layerList = new LayerList({
    view,
    selectionEnabled: true,
    container: "layers-container"
});

const legend = new Legend({
    view,
    container: "legend-container"
});

// レンダラーを定義
const cityRenderer = new SimpleRenderer({
    // new SimpleRenderer() でインスタンスを作成した時にはエラーになるのでコメントアウト
    // type: "simple", // autocasts as new SimpleRenderer() 
    symbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        style: "none",
        outline: { // autocasts as new SimpleLineSymbol()
            style: "solid",
            width: 1.5,
            color: [0, 0, 0, 0.5]
        }
    }
});

// FeatureLayerを追加（全国市区町村界データ 2021： Living Atlas）
const cityAreaLyr = new FeatureLayer({
    url: "https://services.arcgis.com/wlVTGRSYTzAbjjiC/arcgis/rest/services/municipalityboundaries2021/FeatureServer",
    id: "cityarea",
    opacity: 0.5,
    minScale: 5000000,
    maxScale: 5000,
    visible: true,
    title: "全国市区町村界データ 2021",
    renderer: cityRenderer,
    outFields: ["*"],
    // 埼玉県のみになるようフィルタ定義を追加
    definitionExpression: "JCODE LIKE '11%'"
});

// 市区町村用のPopupTemplate の作成
const cityPopupTemplate = new PopupTemplate({
    title: "全国市区町村界",
    content: [
        {
            type: "text",
            text: "自治体コード: {JCODE}" + "</br>" + "都道府県名: {KEN}" + "</br>" +"市区町村名: {SEIREI}{SIKUCHOSON}"
        }
    ]
});
cityAreaLyr.popupTemplate = cityPopupTemplate;

// Mapにレイヤーを追加
map.add(cityAreaLyr);

// calcite-select の初期設定
cityAreaLyr.when(() => {
    updateCitySelect(cityAreaLyr);
});


//let citeareaLyrView;
view.when(() => {

    // [Create a mapping app turtorial]
    document.querySelector("#header-title").textContent = "Intro to Calcite with Vite";

    let activeWidget;

    const handleActionBarClick = ({ target }) => {
      if (target.tagName !== "CALCITE-ACTION") {
          return;
      }

      if (activeWidget) {
          document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
          document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
      }

      const nextWidget = target.dataset.actionId;
      if (nextWidget !== activeWidget) {
          document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
          document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
          activeWidget = nextWidget;
      } else {
          activeWidget = null;
      }
    };

    document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

    let actionBarExpanded = false;

    document.addEventListener("calciteActionBarToggle", event => {
        actionBarExpanded = !actionBarExpanded;
        view.padding = {
            left: actionBarExpanded ? 135 : 45
        };
    });

    document.querySelector("calcite-shell").hidden = false;
    document.querySelector("calcite-loader").hidden = true;
    // End - [Create a mapping app turtorial]

    // calcite-select を利用した都道府県/市区町村ナビ
    document.getElementById("prefSelect").addEventListener("calciteSelectChange", event =>{ 
        let prefcode = event.target.selectedOption.value; //event.srcElement.value;
        let {chikaExp, cityExp} = createDefinitionExpression(prefcode);
        cityAreaLyr.definitionExpression = cityExp;
        zoomToLayer(cityAreaLyr);
        updateCitySelect(cityAreaLyr);
    });

    document.getElementById("citySelect").addEventListener("calciteSelectChange", event =>{ 
        //console.log(event.target.selectedOption.value);
        let citycode = event.target.selectedOption.value;
        if (citycode === "00000") { return }
        const query = cityAreaLyr.createQuery();
        query.where = "JCODE = " + citycode;
        query.returnGeometry = true;
        query.outFields = ["*"];
        cityAreaLyr.queryFeatures(query)
            .then((response) => {
                view.goTo(response.features[0].geometry,  {"duration":1000})
                    .then(() => {
                        view.popup.open({
                            features: [response.features[0]],
                            location: response.features[0].geometry.centroid
                        });
                    });
                
            })
    });

});

// calcite-loaderを使ったレイヤーズーム
function zoomToLayer(layer) {
    document.querySelector("calcite-loader").hidden = false; // loader を表示
    return layer.queryExtent().then((response) => {
            view.goTo(response.extent, {"duration":1000})
                .catch((error) => {
                    console.error(error);
                })
                .finally(()=>{
                    document.querySelector("calcite-loader").hidden = true; // loader を非表示
                });
            });
}

// definitionExpression の式を作成
function createDefinitionExpression(subExpression) {
    const chikakojiExpression = "L01_022 LIKE '" + subExpression + "%'";
    const cityareaExpression = "JCODE LIKE '" + subExpression + "%'";
    return {chikaExp: chikakojiExpression, cityExp:cityareaExpression}
}

// 市区町村の一覧をcitySelect に設定
function updateCitySelect(featureLayer) {
    // 前の市区町村名をクリア（子要素をすべて削除）
    // 参考:  https://developer.mozilla.org/ja/docs/Web/API/Node/removeChild
    const cityElem = document.getElementById("citySelect");
    while (cityElem.firstChild) {
        cityElem.removeChild(cityElem.firstChild);
    }
    // 都道府県切り替え時、前に選択した市区町村コードが残っているみたいなので
    if (cityElem.selectedOption) {
        cityElem.selectedOption.value = "";
    }
    
    // クエリして市区町村名をcalcite-option に設定する
    const queryParams = featureLayer.createQuery();
    queryParams.outFields = ["*"];
    queryParams.where = featureLayer.definitionExpression || "1=1";
    queryParams.returnGeometry = true;
    queryParams.orderByFields = ["JCODE"];
    featureLayer.queryFeatures(queryParams).then((results) => {
        const graphics = results.features;
        const preitem = document.createElement("calcite-option");
        preitem.setAttribute("label", "▽市区町村を選択");
        preitem.setAttribute("value", "00000");
        cityElem.appendChild(preitem);
        graphics.forEach((graphic, index) => {
            const attributes = graphic.attributes;
            const item = document.createElement("calcite-option");
            item.setAttribute("label", attributes.JCODE + " : " + attributes.SEIREI + attributes.SIKUCHOSON);
            item.setAttribute("value", attributes.JCODE);
            //document.getElementById("citySelect").appendChild(item);
            cityElem.appendChild(item);
        });
    });
}