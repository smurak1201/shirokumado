## 白熊堂 ホームページ

このリポジトリは、かき氷店「白熊堂」の公式ホームページのソースコードです。

### 使用技術

-   PHP 8.x
-   Laravel 10.x（Web アプリケーションフレームワーク）
-   MySQL（データベース）
-   Tailwind CSS（CSS フレームワーク）
-   Vite（フロントエンドビルドツール）
-   Blade（Laravel 標準テンプレートエンジン）
-   React（管理ダッシュボード予定）

### 主な機能

-   メニュー画像の一覧・詳細表示
-   画像のタグ・カテゴリー管理
-   管理者用ダッシュボード（React で今後実装予定）

### セットアップ方法（ローカル環境）

1. リポジトリをクローン
    ```bash
    git clone https://github.com/ユーザー名/リポジトリ名.git
    cd リポジトリ名
    ```
2. PHP 依存パッケージのインストール
    ```bash
    composer install
    ```
3. .env ファイルの作成・編集
    ```bash
    cp .env.example .env
    # 必要に応じてDBや画像保存先パスなどを編集
    ```
4. アプリケーションキーの生成
    ```bash
    php artisan key:generate
    ```
5. データベースのマイグレーション・シーディング
    ```bash
    php artisan migrate --seed
    ```
6. フロントエンドのビルド
    ```bash
    npm install
    npm run build
    ```
7. 開発サーバ起動
    ```bash
    php artisan serve
    ```

### ディレクトリ構成例

```
├── app/                # Laravelアプリ本体
├── public/             # 公開ディレクトリ（画像・index.php等）
├── resources/          # ビュー・CSS・JS
├── routes/             # ルーティング
├── database/           # マイグレーション・シーダー
├── frontend/           # 管理ダッシュボード（React, 今後追加予定）
├── ...
```

### ライセンス

MIT License
