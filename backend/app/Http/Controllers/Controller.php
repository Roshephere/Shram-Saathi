<?php

namespace App\Http\Controllers;

use App\Traits\ApiResponse;

use Illuminate\Routing\Controller as Basecontroller;

abstract class Controller extends Basecontroller
{
    use ApiResponse;
}
