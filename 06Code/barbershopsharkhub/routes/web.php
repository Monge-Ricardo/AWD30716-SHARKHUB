<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BarbershopController;
use App\Http\Controllers\Api\AppointmentController;

// ─── Rutas de datos del Owner Dashboard (web middleware = sesión disponible) ──
Route::prefix('owner/data')->middleware('web')->group(function () {
    // Info de la barbería del owner autenticado
    Route::get('/barbershop', [BarbershopController::class, 'myBarbershop']);
    Route::put('/barbershop', function (\Illuminate\Http\Request $request) {
        // Obtener la barbería del owner desde la sesión
        $barbershopId = session('barbershop_id');
        if (!$barbershopId) return response()->json(['message' => 'No barbershop'], 404);
        $req = $request; $req->merge(['_barbershop_id' => $barbershopId]);
        return app(BarbershopController::class)->update($req, $barbershopId);
    });
    // Barberos
    Route::get('/members',  [BarbershopController::class, 'getMembersFromSession']);
    Route::post('/members', [BarbershopController::class, 'addBarberFromSession']);
    Route::delete('/members/{memberId}', [BarbershopController::class, 'removeBarberFromSession']);
    // Buscar usuario
    Route::get('/search-user', [BarbershopController::class, 'searchUsers']);
    // Citas
    Route::get('/appointments', [AppointmentController::class, 'ownerAppointments']);
});

Route::get('/', function () {
    return view('info.index');
});

Route::get('/about', function () {
    return view('info.about');
});

Route::get('/contact', function () {
    return view('info.contact');
});

Route::get('/price', function () {
    return view('info.price');
});

Route::get('/service', function () {
    return view('info.service');
});

Route::get('/team', function () {
    return view('info.team');
});

Route::get('/testimonial', function () {
    return view('info.testimonial');
});

Route::get('/open', function () {
    return view('info.open');
});

Route::get('/barber/dashboard', function () {
    return view('barber.dashboard');
});

Route::get('/customer/dashboard', function () {
    return view('customer.dashboard');
});

Route::get('/owner/dashboard', function () {
    if (!session('user_id')) {
        return redirect('/customer/login');
    }
    return view('owner.dashboard', [
        'sessionUserId'      => session('user_id'),
        'sessionUserName'    => session('user_name'),
        'sessionUserEmail'   => session('user_email'),
        'sessionBarbershopId'=> session('barbershop_id'),
    ]);
});

Route::get('/404', function () {
    return view('info.404');
});

Route::get('/customer/login', function () {
    return view('customer.auth.login');
})->name('login');

Route::get('/customer/register', function () {
    return view('customer.auth.register');
});