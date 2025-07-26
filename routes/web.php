<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GetImagesController;


Route::get('/', [GetImagesController::class, 'index']);

// FAQページ
Route::view('/faq', 'faq')->name('faq');
