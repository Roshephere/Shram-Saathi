<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a default admin user
        // User::firstOrCreate([
        //     'name' => 'Admin User',
        //     'email' => 'test@example.com',
        //     'password' => Hash::make('password'), // Change this to a secure password
        //     'status' => 1, // Active status
        // ]);


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
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}