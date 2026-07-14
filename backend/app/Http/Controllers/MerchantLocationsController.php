<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerchantLocationRequest;
use App\Models\Merchant;
use App\Models\MerchantLocation;
use App\Models\MerchantLocations;
use App\Services\MerchantLocationService;
use Illuminate\Http\Request;

class MerchantLocationsController extends Controller
{

    public function __construct(protected MerchantLocationService $merchantLocationService){

    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $location = $this->merchantLocationService->getAll();
        return  $this->success($location, $location->isEmpty() ? 'No records found for merchant locations.' : 'Merchant location obtained successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MerchantLocationRequest $request)
    {
        $location =$this->merchantLocationService->createMerchantLocation($request->validated());
        return $this->success($location, 'Merchant location created successfully.', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MerchantLocation $merchantLocation)
    {
        $id = $merchantLocation->id;
        $location = $this->merchantLocationService->getById($id);
        return $this->success($location, 'Merchant location obtained successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MerchantLocation $merchantLocation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MerchantLocationRequest $request, MerchantLocation $merchantLocation)
    {
        // dd($merchantLocation); 
        $id = $merchantLocation->id;
        $location = $this->merchantLocationService->updateMerchantLocation($id, $request->validated());
        return $this->success($location, 'Merchant location updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MerchantLocation $merchantLocation)
    {
        $id = $merchantLocation->id;
        $this->merchantLocationService->deleteMerchantLocation($id);
        return $this->success(null, 'Merchant location deleted successfully.');
    }
}
