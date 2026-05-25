<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public information pages
|--------------------------------------------------------------------------
| Visible URLs such as /about, /service or /contact render the main layout.
| JavaScript then loads the corresponding partial content from /info/content.
*/

Route::get('/', function () {
    return view('info.index');
});

Route::get('/info/content/{section}', function (string $section) {
    $views = [
        'about' => 'info.about',
        'service' => 'info.service',
        'price' => 'info.price',
        'team' => 'info.team',
        'open' => 'info.open',
        'testimonial' => 'info.testimonial',
        'contact' => 'info.contact',
        'not-found' => 'info.404',
    ];

    abort_unless(array_key_exists($section, $views), 404);

    return view($views[$section]);
});

Route::get('/{page}', function () {
    return view('info.index');
})->where('page', 'about|service|price|team|open|testimonial|contact|404');

/*
|--------------------------------------------------------------------------
| Dashboards
|--------------------------------------------------------------------------
*/

Route::get('/barber/dashboard/{tab?}', function ($tab = 'agenda') {
    return view('barber.dashboard');
})->where('tab', 'agenda|services|products');

Route::get('/customer/dashboard/{tab?}', function ($tab = 'my-appointments') {
    return view('customer.dashboard');
})->where('tab', 'my-appointments|book-appointment|profile');

Route::get('/owner/dashboard/{tab?}', function ($tab = 'dashboard') {
    return view('owner.dashboard');
})->where('tab', 'dashboard|barbershop-info|manage-barbers|global-agenda');

/*
|--------------------------------------------------------------------------
| Customer authentication views
|--------------------------------------------------------------------------
*/

Route::get('/customer/login', function () {
    return view('customer.auth.login');
});

Route::get('/customer/register', function () {
    return view('customer.auth.register');
});
