 
# vite js app

フロントエンドのビルドツール、Vite（ヴィート）を使ってArcGIS Maps SDK for JavaScript でベースマップを表示する最初のアプリを試してみたソースコードです。手順は、[Vite with ArcGIS](https://odoe.net/blog/vite-jsapi) に習って行っていました。  

## 自分で Vite でアプリケーションを作成する場合の手順

ディレクトリを移動し、
次のコマンドで、vite のアプリ テンプレートから選択できますが、vanilla プロジェクトをお勧めします。
```
npm init @vitejs/app
```

それが完了したら、ArcGIS Maps SDK for JavaScript の、next API のバージョンをインストールします。
```
npm install @arcgis/core@next
```

main.js で、API を使用してMap を表示するように、ファイルを変更します。
```
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
```
style.css を更新します。
```
@import "https://js.arcgis.com/4.25/@arcgis/core/assets/esri/themes/light/main.css";
html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
```

vite をインストールします。
```
npm i vite
```

デバッグの開始は、次のコマンドで可能です。
```
npm run dev
```

なお、npm run build でデプロイ用にビルドが出来ますが、path のエラーが発生しないよう vite.config.js ファイルを追加し、次の情報を書きます。
```
export default {
    base: './'
}
```

## Calcite Components を追加して使う場合の手順

Calcite Components Examples の [vite のサンプル](https://github.com/Esri/calcite-components-examples/tree/master/vite) の手順を行い、`rollup-plugin-copy` の設定後、一旦、ビルドし、public フォルダー下に assets フォルダーが作成されていることを確認します。  

```
npm run build
```

ビルド後は、デバッグを開始できます。  
  
## 都道府県ナビゲーション機能を追加した後のイメージ
  
![intro-calcite-vite-jsapp](https://github.com/kataya/vite-jsapp/blob/main/images/intro-calcite-vite-jsapp.gif?raw=true)
