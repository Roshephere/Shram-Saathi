<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ServiceCategoryController extends Controller
{
    protected $fillable=[
        'parent_id',
        'name',
        'slug',
        'description',
        'is_active',
        'sort_order',
        'extra',
    ];
}
