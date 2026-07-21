<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class MerchantController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'business_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'pan_no' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:50',
            'avg_rating' => 'nullable|numeric|min:0|max:5',
            'hourly_rate' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'extras' => 'nullable|array',
            // 'status' => 'in:pending,active,suspended',
        ]);
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        }
        $validated['status'] = 'pending';

        $merchant = Merchant::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Merchant Created successfully.',
            'merchant' => $merchant,
        ], 200);
    }


    public function show(Merchant $merchant)
    {
        // dd($merchant->load('serviceCategories'));
        return response()->json([
            'merchant' => $merchant->load('serviceCategories'),
        ]);
    }

    public function update(Request $request, Merchant $merchant)
    {
        $validated = $request->validate([
            'business_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'pan_no' => 'nullable|string|max:255',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'avg_rating' => 'nullable|numeric|min:0|max:5',
            'hourly_rate' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'extras' => 'nullable|array',
            // 'status' => 'in:pending,active,suspended',
        ]);
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        }
        $merchant->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Merchant updated successfully.',
            'merchant' => $merchant,
        ]);
    }

    public function destroy(Merchant $merchant)
    {
        $merchant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Merchant successfully deleted.',
        ]);
    }

    public function index()
    {
        return Cache::remember('merchant', 60, function () {
            return Merchant::all();
        });
    }

    public function allWithoutCaching()
    {
        return Merchant::all();
    }
}
