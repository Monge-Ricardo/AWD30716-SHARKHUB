<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\BarbershopController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AvailabilityController;
use Illuminate\Support\Facades\Route;

// ─── Auth (públicas) ────────────────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::post('/auth/logout',   [AuthController::class, 'logout']);
Route::get('/auth/me',        [AuthController::class, 'me']);

// ─── Pública: info de la barbería (para visitantes) ────────────
Route::get('/barbershops/public',     [BarbershopController::class, 'publicInfo']);
Route::get('/barbershops/public/{id}',[BarbershopController::class, 'publicInfo']);

// ─── Rutas protegidas con sesión ────────────────────────────────
Route::middleware('session.auth')->group(function () {

    // Barbería
    Route::post('/barbershops',                                    [BarbershopController::class, 'store']);
    Route::get('/barbershops/mine',                                [BarbershopController::class, 'myBarbershop']);
    Route::put('/barbershops/{id}',                                [BarbershopController::class, 'update']);
    Route::get('/barbershops/{id}/members',                        [BarbershopController::class, 'getMembers']);
    Route::post('/barbershops/{id}/barbers',                       [BarbershopController::class, 'addBarber']);
    Route::delete('/barbershops/{barbershopId}/members/{memberId}',[BarbershopController::class, 'removeBarber']);

    // Búsqueda de usuarios
    Route::get('/users/search', [BarbershopController::class, 'searchUsers']);

    // Servicios y Productos
    Route::apiResource('barber/services', ServiceController::class);
    Route::apiResource('barber/products', ProductController::class);

    // Disponibilidad
    Route::get('/availabilities',  [AvailabilityController::class, 'index']);
    Route::post('/availabilities', [AvailabilityController::class, 'store']);

    // Citas
    Route::get('/appointments',              [AppointmentController::class, 'index']);
    Route::post('/appointments',             [AppointmentController::class, 'store']);
    Route::put('/appointments/{id}/status',  [AppointmentController::class, 'updateStatus']);
});