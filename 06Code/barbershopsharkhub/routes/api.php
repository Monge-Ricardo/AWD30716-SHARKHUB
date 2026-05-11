<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ProductController;

Route::apiResource('barber/services', ServiceController::class);
Route::apiResource('barber/products', ProductController::class);