<?php
namespace App\Services;

use App\Models\MerchantCategory;


class MerchantCategoryService{
    public function getAll(){
        return MerchantCategory::with(['merchant', 'category'])->get();
    }

    public function getById(int $id){
        return MerchantCategory::with(['merchant', 'category'])->findOrFail($id);
    }

    public function createMerchantCategory(array $data){
        return MerchantCategory::create($data)   ;
    }

    public function updateMerchantCategory(int $id, array $data){
        $category= $this->getById($id);
        $category->update($data);
        return $category->fresh();
    }

    public function deleteMerchantCategory($id){
        $category = $this->getById($id);
        $category= $category->delete();
        return true;
    }

}