<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index(){
        $skills = Skill::all();
        return response()->json([
            'success' => true,
            'message' => 'fetched skills successfully,',
            'skills' => $skills,
        ]);
    }
public function store(Request $request){
    $validated = $request->validate([
        'name'=> 'required|string|max:50|unique:skills,name',
        'description'=> 'nullable|string| max:255',
    ]);

    if(!$validated){
    return response()->json([
        'success'=> false,
        'message'=> 'Failed to create skills',
    ]);
    }

    $skill = Skill::create($validated);

    return response()->json([
        'success'=> true,
        'message'=> 'Skills created successfully.',
        'skill'=> $skill,
    ]);
}

public function destroy(Skill $skill){
    $skill->delete();

    return response()->json([
        'success' =>true,
        'message'=> 'Skill deleted successfully.',
    ]);
}

public function attachToMerchant(Request $request, Merchant $merchant){
    $validated = $request->validate([
        'skills' => 'required|array|max:10',
        'skills.*' => 'string|max:50',
    ]);
    
    if($merchant->skills()->count() > 10){
        return response()->json([
            'message'=> 'You can only add up to 10 skills.',
        ],400);
    }

    foreach( $validated['skills'] as $skillName){
        $skill = Skill::firstOrCreate(['name'=> ucfirst(strtolower($skillName))]);
        $merchant->skills()->syncWithoutDetaching([$skill->id]);
    }

    return response()->json([
        'message'=> 'Skills attached successfully.',
        'skills'=> $merchant->skills(),
    ]);
}

public function detachFromMerchant(Merchant $merchant, Skill $skill){
    $merchant->skills()->detach($skill->id);
    return response()->json([
        'message'=> 'Skill detached successfully,',
        'skills'=> $merchant->skills,
    ]);
}

}
