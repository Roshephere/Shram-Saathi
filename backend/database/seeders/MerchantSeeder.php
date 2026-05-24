<?php

namespace Database\Seeders;

use App\Models\Merchant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MerchantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        $merchants = [
            [
                'user_id' => 1,
                'business_name' => 'Test Plumbing Services',
                'phone' => '9800000001',
                'logo' => null,
                'pan_no' => 'PAN-TEST-001',
                'location' => 'Kathmandu',
                'status' => 'active',
                // 'avg_rating' => 4.5,
                'hourly_rate' => 500,
                'extras' => [
                    'experience_years' => 3,
                    'available' => true,
                ],
                'verified_at' => now(),
            ],
            [
                'user_id' => 2,
                'business_name' => 'Roshab Electrical Works',
                'phone' => '9800000002',
                'logo' => null,
                'pan_no' => 'PAN-ROSHAB-002',
                'location' => 'Lalitpur',
                'status' => 'active',
                // 'avg_rating' => 4.7,
                'hourly_rate' => 650,
                'extras' => [
                    'experience_years' => 5,
                    'available' => true,
                ],
                'verified_at' => now(),
            ],
            [
                'user_id' => 5,
                'business_name' => 'Roshab Shahi Home Repair',
                'phone' => '9800000003',
                'logo' => null,
                'pan_no' => 'PAN-SHAHI-005',
                'location' => 'Bhaktapur',
                'status' => 'active',
                // 'avg_rating' => 4.3,
                'hourly_rate' => 450,
                'extras' => [
                    'experience_years' => 2,
                    'available' => true,
                ],
                'verified_at' => now(),
            ],
            [
                'user_id' => 6,
                'business_name' => 'John Doe Carpenter Service',
                'phone' => '9800000000',
                'logo' => null,
                'pan_no' => 'PAN-JOHN-006',
                'location' => 'Kathmandu',
                'status' => 'active',
                // 'avg_rating' => 4.8,
                'hourly_rate' => 700,
                'extras' => [
                    'experience_years' => 6,
                    'available' => true,
                ],
                'verified_at' => now(),
            ],
        ];

        foreach ($merchants as $merchant) {
            if (User::where('id', $merchant['user_id'])->exists()) {
                Merchant::updateOrCreate(
                    ['user_id' => $merchant['user_id']],
                    $merchant
                );
            }
        }
    }
}
