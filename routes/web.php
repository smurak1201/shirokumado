<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GetImagesController;

use App\Http\Controllers\ImageController;


Route::get('/', [GetImagesController::class, 'index']);

// 商品詳細ページ
Route::get('/images/{id}', [ImageController::class, 'show'])->name('images.show');

// Instagram投稿一覧ページ
Route::view('/instagram', 'instagram')->name('instagram');

// FAQページ
Route::view('/faq', 'faq')->name('faq');
