<?php
namespace App\Services;

use App\Models\Skill;

class SkillService{
    // public function __construct(
        
    // );
    public function getAll(){
        return Skill::latest()->get();
    }

    public function getById($id){
        return Skill::findOrFail($id);
    }

    public function createSkill(array $data){
        return Skill::create($data);
    }


    public function updateSkill(int $id, array $data){
        $skill = $this->getById($id);
        $skill = $skill->update($data);
        return $skill;
    }

    public function deleteSkill($id){
        $skill = $this->getById($id);
        $skill->delete();
        return true;
    }
}