## 白熊堂 ホームページ

このリポジトリは、かき氷店「白熊堂」の公式ホームページのソースコードです。

### 使用技術

-   PHP 8.x
-   Laravel 10.x（Web アプリケーションフレームワーク）
-   MySQL（データベース）
-   Tailwind CSS（CSS フレームワーク）
-   Vite（フロントエンドビルドツール）
-   Blade（Laravel 標準テンプレートエンジン）
-   React 18 + TypeScript（管理ダッシュボード）

### 主な機能

-   メニュー画像の一覧・詳細表示
-   画像のタグ・カテゴリー管理
-   管理者用ダッシュボード（React 製、下記参照）

---

## 管理者用ダッシュボード（React）

`/dashboard` ディレクトリ配下に、React + TypeScript + Vite + Tailwind CSS で構築した管理用ダッシュボードが含まれています。

### 主な特徴

-   画像メニューのドラッグ＆ドロップ並び替え
-   タグ・カテゴリー・公開状態による絞り込み・検索
-   画像の追加・編集・削除
-   並び順の自動保存・手動保存
-   ページネーション対応
-   カスタムフックによる状態管理・ロジック分離
-   React 公式理念に沿った設計（SRP, 宣言的 UI, パフォーマンス最適化）

### ディレクトリ構成（抜粋）

```
dashboard/
├── src/
│   ├── components/         # UIコンポーネント群
│   ├── hooks/              # カスタムフック群
│   ├── constants/          # 定数
│   ├── utils/              # ユーティリティ
│   └── App.tsx             # エントリポイント
│   ...
├── public/
├── package.json
├── vite.config.ts
└── ...
```

### 開発・ビルド手順（ダッシュボードのみ）

1. 依存パッケージのインストール
    ```bash
    cd dashboard
    npm install
    ```
2. 開発サーバ起動
    ```bash
    npm run dev
    ```
3. 本番ビルド
    ```bash
    npm run build
    ```

---

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
