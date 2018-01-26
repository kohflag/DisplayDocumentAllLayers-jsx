# DisplayDocumentAllLayers  

## 1. 概要  
Adobe Photoshop用のスクリプトです。  
Photoshopのドキュメント(ファイル)内に含まれる、  
全レイヤーの一覧および数、全レイヤーセットの一覧および数を取得して表示します。  
背景レイヤーは除いて取得するので、背景レイヤーが存在していても処理可能です。  

- 作成日 : 2018.01.26  
- Ver : v1.0.0.0.0  
- 動作確認済みのOS : Windows10  
- 動作確認済みのPhotoshop : CS4、CC 19.0  
- 文字コード : UTF-8  
  ※Windows版のPhotoshopのみ動作確認しております。申し訳ありません。  

- - -  

## 2. スクリプトの実行方法  
次の[2-A]、[2-B]のいずれかの方法で実行します。  

### [2-A] お好みの保存場所より実行  

#### [2-A-1] スクリプトファイルを、お好みの場所(適当なディレクトリ下やフォルダ下など)に配置します。  

#### [2-A-2] Photoshopを起動し(既に起動済みの場合の再起動は不要)、ファイル→開く(O)...より、お好みのPSDファイルを開きます。  

#### [2-A-3] ファイル→スクリプト→参照より、[2-1]で配置したスクリプトファイルを指定し、実行します。  
※[2-A-3]の操作を、アクションとして記録しておけば、次回以降はアクションパネル内の記録されたアクションより実行可能になります。  

### [2-B] Photoshopのスクリプトメニューに常時読み込ませておき、そこから実行  

#### [2-B-1] スクリプトファイルを次の場所に配置します。  
Windows：  
（32 ビット）： Program Files (x86)\Adobe\Adobe Photoshop [Photoshop_version] (32 bit)\Presets\Scripts  
（64 ビット）： Program Files\Adobe\Adobe Photoshop [Photoshop_version]\Presets\Scripts  

※Macでの配置場所については、次のリンク先が参考になるかもしれません。  
[ダウンロード可能なプラグインおよびコンテンツ | Photoshop CC](https://helpx.adobe.com/jp/photoshop/kb/downloadable-plugins-and-content.html# "Adobe")  

#### [2-B-2] Photoshopを起動([2-B-1]の時点で起動済みの場合は再起動)し、ファイル→開く(O)...より、お好みのPSDファイルを開きます。  
※[2-A]の方法と違い、[2-B-1]で配置したスクリプトファイルをPhotoshopに読み込ませるために、  
　Photoshopの起動操作が必須となります。  
※[2-B-1]の時点でPhotoshopが起動済みの場合は再起動(一旦終了した後で、再び起動する)した上で、  
　ファイル→開く(O)...より、お好みのPSDファイルを開いてください。  

#### [2-B-3] ファイル→スクリプトよりメニューを表示させると、配置したスクリプトファイルが出てくるので、実行します。  

※スクリプトの実行時、PSDファイルは必ず1つ以上開いておいてください。  
※スクリプトにおける、ドキュメント内の全レイヤーと全レイヤーセットを取得する処理は、  
　PSDファイルが1つ以上開かれている時にのみ可能です。  
※PSDファイルが1つも開かれていない状態でスクリプトを実行すると、  
　メッセージが表示されてスクリプトが終了します([3-5-B]もご確認ください)。  

- - -  

## 3. スクリプトの動作例  
### [3-1] スクリプト実行  
※次の画像の様に、PSDファイルを開いておき、スクリプトを実行します。  
![displayalllayers_web_001](https://user-images.githubusercontent.com/2978899/35427998-01df12f2-02b0-11e8-8c1b-7d7de5f9fce8.png)  

※この画像は自作の模写イラストのPSDファイルになります。  
※このPSDファイルから出力保存したイラスト画像を、次のリンク先に投稿していたりします。  
[twitterのリンク先](https://twitter.com/KohFlag/status/928910956926615552 "Twitter")  

### [3-2] スクリプト実行後、最初の表示  
スクリプトを実行すると、最初に処理を促すウィンドウが画面左上に表示されます。  
![displayalllayers_web_002](https://user-images.githubusercontent.com/2978899/35428023-229b2378-02b0-11e8-83b4-2996b4fc90a8.png)  

![displayalllayers_web_010](https://user-images.githubusercontent.com/2978899/35433057-6b8e5540-02c5-11e8-983b-818ddd13c15e.png)  

このウィンドウでOKボタンを押すと、ドキュメント内の全レイヤーの全レイヤーセットの取得処理が開始されます。  
→[3-3]へ続きます。  
CANCELボタンを押すと、[3-3]以降の処理はキャンセルされ、メッセージ表示後にスクリプト実行が終了します。  
![displayalllayers_web_006](https://user-images.githubusercontent.com/2978899/35428487-ab6c13ea-02b2-11e8-96f6-2c5fb3f70988.png)  

![displayalllayers_web_014](https://user-images.githubusercontent.com/2978899/35433194-d65512a6-02c5-11e8-9d02-fc5ae52e152f.png)  

### [3-3] ドキュメント(ファイル)内の全レイヤーと全レイヤーセットの取得処理  
全レイヤーと全レイヤーセットの取得処理中は、プログレスバーのウィンドウで進捗状況を確認できます。  
取得処理が完了すると、プログレスバーのウィンドウは自動で閉じます。  
※取得処理は1度完了すると、スクリプト実行を終了しない限りは結果が保持される為、  
　後述の[3-3]で記載の2度目以降の処理は省略されます。  

### [3-4] ドキュメント内の全レイヤーと全レイヤーセットの取得処理結果の表示   
全レイヤーと全レイヤーセットの取得処理が完了して、1つ以上レイヤーもしくはレイヤーセットを取得できていれば、  
取得結果のウィンドウが表示されます。  
(※全レイヤーと全レイヤーセットの取得数が0の場合は、後述の[3-5-A]を参照ください。)   

ウィンドウには、全レイヤー数、全レイヤーセット数、全レイヤーと全レイヤーセットの合計数、  
全レイヤーの一覧、全レイヤーセットの一覧が含まれています。  
![displayalllayers_web_003](https://user-images.githubusercontent.com/2978899/35428463-8cddaef2-02b2-11e8-9ce5-bba16e39b987.png)  

![displayalllayers_web_011](https://user-images.githubusercontent.com/2978899/35433099-8cc29d02-02c5-11e8-8601-fe4c24bd74fe.png)  

全レイヤーの一覧と全レイヤーセットの一覧はリストボックスに入っており、  
スクロールバーで最初から最後まで確認可能です。  
![displayalllayers_web_012](https://user-images.githubusercontent.com/2978899/35433129-a0f4ee10-02c5-11e8-9ea5-723b7f3c9125.png)  

このウィンドウでRETURNボタンを押すと、[3-2]のウィンドウが再表示され、  
OKボタンを押すと、[3-3]の処理を省略し(一度完了して結果が保持されている為)、このウィンドウが再表示されます。  
RETURNボタンを押せば、何度でも[3-2]のウィンドウに戻る事ができます。  

OKボタンを押すと、メッセージが表示されてスクリプト実行が終了します。  
![displayalllayers_web_005](https://user-images.githubusercontent.com/2978899/35428479-9e838820-02b2-11e8-9929-57e7e194aba2.png)  

![displayalllayers_web_013](https://user-images.githubusercontent.com/2978899/35433184-ced8acae-02c5-11e8-98ed-61f4414c1d4a.png)  

### [3-5] エラー表示  
#### [3-5-A] 処理の結果、全レイヤーと全レイヤーセットの取得数が0の時  
まず、取得数が0ですというメッセージが表示されて、  
![displayalllayers_web_007](https://user-images.githubusercontent.com/2978899/35428493-b0d4145e-02b2-11e8-87e0-874d0e84073d.png)  

![displayalllayers_web_015](https://user-images.githubusercontent.com/2978899/35433203-e21e412a-02c5-11e8-98ca-2e241ed1b688.png)  

次に処理がキャンセルされましたというメッセージが表示され、スクリプト実行が終了します。  
![displayalllayers_web_008](https://user-images.githubusercontent.com/2978899/35428496-b5bb37f4-02b2-11e8-9c12-f6827db5ef5b.png)  

![displayalllayers_web_014](https://user-images.githubusercontent.com/2978899/35433194-d65512a6-02c5-11e8-9d02-fc5ae52e152f.png)  

#### [3-5-B] PSDファイルが1つも開かれていない状態でスクリプトを実行した時  
ファイルが開かれていないというメッセージが表示されてスクリプトが終了します。  
![displayalllayers_web_009](https://user-images.githubusercontent.com/2978899/35428504-c550d93a-02b2-11e8-969d-7145f62f11e2.png)  

![displayalllayers_web_016](https://user-images.githubusercontent.com/2978899/35433208-e881c1d6-02c5-11e8-9e96-9d86ae878161.png)  
