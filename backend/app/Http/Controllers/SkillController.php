<?php

namespace App\Http\Controllers;

use App\Http\Requests\SkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Merchant;
use App\Models\Skill;
use App\Services\SkillService;
use Exception;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function __construct( protected SkillService $skillService){}
    public function index()
    {
        $skills = $this->skillService->getAll();
        // dd($skills);
        if($skills)
        return $this->success( SkillResource::collection($skills),'Skills have been retrieved successfully.');

        return $this->error('Failed to get the skills');
    }

    public function show(Skill $skill){
        // dd($skill);

        return $this->success( new SkillResource($skill),'Skill obtained successfully.');
    }

    public function store(SkillRequest $request)
    {
        // dd($request->all());
        $validated = $request->validated();

        if (!$validated) {
            // return response()->json([
            //     'success' => false,
            //     'message' => 'Failed to create skills',
            // ]);
            return $this->error('Failed to create Skills');
        }

        $skill = $this->skillService->createSkill($validated);    

        return $this->success(new SkillResource($skill),'Skills Created Successfully.');
    }

    public function update(SkillRequest $request, Skill $skill)
    {
        // dd($request->all());
        // dd($request->method(), $request->headers->all(), $request->getContent());

        $validated = $request->validated();

        try{
            $this->skillService->updateSkill($skill->id, $validated);
            return $this->success(new SkillResource($skill),' skills updated successfully.',);

        }catch(Exception $e){
            return $this->error('Failed to update the skill');
        }
    }

    public function destroy(Skill $skill)
    {
       $data=  $this->skillService->deleteSkill($skill->id);

       if(!$data)    
        return $this->error('Skill Failed to Deleted.');

        return $this->success($data,'Skill deleted successfully.');

    }

    public function attachToMerchant(Request $request, Merchant $merchant)
    {
        $validated = $request->validate([
            'skills' => 'required|array|max:10',
            'skills.*' => 'string|max:50',
        ]);

        if ($merchant->skills()->count() > 10) {
            return $this->error('You can only add up to 10 skills.');
        }

        foreach ($validated['skills'] as $skillName) {
            $skill = Skill::firstOrCreate(['name' => ucfirst(strtolower($skillName))]);
            $merchant->skills()->syncWithoutDetaching([$skill->id]);
        }

        return response()->json([
            'message' => 'Skills attached successfully.',
            'skills' => $merchant->skills(),
        ]);
    }

    public function detachFromMerchant(Merchant $merchant, Skill $skill)
    {
        $merchant->skills()->detach($skill->id);
        return response()->json([
            'message' => 'Skill detached successfully,',
            'skills' => $merchant->skills,
        ]);
    }

}
