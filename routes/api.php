<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ImagesController;

Route::get('images', [ImagesController::class, 'index']);
