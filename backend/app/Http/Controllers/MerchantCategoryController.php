<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerchantCategoryRequest;
use App\Http\Resources\MerchantCategoryResource;
use App\Models\MerchantCategory;
use App\Services\MerchantCategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MerchantCategoryController extends Controller
{

    public function __construct(protected MerchantCategoryService $merchantCategoryService)
    {

    }
    public function index()
    {
        $categories = $this->merchantCategoryService->getAll();
        return $this->success(MerchantCategoryResource::collection($categories), $categories->isEmpty() ? 'No merchant categories found.' : 'Merchant categories obtained successfully.');
    }

    public function show($id)
    {
        $category = MerchantCategory::with(['merchant', 'category'])->findOrFail($id);
        return $this->success(new MerchantCategoryResource($category));
    }

    public function store(MerchantCategoryRequest $request)
    {
        $validatedData = $request->validated();

        try {
            $category = $this->merchantCategoryService->createMerchantCategory($validatedData);
            return $this->success(new MerchantCategoryResource($category), 'Merchant category created successfully.', 201);
        }catch(\Exception $e){
            Log::error('Merchant Category Store Error', ['error' => $e->getMessage()]);
            return $this->error('Failed to create Merchant Categeory.', 500);   
        }
    }

    public function update(MerchantCategoryRequest $request, $id)
    {
        $validatedData = $request->validated();

        try{
            $category = $this->merchantCategoryService->updateMerchantCategory($id, $validatedData);
            return $this->success(new MerchantCategoryResource($category), 'Merchant category updated successfully.');
            ;
            
        }catch(\Exception $e){
            Log::error('Merchant Category Update Error', ['error' => $e->getMessage()]);
            return $this->error('Failed to update Merchant Category.', 500);   
        }
    }

    public function destroy($id)
    {
        try{
            $this->merchantCategoryService->deleteMerchantCategory($id);
            return $this->success(null, 'Merchant category deleted successfully.');
            
        }catch(\Exception $e){
            Log::error('Merchant Category Delete Error',['error' => $e->getMessage()]);
            return $this->error('Failed to delete Merchant Category.', 500);
        }
    }
}
