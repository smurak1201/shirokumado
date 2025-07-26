<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GetImagesController;


Route::get('/', [GetImagesController::class, 'index']);

// Instagram投稿一覧ページ
Route::view('/instagram', 'instagram')->name('instagram');

// FAQページ
Route::view('/faq', 'faq')->name('faq');
