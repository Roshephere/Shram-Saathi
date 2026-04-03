<?php

// use App\Http\Controllers\CookieController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('Hello');
});


require __DIR__.'/auth.php';
