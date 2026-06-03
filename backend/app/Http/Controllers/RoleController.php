<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\RoleService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    use ApiResponse;

    public function __construct(protected RoleService $roleService)
    {
    }


    public function index()
    {
        try {
            $roles = $this->roleService->getAllRoles();
            return $this->success($roles, 'Roles retrieved successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function show(string $role)
    {
        try {
            $role = $this->roleService->getRolesWithPermissions($role);
            if (!$role) {
                return $this->error('Role not found', 404);
            }
            return $this->success($role, 'Role details retrieved successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }

    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|unique:roles,name',
                'permissions' => 'nullable|array',
                'permissions.*' => 'string',
            ]);
            $role = $this->roleService->createRole($validated['name'], $validated['permissions'] ?? []);
            return $this->success($role, 'Role created successfully', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function destroy(string $role)
    {
        try {
            $this->roleService->deleteRole($role);
            return $this->success(null, 'Role deleted successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function assignRoleToUser(int $userId, Request $request)
    {
        try {
            $validated = $request->validate([
                'role' => 'required|string|exists:roles,name',
            ]);

            $user = $this->roleService->assignRoleToUser($userId, $validated['role']);
            return $this->success($user, 'Role assigned to user successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function removeRoleFromUser(int $userId, string $role)
    {
        try {
            $user = $this->roleService->removeRoleFromUser($userId, $role);
            return $this->success($user, 'Role removed from user successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function syncUserRoles(int $userId, Request $request)
    {
        try {
            $validated = $request->validate([
                'roles' => 'required|array',
                'roles.*' => 'string|exists:roles,name',
            ]);

            $user = $this->roleService->syncUserRoles($userId, $validated['roles']);
            return $this->success($user, 'User roles synced successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function getUserRoles(int $userId){
        try{
            $user = User::findOrFail($userId);
            $roles = $this->roleService->getUserRoles($userId);

            return $this->success(['user_id' => $userId, 'roles' => $roles], 'User roles retrieved successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function seedDefaults(){
        try {
            $created = $this->roleService->seedDefaultRoles();

            return $this->success(
                ['created_roles' => $created],
                'Default roles and permissions seeded successfully'
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
