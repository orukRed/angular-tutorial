# angular tutorial 実行時のつまづきがちな点

## 記事の対象者

Angularのチュートリアル(<https://angular.jp/tutorial>)実行してて、
補足説明代わりみたいな記事を探してる人


## 環境

vscode:1.45.1
Windows10 home 64bit

以下、ng version コマンドにて確認
Angular10.1.2

## チュートリアル実行時のメモ

以下は、特記事項があった章のみ記載とする。

### 1章

#### 間違ったコンポーネントの生成

間違ったコンポーネントを削除する場合、フォルダごとコンポーネントを削除すれば良い。
その場合src/app/app.module.ts内のimportも忘れずに削除する必要がある。
削除し忘れている場合以下のエラーが出る。(今回はherosコンポーネントを誤って生成している)

```shell
ERROR in ./src/app/app.module.ts
Module not found: Error: Can't resolve './heros/heros.component' in '\angular-tour-of-heros\src\app'
    
    ERROR in src/app/app.module.ts:6:32 - error TS2307: Cannot find module './heros/heros.component' or its corresponding type declarations.
    
    6 import { HerosComponent } from './heros/heros.component';
                                     ~~~~~~~~~~~~~~~~~~~~~~~~~
```

#### セレクタの指定


```typescript:heroes.component.ts
<h1>{{title}}</h1>
<app-heroes></app-heroes>
```

チュートリアルには
>app-heroesはHeroesComponentの要素セレクタであることを思い出してください。 なので、AppComponentのテンプレートファイルで、タイトルの直下に<app-heroes>要素を追加してください。
と書かれている。
これは、
「tsファイルの@Componentで指定したセレクタをapp側からタグとして使えばheroesコンポーネントの中身が呼び出せるよ！」ということである。

#### テンプレート

htmlを編集する時、

```
{{hoge}}
```

などといった書き方があるがこれはテンプレートと呼ばれるものである。
{{変数名}}として扱うことができる。

#### 1章まとめ

* ng generate component でコンポーネントを作りデータやHTMLを作る
  * 作ったものはapp.component.htmlから呼び出す
  * インターフェースを作成→tsで設定→htmlで呼び出す　が基本的な流れ
* app.module.tsを編集することでインポートを追加できる(例:FormsModule)
  * import { MODULE_NAME } from 'MODULE_PLACE'; //構文
  * インポート不足の場合　error NG8002: Can't bind to 'ngModel' since it isn't a known property of 'input'.　がでる。
* ngModelディレクティブを使いリアルタイムでデータの編集ができる

### 2章

#### 2章まとめ

* htmlタグに *ngForなどのバインディング追加で様々な処理の追加ができる
  * *ngFor = 'let 変数名 of 配列名' でループできる
  * *ngIfでTrueのときに入るHTMLの作成
  * [class.selected]="hero === selectedHero" で選んだheroがselectedHeroと同じ時にCSS追加
  * (click)="hoge(arg)" でイベントハンドラの指定。tsファイルに関数定義の必要あり。
* 以下構文でテキスト入力フォーム生成。

    ```html
      <label>
      <input [(ngModel)]="selectedHero.name" placeholder="name"/>
      </label>
    ```


### 3章

#### @Input() heroプロパティとは

プロパティの頭に「@Input()」をつけておけば、
親（子を呼び出す側）から値を受け取るようにできる。

#### プロパティバインディング

htmlからコンポーネントを呼び出す際、
要素に対して値を設定できる。
チュートリアルでは、HeroDetailComponentのheroプロパティに対してselectedHeroが設定されている。

#### 3章まとめ

* データ構造の整理を行い、Hero編集画面を担保するHeroDetailsコンポーネントを作成した。
  * ここまで作ったファイルの関係は以下画像のようになっている。
  * (Untitled DIagram.png)
* Inputプロパティとプロパティバインディングで値の取得・設定を行った

### 4章

#### コンストラクタ

他のクラスの変数などを使用する場合、事前にimportする以外に、
コンストラクタの引数に定義が必要。
ex:)サービスクラス、Route等

#### Observable

サーバーリクエストによってデータのやり取りをする場合、非同期にてデータの取得を行う必要がある。
非同期でデータを扱う際に、RxJS(非同期等をまとめたライブラリ)のObservableクラスを用いる。
関数の型にObservableを設定したときはofを使うと戻り地を一部省略できる

```typescript:サービスのget側
getHeroes(): Observable<Hero[]> {
  //return Observable>Hero[]> と同義。いわゆる糖衣構文。
  return of(HEROES);
}
```

```typescript:コンポーネントのget側
getHeroes(): void {

  //
  this.heroService.getHeroes()
      .subscribe(tmp => this.myHeroes = tmp);
}
```

#### サービスクラス

コンポーネントを更に小さくした単位。
コンポーネントと異なりフォルダは生成されず、ファイルが一つ生成されるのみ。
＠Injectableデコレータが付与されており、これがあるのでコンポーネントへサービスを渡すことができる。
コンポーネントから呼び出すときはhogeServiceでインポートする。

#### 4章まとめ

* データの受け渡しは非同期で行う。
* サービスはコンポーネントをさらに小さくした単位。データの返却などに用いる
* コンポーネントのコンストラクタはプロパティ定義の初期化等だけを行うべき。
* サーバへのHTTPリクエストの処理はngOnInit()で行う

### 5章

#### ルーティング

URLなどの受け渡しを担保する。
--flatは、固有のフォルダの代わりに、src/appに生成したファイルを置きます。
--module=appは、AppModuleのimports配列に、生成したモジュールを登録するようCLIに指示します。

hoge-routing.module.tsのroutesには
pathとcomponentを追加する
routesに追加したものは、html内で

```html:
<router-outlet></router-outlet>
```

#### RouterLink

htmlの\<a>タグにrouterLink属性を使いURLパスを指定する。

#### 5章まとめ

* ダッシュボードの追加・戻る機能の実装
* リファクタリング
* 基本的な流れは以下。
  1. コンポーネント作成してhtmlとtsを記述
  2. コンポーネントでなくAngularに付属している機能（http等）の場合はapp.module.tsのインポートに追加
  3. サービスにget関数とか作るってコンポーネントから呼び出せるようにする
  4. app-routingのroutesにパスとコンポーネント名を追加
  5. htmlから\<router-outlet>\</router-outlet>を呼び出す
  6. 3で指定したURLへと移動してrouter-outlet内のコンポーネントを表示

### 6章

### サーバー上のデータの更新

```typescript
this.http.put(URL,VARIABLE_NAME,httpOption)でデータの書き換えを行う？
```

### subscribe

RxjsのObservableにおけるObservable内の他の処理につなげる関数。
引数内に値を入れて処理を決める。
Observableを使う際は必ずこの関数を通す。

#### わからなかった点まとめ

* 6章の文法全般（触っていくうちにわかっていく？)
* わざわざデータ追加処理をサービスとコンポーネントで分ける(addHeroとaddと)必要は？
  * サービスでaddHeroを追加しておけば、あとはaddを他のコンポーネントから呼び出すだけで追加処理を行うことができるから？
* Observableで定義されてるpipeやtapメソッドはどういうもの？
  * pipe:observableで値を渡すときに一度通す必要のあるメソッド。中継点のようなもの？
  * tap:ストリーム（データの流れ？)に影響を与えずメソッドの実行を行う。
* getHeroで渡されるtapの引数に入れてるアンダーバーは何？
  →VscodeのインテリセンスによるとArrayBuffer型。

#### 6章まとめ

* 擬似的にHTTPリクエストを行うことができる
* rxjsのoperatorsをインポートしてエラーハンドリングの追加をする事ができる
* ObservableをCRUDの実装(呼び出しをコンポーネント側、内部の処理をサービスに記述)

### 全体的な流れ

  1. コンポーネント作成してhtmlとtsとCSSを記述
  2. コンポーネントでなくAngularに付属している機能（http等）の場合はapp.module.tsのインポートに追加
  3. サービスに関数とか作ってコンポーネントから呼び出せるようにする
  4. CRUD(create,Read,Update,Delete)が関係するものであるならObservable.subscribeを通してCRUDを実行するメソッドを作成する。(呼び出しをコンポーネント側、内部の処理をサービスに記述)
  5. app-routingのroutesにパスとコンポーネント名を追加
  6. htmlから\<router-outlet>\</router-outlet>を呼び出す
  7. 3で指定したURLへと移動してrouter-outlet内のコンポーネントを表示


## チュートリアルで使ったangular CLIのコマンド一覧

### ng new my-project

プロジェクト生成

### ng serve --open

開発用サーバを起動し、<http://localhost:4200>を開く

### ng generate component component-name

コンポーネントフォルダを生成。
内容物は以下。

* htmlファイル
* cssファイル
* tsファイル
* spec.tsファイル(テストに用いるファイル)

### ng generate service service-name

サービスファイルを生成。
内容物は以下。

* service-name.service.ts
* service-name.service.spec.ts
