<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('Hello');
});

require __DIR__.'/auth.php';
