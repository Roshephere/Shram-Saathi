<?php

namespace App\Http\Controllers;

use App\Models\MerchantCategory;
use Illuminate\Http\Request;

class MerchantCategoryController extends Controller
{
    public function index()
    {
        $categories = MerchantCategory::with(['merchant', 'category'])->get();
        return response()->json($categories);
    }
}
