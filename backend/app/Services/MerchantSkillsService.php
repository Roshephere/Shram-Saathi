<?php

namespace App\Services;

use App\Http\Resources\MerchantSkillResource;
use App\Models\MerchantSkill;
use App\Models\Skill;
use App\Models\User;

class MerchantSkillsService{
    public function getAll(){
        return MerchantSkill::with(['merchant', 'skill'])->get();
    }

    public function getById(int $id){
        return MerchantSkill::with(['merchant', 'skill'])->findOrFail($id);
    }

    public function createMerchantSkill(array $data){
        return MerchantSkill::create($data)   ; 
    }

    public function editMerchantSkill(MerchantSkill $merchantSkill){
        $users = User::whereNot('role', 'admin')->get();
        $skills = Skill::all();
        return [
            'merchantSkill' => new MerchantSkillResource($merchantSkill),
            'users' => $users,
            'skills' => $skills
        ];
    }

    public function updateMerchantSkill(int $id, array $data){
        $skill = $this->getById($id);
        $skill = $skill->update($data);
        return $skill;
    }

    public function deleteMerchantSkill($id){
        $skill = $this->getById($id);
        $skill= $skill->delete();
        return true;
    }
}