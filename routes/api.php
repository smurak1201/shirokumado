<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;

// タグ一覧取得（画像編集・追加画面用）
Route::get('tags', [TagController::class, 'index']);
// カテゴリー一覧取得（画像編集・追加画面用）
Route::get('categories', [CategoryController::class, 'index']);
// 画像一覧取得（設定画面・一覧表示用）
Route::get('images', [ImageController::class, 'index']);
// 画像新規登録（画像追加画面用）
Route::post('images', [ImageController::class, 'store']);
// 画像表示順更新（ドラッグ&ドロップ等での順序変更用）
Route::post('images/display-order', [ImageController::class, 'updateDisplayOrder']);
// 画像情報更新（画像編集画面用）
Route::patch('images/{id}', [ImageController::class, 'update']);
// 画像削除（設定画面の削除ボタン用）
Route::delete('images/{id}', [ImageController::class, 'destroy']);
