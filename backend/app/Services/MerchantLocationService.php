<?php

namespace App\Services;

use App\Models\Merchant;
use App\Models\MerchantLocation;


class MerchantLocationService{

    public function getAll(){
        return MerchantLocation::with('merchant')->get();
    }

    public function getById(int $id){
        return MerchantLocation::with('merchant')->findOrFail($id);
    }

    public function createMerchantLocation(array $data){
        
        return MerchantLocation::create($data)   ; 
    }

    public function editMerchantLocation(MerchantLocation $merchantLocation){
        return [
            'merchantLocation' => $merchantLocation,
            'merchants' => $merchantLocation->merchant()->get()
        ];
    }
    
    public function updateMerchantLocation(int $id, array $data){
        $location = $this->getById($id);
        $location = $location->update($data);
        return $location;
    }

    public function deleteMerchantLocation(int $id){
        $location =$this->getById($id);
        return $location->delete();
    }
}