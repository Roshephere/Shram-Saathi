<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceCategoryRequest;
use App\Http\Resources\ServiceCategoryResource;
use App\Services\ServiceCategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceCategoryController extends Controller
{
    public function  __construct(protected ServiceCategoryService $serviceCategoryService)
    {
    }
    public function index(){
        $serviceCategories = $this->serviceCategoryService->getAll();
        return $this->success(ServiceCategoryResource::collection ($serviceCategories), $serviceCategories->isEmpty() ? 'No service categories found.' : 'Service categories obtained successfully.');
    }

    public function show($id)
    {
        $serviceCategory = $this->serviceCategoryService->getById($id);
        if(!$serviceCategory){
            return $this->error('Service category not found.', 404);
        }
        return $this->success(new ServiceCategoryResource($serviceCategory), 'Service category obtained successfully.');
    }

    public function store(ServiceCategoryRequest $serviceCategoryRequest){{
        $validatedData = $serviceCategoryRequest->validated();
        
        try{
            $serviceCategory = $this->serviceCategoryService->createServiceCategory($validatedData);
            return $this->success(new ServiceCategoryResource($serviceCategory), 'Service category created successfully.', 201);
        }catch(\Exception $e){
            Log::error('Service Category Store Error', ['error' => $e->getMessage()]);
            return $this->error('Failed to create service category.', 500);
        }   
    }
    }

    public function update(ServiceCategoryRequest $serviceCategoryRequest, $id){
        $validatedData = $serviceCategoryRequest->validated();

        try{
            $serviceCategory = $this->serviceCategoryService->updateServiceCategory($id, $validatedData);
            if($serviceCategory){
                return $this->success(new ServiceCategoryResource($serviceCategory), 'Service Category updated succcessfully.');
            }
        }catch(\Exception $e){
            Log::error('Service Category Update Error', ['error' => $e->getMessage()]);
            return $this->error('Failed to update service category.', 500);
        }
    }

    public function destroy($id){
        try{
            $deleted = $this->serviceCategoryService->deleteServiceCategory($id);
            if($deleted){
                return $this->success(null, 'Service category deleted successfully.');
            }else{
                return $this->error('Service category not found.', 404);
            }
        }catch(\Exception $e){
            Log::error('Service Category Delete Error', ['error' => $e->getMessage()]);
            return $this->error('Failed to delete service category.', 500);

        }
    }
}
