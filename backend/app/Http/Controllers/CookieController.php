<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class CookieController extends Controller
{
    public function handleSetCookie(){
        return response()->json(['fav_color'])->cookie('fav_color', 'blue', 60);
    }

    public function handleGetCookie(){
        // $cookie = Cookie::get('username');
        return request()->cookie('blue');
        return $cookie;

    }

    public function deleteCookie(){
       return response('Goodbye')->withoutCookie('blue');
    }
}
