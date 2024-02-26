 
# vite js app

フロントエンドのビルドツール、Vite（ヴィート）を使ってArcGIS Maps SDK for JavaScript でベースマップを表示する最初のアプリを試してみたソースコードです。手順は、[Vite with ArcGIS](https://odoe.net/blog/vite-jsapi) 、[Vite はじめに](https://ja.vitejs.dev/guide/) を参考にして行っています。  
※ Vite は Node.js 14.18+、16+ のバージョンが必要です。  

## 自分で Vite でJavaScript のアプリケーション を作成する場合の手順

### Vite アプリ テンプレートでのひな形作成
Vite のアプリ テンプレート で、次のコマンドでアプリケーション
のひな形を作成します。
```
npm create vite@latest vite-jsapp
```

テンプレートからframework の選択時にはvanilla プロジェクト、variantはJavaScript を選択します。
```
√ Select a framework: Vanilla
√ Select a variant: JavaScript
```

それが完了したら、画面に表示されている手順に沿ってディレクトリを移動します。
```
cd vite-jsapp
```

次に、ArcGIS Maps SDK for JavaScript の最新バージョンをインストールします。
```
npm install @arcgis/core
```

### Map アプリ用に編集

**main.js** でArcGIS Maps SDK for JavaScript API を使用してMap を表示するよう、次のようにファイルを変更します（簡便に行いたい場合は、下記のコードをコピーし、全て書き換えるように貼り付けてください）。
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

同様にして、**style.css** を更新します（簡便に行いたい場合は、下記の定義をコピーし、全て書き換えるように貼り付けてください）。※以下は、API Version 4.25 の場合です。お使いのバージョンにあわせて、URLは変更してください。
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

同様にして、**index.html** を更新します（簡便に行いたい場合は、下記の定義をコピーし、全て書き換えるように貼り付けてください）。
```
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="viewDiv"></div>
    <script type="module" src="/main.js"></script>
  </body>
</html>

```

### Map アプリを表示
デバッグの開始は、次のコマンドで可能です。
```
npm run dev
```

![intro-calcite-vite-jsapp](https://github.com/kataya/vite-jsapp/blob/main/images/intro-calcite-vite-jsapp.png)

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
  
## 都道府県/市区町村のナビゲーション機能を追加した後のイメージ
  
![intro-calcite-vite-jsapp](https://github.com/kataya/vite-jsapp/blob/main/images/intro-calcite-vite-jsapp.gif?raw=true)
