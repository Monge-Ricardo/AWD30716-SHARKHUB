<?php

use Illuminate\Support\Facades\Route;

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
    return view('owner.dashboard');
});

Route::get('/404', function () {
    return view('info.404');
});

Route::get('/customer/login', function () {
    return view('customer.auth.login');
});

Route::get('/customer/register', function () {
    return view('customer.auth.register');
});