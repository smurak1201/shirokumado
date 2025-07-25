<?php
// このファイルは、Laravelアプリケーションのエントリポイントです。
// ここからアプリケーションの初期化とリクエスト処理が行われます。

// Laravelのリクエストを処理するために必要なクラスをインポート
use Illuminate\Http\Request;

// Laravelの処理開始時間を記録
define('LARAVEL_START', microtime(true));

// メンテナンスモードの場合は専用ファイルを読み込む
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Composerのオートローダーを読み込む（クラス自動読み込み）
// ローカル
require __DIR__ . '/../vendor/autoload.php';
// 本番
// require __DIR__ . '/shirokumado-la/vendor/autoload.php';

// Laravelアプリケーション本体を起動
// ローカル
$app = require_once __DIR__ . '/../bootstrap/app.php';
// 本番
// $app = require_once __DIR__ . '/shirokumado-la/bootstrap/app.php';

// リクエストを受け取り、レスポンスを返す
$app->handleRequest(Request::capture());
