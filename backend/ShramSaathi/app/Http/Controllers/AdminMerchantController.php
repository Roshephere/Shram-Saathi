<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use Illuminate\Http\Request;

class AdminMerchantController extends Controller
{
public function update(Request $request, Merchant $merchant)
{
    $validated = $request->validate([
        'business_name' => 'nullable|string|max:255',
        'phone'         => 'nullable|string|max:255',
        'pan_no'        => 'nullable|string|max:255',
        'logo'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'location'      => 'nullable|string|max:255',
        'extras'        => 'nullable|array',
        'status'        => 'in:pending,active,suspended',
    ]);

    if ($request->hasFile('logo')) {
        $path = $request->file('logo')->store('logos', 'public');
        $validated['logo'] = $path;
    }

    $merchant->update($validated);

    if($request->status){
        $merchant->update([
            'status'=> $request->status,
        ]);
    }

    return response()->json([
        'success' => true,
        'message' => 'Merchant updated successfully by admin.',
        'merchant' => $merchant,
    ]);
}

/**
 * Verify merchant (set status to active and record timestamp).
 */
public function verify(Merchant $merchant)
{
    $merchant->update([
        'status'      => 'active',
        'verified_at' => now(),
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Merchant verified successfully.',
        'merchant' => $merchant,
    ]);
}

/**
 * Suspend merchant.
 */
public function suspend(Merchant $merchant)
{
    $merchant->update([
        'status' => 'suspended',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Merchant suspended successfully.',
        'merchant' => $merchant,
    ]);
}
}
