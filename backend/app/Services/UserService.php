<?php

namespace App\Services;

use App\Models\User;

class UserService
{

    public function getAll()
    {
        return User::latest()->paginate(15);
    }

    public function getById(int $id){
        return User::findOrFail($id);
    }

    public function deleteUser(int $id){
        $user= $this->getById($id);
        $user->delete();
        return true;
    }
}