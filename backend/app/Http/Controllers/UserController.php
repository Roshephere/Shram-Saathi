<?php

namespace App\Http\Controllers;

use App\Models\MerchantReview;
use App\Http\Resources\MerchantReviewResource;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(protected UserService $userService){

    }

    public function index(){
        $users = $this->userService->getAll();
        return $this->success($users, 'User retrived successfully. ', 200);
    }

    public function show(int $id){
        $user = $this->userService->getById($id);
        return $this->success($user, 'User retrived Successfully. ', 200);
    }

    public function destroy(int $id){
        $this->userService->deleteUser($id);
        return $this->success(null, 'User deleted successfully.', 200);
    }

    /**
     * Get reviews written by the authenticated user
     * GET /user/reviews
     */
    public function reviews()
    {
        $reviews = MerchantReview::where('user_id', auth()->id())
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return $this->success(
            MerchantReviewResource::collection($reviews),
            'Reviews retrieved successfully.'
        );
    }
}
