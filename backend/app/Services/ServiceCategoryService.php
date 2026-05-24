<?php

namespace App\Services;

use App\Models\ServiceCategory;

class ServiceCategoryService{
    public function getAll(){
        return ServiceCategory::with('category')->get();
    }

    public function getById(int $id){
        return ServiceCategory::with('category')->findOrFail($id);
    }

    public function createServiceCategory(array $data){
        return ServiceCategory::create($data)   ;
    }

    public function updateServiceCategory(int $id, array $data){
        $category= $this->getById($id);
        $category = $category->update($data);
        return $category;
    }

    public function deleteServiceCategory($id){
        $category = $this->getById($id);
        $category= $category->delete();
        return true;
    }

}