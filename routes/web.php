<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LimitedMenuController;

Route::get('/', [LimitedMenuController::class, 'index']);
