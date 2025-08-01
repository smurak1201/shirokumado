## 白熊堂 ホームページ

このリポジトリは、かき氷店「白熊堂」の公式ホームページのソースコードです。
Laravel で Web サイト本体、React でダッシュボードを SPA 構成で開発した学習向けプロジェクトです。

---

**このリポジトリの設計・解説・コード生成には GitHub Copilot を活用しています。**
Copilot は 2025 年 8 月時点までのデータ・知識を元に提案・生成を行っています。

---

## 学習の進め方・ソースコード理解の順番

### 1. まずはディレクトリ構成を把握

```
shirokumado/
├── app/                    # Laravel アプリケーション本体
│   ├── Models/             # Eloquent モデル
│   ├── Http/Controllers/   # コントローラー
│   └── Providers/          # サービスプロバイダー
├── database/               # DB設計・データ
│   ├── migrations/         # テーブル定義
│   └── seeders/           # 初期データ
├── resources/              # フロントエンド（Blade）
│   ├── views/             # Bladeテンプレート
│   ├── css/               # スタイル
│   └── js/                # JavaScript
├── routes/                 # ルーティング定義
├── public/                 # 公開ディレクトリ
└── dashboard/              # React管理画面（独立したSPA）
    └── src/
        ├── App.tsx         # メインコンポーネント
        ├── components/     # UIコンポーネント群
        ├── hooks/          # カスタムフック群
        ├── constants/      # 定数定義
        └── utils/          # ユーティリティ関数
```

### 2. 学習の順序

**Step 1: データベース設計を理解**

-   `database/migrations/` でテーブル構造を確認
-   `database/seeders/` で初期データの投入ロジックを確認

**Step 2: Laravel（Web サイト本体）**

-   `routes/web.php` で URL 設計を確認
-   `app/Http/Controllers/` でビジネスロジックを確認
-   `app/Models/` でデータモデルを確認
-   `resources/views/` で UI（Blade）を確認

**Step 3: React（管理ダッシュボード）**

-   `dashboard/src/App.tsx` からメイン画面の構成を確認
-   `dashboard/src/hooks/` で React の状態管理パターンを学習
-   `dashboard/src/components/` でコンポーネント設計を確認

---

## Laravel Web サイト本体

### 使用技術と設計思想

-   **PHP 8.x + Laravel 10.x**: MVC アーキテクチャによる Web アプリケーション
-   **Blade テンプレートエンジン**: サーバーサイドレンダリング
-   **Tailwind CSS**: ユーティリティファーストな CSS 設計
-   **MySQL**: リレーショナルデータベース
-   **Eloquent ORM**: Laravel の標準 ORM

### 主な機能

-   メニュー画像の一覧・詳細表示
-   画像のタグ・カテゴリー管理
-   REST API 提供（ダッシュボード連携用）

### ディレクトリ構成と役割

```
app/
├── Models/
│   ├── Image.php           # 画像モデル（画像情報・リレーション定義）
│   └── User.php            # ユーザーモデル
├── Http/Controllers/
│   └── ImageController.php # 画像操作のビジネスロジック
└── Providers/
    ├── AppServiceProvider.php     # アプリケーション設定
    └── RouteServiceProvider.php   # ルーティング設定

database/
├── migrations/
│   ├── create_images_table.php     # 画像テーブル定義
│   ├── create_categories_table.php # カテゴリーテーブル定義
│   ├── create_tags_table.php       # タグテーブル定義
│   └── create_image_tag_table.php  # 中間テーブル（多対多）
└── seeders/
    ├── ImagesTableSeeder.php       # 画像初期データ
    ├── CategoriesTableSeeder.php   # カテゴリー初期データ
    └── TagsTableSeeder.php         # タグ初期データ

resources/views/
├── layout.blade.php        # 共通レイアウト
├── index.blade.php         # トップページ
└── components/             # Bladeコンポーネント

routes/
├── web.php                 # Webルート定義
└── api.php                 # API ルート定義（ダッシュボード用）
```

---

## React 管理ダッシュボード

### 使用技術と設計思想

-   **React 18 + TypeScript**: 関数コンポーネント + Hooks
-   **Vite**: 高速ビルドツール
-   **Tailwind CSS**: デザインシステム
-   **@hello-pangea/dnd**: ドラッグ&ドロップ
-   **カスタムフック**: ロジック分離・再利用性向上
-   **React 公式理念**: 単一責任・宣言的 UI・パフォーマンス最適化

### 主な機能

-   画像メニューのドラッグ＆ドロップ並び替え
-   タグ・カテゴリー・公開状態による絞り込み・検索
-   画像の追加・編集・削除
-   並び順の自動保存・手動保存
-   ページネーション対応

### ディレクトリ構成と役割

```
dashboard/src/
├── App.tsx                 # メインコンポーネント（全体の状態管理・画面構成）
├── MenuSection.tsx         # 並び替えセクション（DnD対応）
├── main.tsx               # Reactエントリポイント
├── index.css              # グローバルスタイル
├── vite-env.d.ts          # Vite型定義
├── components/            # UIコンポーネント群
│   ├── ImageAddForm.tsx       # 画像追加フォーム（ファイルアップロード・バリデーション）
│   ├── ImageEditForm.tsx      # 画像編集フォーム（削除機能含む）
│   ├── ImageEditSection.tsx   # 編集セクション全体（複数画像管理）
│   ├── Pagination.tsx         # ページネーション（前後移動・件数表示）
│   └── SearchFilters.tsx      # 検索フィルター（カテゴリー・タグ・公開状態）
├── hooks/                 # カスタムフック群（状態管理・ロジック分離）
│   ├── useCategoryTags.ts     # カテゴリー・タグ取得
│   ├── useDisplayOrderUpdate.ts # 並び順DB保存
│   ├── useImageApi.ts         # 画像API操作（保存・削除）
│   ├── useImageFiltering.ts   # 画像絞り込みロジック
│   ├── useMenuManagement.ts   # メニュー並び替え・DnD管理
│   ├── usePagination.ts       # ページネーション管理
│   ├── useSearchFilters.ts    # 検索フィルター状態管理
│   └── useTabManagement.ts    # タブ状態管理（LocalStorage永続化）
├── constants/             # 定数定義
│   └── tags.ts                # タグID・カテゴリー名・タブ定数
└── utils/                 # ユーティリティ関数
    └── imageFilters.ts        # 画像フィルタリング関数群
```

### 設計の考え方

**1. カスタムフックによる責任分離**

-   UI（JSX）とロジック（状態管理・API）を分離
-   機能単位でフックを作成し、再利用性を向上

**2. コンポーネント設計**

-   単一責任の原則（1 つのコンポーネント = 1 つの機能）
-   Props 型定義による型安全性
-   React.memo によるパフォーマンス最適化

**3. ファイル読解の推奨順序**

1. `dashboard/src/App.tsx` - 全体構成を把握
2. `dashboard/src/hooks/` - 状態管理パターンを学習
3. `dashboard/src/components/` - UI 部品の構成を確認
4. `dashboard/src/constants/` `dashboard/src/utils/` - 共通ロジックを確認

---

## 学習のポイント

### Laravel 部分で学べること

-   MVC アーキテクチャの実装
-   Eloquent ORM によるデータベース操作
-   Blade テンプレートエンジンの活用
-   REST API 設計

### React 部分で学べること

-   関数コンポーネント + Hooks のモダン開発
-   カスタムフックによる状態管理・ロジック分離
-   TypeScript による型安全なフロントエンド開発
-   パフォーマンス最適化（React.memo、useCallback、useMemo）
-   ドラッグ&ドロップの実装

### 全体で学べること

-   フロントエンド（React）とバックエンド（Laravel）の連携
-   REST API を介したデータ通信
-   フォルダ構成・ファイル分割の設計思想
-   保守性・可読性を意識したコード構成

---

### ライセンス

MIT License
