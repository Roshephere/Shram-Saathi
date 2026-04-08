<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Define permissions
        $permissions = [
            // User management
            'manage users', 'view users', 'update user profile', 'delete users', 'block users', 'assign roles',

            // Worker management
            'view workers', 'update worker profile', 'verify workers',
            'manage worker categories', 'manage worker skills', 'manage worker locations',
            'manage worker availability', 'manage worker certifications',
            'manage worker portfolios',

            // Service requests
            'create service request', 'view service requests', 'update service requests',
            'delete service requests', 'assign workers to requests', 'close service requests',

            // Reviews
            'create worker review', 'view worker reviews', 'delete worker reviews', 'verify reviews',

            // Recommendations
            'run recommendation', 'view recommendation results', 'manage recommendation models',
            'audit recommendation runs', 'give recommendation feedback',

            // System administration
            'manage roles', 'manage permissions', 'manage categories', 'manage skills', 'manage system settings',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        // Roles
        $customer = Role::firstOrCreate(['name' => 'customer']);
        $customer->givePermissionTo(['create service request', 'view service requests', 'create worker review']);

        $worker = Role::firstOrCreate(['name' => 'worker']);
        $worker->givePermissionTo([
            'view service requests', 'update worker profile', 'manage worker skills',
            'manage worker locations', 'manage worker categories'
        ]);

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());
    
    }
}
