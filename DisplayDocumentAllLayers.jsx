// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// DisplayDocumentAllLayers.jsx
// ドキュメント内の全レイヤーと全レイヤーセットを表示する
//
// 2018.01.25 ver.1.0.0.0
//
// Photoshop : Photoshop CC 19.0, Photoshop CS4
// Operating System : Windows 10
// Copyright(c) 2018 KohFlag
// http://www7b.biglobe.ne.jp/~kohflag00/
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

#target "photoshop" // スクリプトの実行対象をPhotoshopに設定
app.bringToFront(); // 指定したアプリケーションを前面に表示

// ドキュメントが1つ以上開かれている場合のみ処理を実行
if(app.documents.length >= 1){
    // グローバル変数の設定
    var firstflag = 1, pflag = 1, confirmflag = 1, okflag = 0, againflag = 1, EndVal = 0; CntVal = 0;// GUIウィンドウの表示制御用変数
    var uDlg, uPal, Msggrp, RunBtngrp, Progressgrp, NumLayersgrp, LayersLgrp, LaySetsLgrp; // GUIウィンドウの表示項目用変数
    var LayersList, LayerSetsList, AllLayersList; // レイヤーとレイヤーセットを全て格納する配列
    var i = 0; j = 0; // レイヤーリストの中身参照用インデックス
    // 処理開始
    // GUIウィンドウの表示制御変数を設定
    againflag = 1 // GUIウィンドウ表示繰り返し用フラグ。0にしない限り繰り返す様に設定。
    firstflag = 1; // 最初のGUIウィンドウ表示フラグ。必ず表示されるよう設定。
    pflag = 1; // 処理進捗フラグ。必ず処理が行われるように設定。
    confirmflag = 1; // 処理結果確認のGUIウィンドウ表示フラグ。必ず表示されるよう設定。
    // GUIウィンドウの表示開始
    while(againflag > 0){
        // 最初のGUIウィンドウの表示。OKかCancelが押されるまで表示し続ける
        while(firstflag > 0){
            // GUIウィンドウを作成 ボタンを押すまで表示し続けるよう、形状を"dialog"に指定。
            uDlg = new Window("dialog","ドキュメント内の全レイヤーと全レイヤーセットを取得",[100,140,420,215]);
            // メッセージのグループを設定
            Msggrp = uDlg.add("group",[10,10,310,10+20]);
            Msggrp.sText = Msggrp.add("statictext",[0,0,300,0+15], "処理開始しますか?"); // 処理可否を問うメッセージを設定
            // ボタンのグループを設定
            RunBtngrp = uDlg.add("group",[10,40,310,40+30]);
            RunBtngrp.okBtn = RunBtngrp.add("button",[65,0,145,0+25], "OK", { name:"ok"}); // OKボタン
            RunBtngrp.cancelBtn = RunBtngrp.add("button", [155,0,235,0+25], "CANCEL", {name: "cancel"}); // CANCELボタン
            // CANCELボタン押下時の処理設定
            RunBtngrp.cancelBtn.onClick = function(){
                againflag = 0; // GUIウィンドウの表示を繰り返すフラグを0にして、GUIウィンドウの表示を繰り返すループを抜ける。
                firstflag = 0; // 最初のGUIウィンドウの表示フラグを0にして、表示させない様にする。
                confirmflag = 0; // 処理結果確認のGUIウィンドウの表示フラグを0にして、表示させない様にする。
                okflag = 0; // 処理可否フラグを0にして、処理キャンセルとする。
                uDlg.close(); // GUIウィンドウを閉じる
            }
            // OKボタン押下時の処理設定
            RunBtngrp.okBtn.onClick = function(){
                firstflag = 0; // 最初のGUIウィンドウの表示フラグを0にして、表示させない様にする。
                confirmflag = 1; // 処理実行最終確認のGUIウィンドウ表示フラグ。必ず表示されるよう設定。
                okflag = 1; // 処理可否フラグを1にして、処理続行とする。
                uDlg.close(); // GUIウィンドウを閉じる
            }
            //GUIウインドウを表示
            uDlg.show();
        }
        // 実行かキャンセルのいずれか判定して分岐
        if(okflag == 1){
            // ドキュメント内の全レイヤーと全レイヤーセットの取得処理と、処理進捗(プログレス)バー用GUIウィンドウの処理
            if(pflag > 0){ // 処理進捗フラグが1(ドキュメント内の全レイヤーと全レイヤーセットの取得処理が未完了)の場合
                EndVal = 3; // 処理進捗終了値。プログレスバーの値計算に使用
                CntVal = 0; // 処理進捗カウント値。プログレスバーの値計算に使用
                // GUIウィンドウを作成 プログレスバーで進捗をリアルタイム更新表示させるため、形状を"palette"に指定。
                uPal = new Window("palette","スクリプト処理中",[100,140,620,200]);
                // 処理進捗(プログレス)バー表示のグループを設定
                Progressgrp = uPal.add("group",[10,10,510,10+40]);
                Progressgrp.sText = Progressgrp.add("statictext",[0,0,500,0+15], 0 + "%完了"); // 処理進捗(プログレス)バー用の文字列を設定
                Progressgrp.pBar = Progressgrp.add("progressbar",[0,20,500,20+15], 0, 100); // 処理進捗(プログレス)バーの設定
                // GUIウィンドウを表示
                uPal.show();
                // 処理および処理中の処理進捗(プログレス)バー表示の更新を行う。処理進捗フラグが0になるまで繰り返す。処理終了後にフラグを0にして、GUIウィンドウを閉じる。
                while(pflag > 0){
                    if(CntVal < 1){
                        LayersList = getDocumentAllLayers(1); // ドキュメント内の全レイヤーを取得
                    }
                    else if(CntVal >= 1 && CntVal < 2){
                        LayerSetsList = getDocumentAllLayers(2); // ドキュメント内の全レイヤーを取得
                    }
                    else if(CntVal >= 2 && CntVal < 3){
                        AllLayersList = getDocumentAllLayers(3); // ドキュメント内の全レイヤーと全レイヤーセットを取得
                    }
                    else{
                        pflag = 0; // 処理進捗フラグを0にし、ドキュメント内の全レイヤーと全レイヤーセットの取得処理完了とする。
                        uPal.close(); // GUIウィンドウを閉じる
                    }
                    CntVal += 1; // 処理進捗カウント値を増やす。
                    Progressgrp.remove(Progressgrp.sText); // 処理進捗(プログレス)バー用の文字列を一度削除
                    Progressgrp.sText = Progressgrp.add("statictext",[0,0,500,0+15], Math.round((CntVal/EndVal)*100.0) + "%完了"); // 処理進捗(プログレス)バー用の文字列を再度設定(更新)。
                    Progressgrp.pBar.value = Math.round((CntVal/EndVal)*100.0); // 処理進捗(プログレス)バーの値を更新。
                }
                // 取得した全レイヤーと全レイヤーセットの確認
                if(AllLayersList.length == 0){ // 全レイヤーと全レイヤーセットの合計数が0なら
                    alert("ドキュメント内における背景以外の、\nレイヤー数かレイヤーセット数、\nもしくはレイヤーとレイヤーセットの合計数がゼロです。");
                    okflag = 0; // 処理可否フラグを0にして、処理キャンセルとする。
                    break; // GUIウィンドウの表示を繰り返すループを抜ける。
                }
                else{
                    // 全レイヤーと全レイヤーセットの合計数が0でないので、何もしない
                }
            }
            else{
                // 処理進捗フラグが0(ドキュメント内の全レイヤーと全レイヤーセットの取得処理完了)なので、何もしない
            }
        }
        else{
            break; // GUIウィンドウを表示するループを抜ける
        }
        // 処理結果確認のGUIウィンドウの表示。OKかRETURNが押されるまで表示し続ける
        while(confirmflag > 0){
            // GUIウィンドウを作成 ボタンを押すまで表示し続けるよう、形状を"dialog"に指定。
            uDlg = new Window("dialog","ドキュメント内の全レイヤーと全レイヤーセットを取得 : 処理結果",[100,140,420,515]);
            // レイヤー数表示部分のグループを設定
            NumLayersgrp = uDlg.add("group",[10,5,310,5+65]);
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[0,1,200,1+20], "全レイヤー数");
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[205,0,215,0+20], "：");
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[220,0,300,0+20], LayersList.length); // 全レイヤー数を表示
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[0,21,200,21+20], "全レイヤーセット数");
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[205,20,215,20+20], "：");
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[220,20,300,20+20], LayerSetsList.length); // 全レイヤーセット数を表示
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[0,41,200,41+20], "全レイヤーと全レイヤーセットの合計数");
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[205,40,215,40+20], "：");
            NumLayersgrp.sText = NumLayersgrp.add("statictext",[220,40,300,40+20], AllLayersList.length); // 全レイヤーと全レイヤーの合計数を表示
            // 全レイヤー一覧のグループを設定
            LayersLgrp = uDlg.add("group",[10,75,310,75+125]);
            LayersLgrp.sText = LayersLgrp.add("statictext",[0,0,300,0+20], "全レイヤーの一覧(名前で表示)");
            LayersLgrp.listBox = LayersLgrp.add("listbox",[0,20,300,20+100],[], {multiselect:false}); // 全レイヤーの一覧用リストボックス
            for(i = 0; i < LayersList.length; i++){
                LayersLgrp.listBox.add("item", LayersList[i].name); // レイヤー名を1つずつリストボックスに取り込む
            }
            // 全レイヤーセット一覧のグループを設定
            LaySetsLgrp = uDlg.add("group",[10,205,310,205+125]);
            LaySetsLgrp.sText = LaySetsLgrp.add("statictext",[0,0,300,0+20], "全レイヤーセットの一覧(名前で表示)");
            LaySetsLgrp.listBox = LaySetsLgrp.add("listbox",[0,20,300,20+100],[], {multiselect:false}); // 全レイヤーセットの一覧用リストボックス
            for(j = 0; j < LayerSetsList.length; j++){
                LaySetsLgrp.listBox.add("item", LayerSetsList[j].name);// レイヤーセット名を1つずつリストボックスに取り込む
            }
            // ボタンのグループを設定
            RunBtngrp = uDlg.add("group",[10,340,310,340+30]);
            RunBtngrp.returnBtn = RunBtngrp.add("button",[65,0,145,0+25], "RETURN"); // RETURNボタン
            RunBtngrp.okBtn = RunBtngrp.add("button",[155,0,235,0+25], "OK", {name:"ok"}); // OKボタン
            // RETURNボタン押下時の処理設定
            RunBtngrp.returnBtn.onClick = function(){
                againflag = 1; // GUIウィンドウの表示を繰り返すフラグを1にして、最初に戻ってGUIウィンドウの表示を繰り返す。
                firstflag = 1; // 最初のGUIウィンドウ表示フラグ。必ず表示されるよう設定。
                confirmflag = 0; // 処理結果確認のGUIウィンドウの表示フラグを0にして、表示させない様にする。
                uDlg.close(); // GUIウィンドウを閉じる
            }
            // OKボタン押下時の処理設定
            RunBtngrp.okBtn.onClick = function(){
                againflag = 0; // GUIウィンドウの表示を繰り返すフラグを0にして、GUIウィンドウの表示を繰り返すループを抜ける。
                confirmflag = 0; // 処理結果確認のGUIウィンドウの表示フラグを0にして、表示させない様にする。
                okflag = 1; // 処理可否フラグを1にして、処理続行とする。
                uDlg.close(); // GUIウィンドウを閉じる
            }
            //GUIウインドウを表示
            uDlg.show();
        }
    }
    // OKかCANCELのいずれか判定して分岐
    if(okflag == 1){ // 処理完了
        alert("処理が完了しました。\nスクリプトを終了します。");
    }
    else{ // 処理キャンセル
        alert("処理はキャンセルされました。\nスクリプトを終了します。");
    }
}
else{
    alert("開かれているドキュメント数がゼロです。\nスクリプトを終了します。");
}

// ドキュメント内の全てのレイヤーとレイヤーセットをまとめて、配列に格納する(但し、背景レイヤーは除く)関数
// 引数getFlagは、格納するものの選択フラグ。 値は次の1～3のいずれか 1:全てのレイヤー | 2:全てのレイヤーセット | 3:全てのレイヤーとレイヤーセット
function getDocumentAllLayers(getFlag){
    // 変数の宣言
    var ThLayers, ThLayerSets; // 最上位層(ドキュメント直下)のレイヤーとレイヤーセットを格納する配列。
    var AllLayers = []; // 全てのレイヤーとレイヤーセットを格納する配列(戻り値配列)
    var i = 0, j = 0; // 配列の中身参照用インデックス
    // 処理開始
    // 引数に異常値が入っていた場合のセーフティー処理
    if(getFlag < 1 || getFlag > 3){ // 引数が1未満、もしくは3超過の場合
        getFlag = 3; // 引数の値を強制的に3(全てのレイヤーとレイヤーセット)にする
    }
    else{
        // 引数が正常値なので何もしない。
    }
    // 最上位層(ドキュメント直下)のレイヤーの取り込み処理
    if(getFlag != 2){ // 引数が2(全てのレイヤーセット)でない場合のみ
        ThLayers = app.activeDocument.artLayers; // 最上位層(ドキュメント直下)のレイヤーを配列に格納
        if(ThLayers.length >= 1){ // 最上位層(ドキュメント直下)のレイヤー数が1以上なら
            if(ThLayers[ThLayers.length - 1].isBackgroundLayer == true){ // 背景が含まれていたら、
                for(i = 0; i < ThLayers.length - 1; i++){ // 最上位層(ドキュメント直下)のレイヤー入りの配列要素を末尾を除いて全て参照する
                    AllLayers.push(ThLayers[i]); // 背景を除いて、 残りの最上位層(ドキュメント直下)のレイヤー全てを戻り値配列に格納
                }
            }
            else{
                Array.prototype.push.apply(AllLayers, ThLayers); // 最上位層(ドキュメント直下)のレイヤーを全て取り出して戻り値配列に連結
            }
        }
        else{
            // 最上位層(ドキュメント直下)のレイヤー数が0なので何もしない。
        }
    }
    else{
        // 引数が2(全てのレイヤーセット)なので何もしない
    }
    // 最上位層(ドキュメント直下)の全てのレイヤーセットと、各レイヤーセットに含まれる全てのレイヤー類の取り込み処理
    ThLayerSets = app.activeDocument.layerSets; // 最上位層(ドキュメント直下)のレイヤーセットを配列に格納
    // 最上位層(ドキュメント直下)のレイヤーセットを配列に格納し、同時に中に含まれるレイヤーとレイヤーセットも最下層に至るまで調べて格納する。
    if(ThLayerSets.length >= 1){ // 最上位層(ドキュメント直下)のレイヤーセット数が1以上なら
        for(j = 0; j < ThLayerSets.length; j++){
            Array.prototype.push.apply(AllLayers, getLayerSetAllLayers(ThLayerSets[j], getFlag)); // 最上位層(ドキュメント直下)の全てのレイヤーセットと、各レイヤーセットに含まれる全てのレイヤー類を全て取り出して戻り値配列に連結
        }
    }
    return AllLayers; // 戻り値配列を返す
}

// レイヤーセットに含まれるレイヤーとレイヤーセットを全て取り出す関数。再帰呼び出しで、最奥までレイヤーが含まれるかチェックする。
// 引数getFlagは、格納するものの選択フラグ。 値は次の1～3のいずれか 1:全てのレイヤー | 2:全てのレイヤーセット | 3:全てのレイヤーとレイヤーセット
function getLayerSetAllLayers(TgtLaySet, getFlag){
    // 変数の宣言
    var AllLayers = []; // レイヤーセットに含まれるレイヤーとレイヤーセットを全て格納する配列(戻り値配列)
    var i = 0; // レイヤーセットの中身参照用インデックス
    // 処理開始
    // 引数に異常値が入っていた場合のセーフティー処理
    if(getFlag < 1 || getFlag > 3){ // 引数が1未満、もしくは3超過の場合
        getFlag = 3; // 引数の値を強制的に3(全てのレイヤーとレイヤーセット)にする
    }
    else{
        // 引数が正常値なので何もしない。
    }
    // レイヤーセット自身の取り込み処理
    if(getFlag != 1){ // 引数が1(全てのレイヤー)でない場合のみ
        AllLayers.push(TgtLaySet); // レイヤーセット自身を戻り値配列末尾に追加
    }
    else{
        // 引数が1(全てのレイヤー)なので何もしない
    }
    // レイヤーセットに含まれるレイヤーとレイヤーセットの取り込み処理
    if(TgtLaySet.layers.length >= 1){
        for(i = 0; i < TgtLaySet.layers.length; i++){
            if(TgtLaySet.layers[i].typename == "LayerSet"){ // レイヤーセットの中身がレイヤーセットならば
                Array.prototype.push.apply(AllLayers, getLayerSetAllLayers(TgtLaySet.layers[i], getFlag)); // 今の関数を再帰呼び出した結果の配列を、戻り値配列に連結
            }
            else{ // 中身がレイヤーセット以外ならば
                if(getFlag != 2){ // 引数が2(全てのレイヤーセット)でない場合のみ
                    AllLayers.push(TgtLaySet.layers[i]); // レイヤーセットの中身を戻り値配列末尾に追加
                }
                else{
                    // 引数が2(全てのレイヤーセット)なので何もしない
                }
            }
        }
    }
    else{
        // 空のレイヤーセットなので何もしない
    }
    return AllLayers; // 戻り値配列を返す
}