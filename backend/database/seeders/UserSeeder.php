<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'phone' => '9800000001',
                'status' => '1',
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                'role' => 'worker',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'phone' => '9800000002',
                'status' => '1',
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                'role' => 'worker',
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael@example.com',
                'password' => Hash::make('password'),
                'phone' => '9800000003',
                'status' => '1',
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                'role' => 'customer',
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily@example.com',
                'password' => Hash::make('password'),
                'phone' => '9800000004',
                'status' => '1',
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                'role' => 'customer',
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david@example.com',
                'password' => Hash::make('password'),
                'phone' => '9800000005',
                'status' => '1',
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                'role' => 'worker',
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
                'phone' => '9800000006',
                'status' => '1',
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                'role' => 'worker',
            ],
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'phone' => '9800000000',
                'status' => '1',
                'registration_step' => 3,
                'registration_status' => 'complete',
                'registration_completed_at' => now(),
                'role' => 'admin',
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'] ?? 'customer';
            unset($userData['role']);

            $user = User::create($userData);
            $user->assignRole($role);
        }
    }
}