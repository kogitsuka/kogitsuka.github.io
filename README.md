# Kazuki Ogitsuka — Personal Website

扇塚 和希の個人サイトです。白地に見出しと箇条書きを並べたシンプルなページです。日本語・英語の2ページを用意し、各ページの言語リンクで切り替えられます。GitHub Pagesで公開できる静的なHTML・CSS・JavaScriptで構成しています。

## ページを確認する

`index.html`をブラウザーで開くと、日本語ページを確認できます。英語ページは`en/index.html`です。

ローカルサーバーで確認する場合は、このフォルダーで次のコマンドを実行します。Pythonが必要です。

```sh
python -m http.server 8000
```

ブラウザーで[日本語ページ](http://localhost:8000/)または[英語ページ](http://localhost:8000/en/)を開きます。終了時はターミナルで`Ctrl+C`を押してください。

## GitHub Pagesで公開する

1. GitHubで`<GitHubユーザー名>.github.io`という名前のリポジトリを作成します。ユーザー名に大文字が含まれる場合、リポジトリ名では小文字にします。
2. このフォルダーの**中身をすべて**、リポジトリの一番上に配置します。`index.html`がリポジトリ直下になるようにしてください。空の隠しファイル`.nojekyll`も含めます。
3. リポジトリの**Settings → Pages**を開きます。
4. **Build and deployment → Source**で**Deploy from a branch**を選択します。
5. ブランチを**main**、フォルダーを**/(root)**にして**Save**を押します。
6. 公開処理が完了したら、Pages設定に表示される**Visit site**から確認します。公開先は通常`https://<GitHubユーザー名>.github.io/`です。

生成済みのHTMLを含んでいるため、GitHub上でビルドを設定する必要はありません。公開手順は2026年11月1日に[GitHub公式ドキュメント](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)と[公開元の設定手順](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)を確認しています。

通常のプロジェクトリポジトリでも使えます。ファイルを同じ構成で配置し、そのリポジトリのPagesを有効にすると、通常`https://<GitHubユーザー名>.github.io/<リポジトリ名>/`で表示されます。ページ内のファイル参照は相対パスです。

## 内容を更新する

氏名・所属・学歴・論文・発表歴・受賞歴は`data/profile.json`で管理します。日本語と英語の両方を更新した後、このフォルダーで次のコマンドを実行してください。Node.jsが必要です。追加パッケージのインストールは不要です。

```sh
node scripts/build.mjs
```

これにより`index.html`と`en/index.html`が再生成されます。更新したデータと生成後のHTMLをまとめてGitHubに反映してください。

HTMLを直接編集することもできますが、再生成するとその変更は上書きされます。継続して使う内容は`data/profile.json`、レイアウトは`scripts/build.mjs`、見た目は`assets/style.css`で変更してください。

## ファイル構成

```text
.
├── index.html          日本語ページ
├── en/
│   └── index.html      英語ページ
├── assets/
│   ├── style.css       見た目・画面サイズへの対応
│   └── main.js         言語切り替え時の位置保持
├── data/
│   └── profile.json    日本語・英語の掲載データ
├── scripts/
│   └── build.mjs       HTMLの生成
├── .nojekyll           GitHub PagesでJekyll処理を使わない設定
├── README.md           この案内
└── SOURCES.md          掲載内容の確認元
```

掲載情報の出典と、英訳・発表歴の扱いは[SOURCES.md](SOURCES.md)にまとめています。所属や業績を追加する際の確認に使ってください。
