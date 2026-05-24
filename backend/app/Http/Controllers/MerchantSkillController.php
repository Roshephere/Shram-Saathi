<?php

namespace App\Http\Controllers;

use App\Http\Requests\MerchantSkillRequest;
use App\Http\Resources\MerchantSkillResource;
use App\Models\MerchantSkill;
use App\Models\Skill;
use App\Models\User;
use App\Services\MerchantSkillsService;
use Illuminate\Http\Request;

class MerchantSkillController extends Controller
{

    public function  __construct(protected MerchantSkillsService $merchantSkillsService){

    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $merchantSkills = $this->merchantSkillsService->getAll();
        return $this->success(MerchantSkillResource::collection($merchantSkills), $merchantSkills->isEmpty() ? 'No merchant skills found.' : 'Merchant skills obtained successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = User::whereNot('role', 'admin')->get();
        $skill = Skill::all();
        return $this->success(['users' => $user, 'skills' => $skill], 'Data for creating merchant skill obtained successfully.');
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MerchantSkillRequest $request)
    {
        $merchantSkills = $this->merchantSkillsService->createMerchantSkill($request->validated());
        return $this->success(new MerchantSkillResource($merchantSkills), 'Merchant skill created successfully.', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MerchantSkill $merchantSkill)
    {
        return $this->success(new MerchantSkillResource($merchantSkill), 'Merchant skill obtained successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MerchantSkill $merchantSkill)
    {
        $data = $this->merchantSkillsService->editMerchantSkill($merchantSkill);
        return $this->success($data, 'Data for editing merchant skill obtained successfully.');       
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MerchantSkillRequest $request, MerchantSkill $merchantSkill)
    {
        $merchantSkill = $this->merchantSkillsService->updateMerchantSkill($merchantSkill->id, $request->validated());
        return $this->success(new MerchantSkillResource($merchantSkill), 'Merchant skill updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MerchantSkill $merchantSkill)
    {
        $this->merchantSkillsService->deleteMerchantSkill($merchantSkill->id);
        return $this->success(null, 'Merchant skill deleted successfully.');
    }
}
