<?php

namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    /**
     * Assign role to user
     */

    public function assignRoleToUser(int $userId, string $role)
    {
        $user = User::findOrFail($userId);

        if (!Role::where('name', $role)->exists()) {
            throw new \Exception("Role not found");
        }

        $user->assignRole($role);
        return $user->load('roles');

    }

    public function removeRoleFromUser(int $userId, string $role)
    {
        $user = User::findOrFail($userId);

        $user->removeRole($role);

        return $user->load('roles');
    }

    public function syncUserRoles(int $userId, array $roles)
    {
        $user = User::findOrFail($userId);

        foreach ($roles as $role) {
            if (!Role::where('name', $role)->exists()) {
                throw new \Exception("Role not found: $role");
            }
        }

        $user->syncRoles($roles);
        return $user->load('roles');
    }

    public function getAllRoles()
    {
        return Role::all(['id', 'name', 'guard_name'])->toArray();
    }

    public function getUserRoles(int $userId)
    {
        $user = User::findOrFail($userId);
        return $user->getRoleNames()->toArray();
    }

    public function userHasRole(int $userId, string $role)
    {
        $user = User::findOrFail($userId);
        return $user->hasRole($role);
    }

    public function createRole(string $name, array $permissions = [])
    {

        if (Role::where('name', $name)->exists()) {
            throw new \Exception("Role already exists");
        }

        $role = Role::create(['name' => $name, 'guard_name' => 'sanctum']);

        if (!empty($permissions)) {
            $role->syncPermissions($permissions);
        }

        return $role->load('permissions');
    }

    public function deleteRole(string $name)
    {

        $role = Role::where('name', $name)->firstOrFail();
        return $role->delete();
    }

    public function getRolesWithPermissions(string $role)
    {
        $role = Role::where('name', $role)->with('permissions')->firstOrFail();
        return $role;
    }

    /**
     * Seed default roles and permissions
     */
    public function seedDefaultRoles(): array
    {
        $roles = [
            'admin' => ['manage_merchants', 'view_dashboard', 'manage_transactions', 'verify_merchants'],
            'customer' => ['post_request', 'hire_merchant', 'leave_review', 'view_recommendations'],
            'merchant' => ['view_jobs', 'accept_job', 'complete_job', 'view_earnings'],
            'worker' => ['view_jobs', 'accept_job', 'complete_job', 'view_earnings'],
        ];

        $created = [];

        foreach ($roles as $roleName => $permissions) {
            if (!Role::where('name', $roleName)->exists()) {
                // Create permissions first
                $permissionObjects = [];
                foreach ($permissions as $permissionName) {
                    $permissionObjects[] = Permission::firstOrCreate(['name' => $permissionName]);
                }

                // Create role
                $role = Role::create(['name' => $roleName, 'guard_name' => 'sanctum']);

                // Assign permissions
                foreach ($permissionObjects as $permission) {
                    $role->givePermissionTo($permission);
                }

                $created[] = $roleName;
            }
        }

        return $created;
    }

}