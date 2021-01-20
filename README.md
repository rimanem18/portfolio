# ゲーム開発会社をイメージして制作した Web サイトサンプル
実在しない架空の会社をイメージして制作した Web サイトです。
## 使用している技術
1. Sass(SCSS)
1. TypeScript
1. EJS
1. Gulp  
1. Webpack

SCSS でスタイルシート、TypeScript で JavaScript を記述しています。  
（TypeScript のトランスパイルには Babel を使用しています）  
Gulp で変更を監視し、保存時に自動でトランスパイル及び Webpack によるバンドリングが行われる設定になっています。  
また、IntersectAction という自作の MIT ライセンスライブラリを使用し「画面に入ったらアニメーションが演出される」というパララックス効果を実装しています。  
[IntersectAction](https://github.com/rimanem18/intersectAction)

## 実行及び出力
※実行にはあらかじめ PC に Node.js のインストールが必須です。  
https://nodejs.org/ja/
### 初回時のみ
```言語:ターミナル
npm i -D
```
開発に必要な NPM パッケージがプロジェクトフォルダにインストールされます。  
### 開発用
```言語:ターミナル
npx gulp
```
ローカルサーバーが立ち上がり、distフォルダにHTML/CSS/JSが出力されます。  
https://localhost:3000 からアクセス可能で、保存がかかるたびにこのディレクトリ配下のページは自動リロードされます。  
ソースコードの圧縮はされません。  
### 製品用
```言語:ターミナル
npx gulp prod
```
distフォルダにHTML/CSS/JSが出力されます。  
開発用とは違いソースコードは圧縮、コンソールログやコメントアウトは削除され、実際にWebサイトとして配信するのに適した状態になります。  
