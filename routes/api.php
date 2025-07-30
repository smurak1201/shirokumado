<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImageController;

Route::get('categories', [CategoryController::class, 'index']);
Route::get('images', [ImageController::class, 'index']);
Route::post('images/display-order', [ImageController::class, 'updateDisplayOrder']);
Route::patch('images/{id}', [ImageController::class, 'update']);
