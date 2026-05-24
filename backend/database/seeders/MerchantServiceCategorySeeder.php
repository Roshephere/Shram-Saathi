<?php

namespace Database\Seeders;

use App\Models\Merchant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MerchantServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        /*
         * Service category IDs:
         *
         * 1  = Plumbing Services
         * 2  = Leak Repair
         * 3  = Drain Cleaning
         * 4  = Bathroom Plumbing
         * 5  = Water Heater Repair
         * 6  = Pipe Installation
         *
         * 7  = Electrical Services
         * 8  = Wiring Installation
         * 9  = Light Installation
         * 10 = Fan Installation
         * 11 = Switch & Socket Repair
         * 12 = Breaker & Fuse Repair
         *
         * 13 = HVAC Services
         * 14 = AC Repair
         * 15 = AC Installation
         * 16 = AC Maintenance
         * 17 = Heating Repair
         *
         * 18 = Appliance Repair
         * 19 = Washing Machine Repair
         * 20 = Refrigerator Repair
         * 21 = Microwave Repair
         * 23 = Water Purifier Repair
         *
         * 35 = Carpentry Services
         * 36 = Door Repair
         * 37 = Furniture Assembly
         * 38 = Cabinet Repair
         * 39 = Custom Woodwork
         */

        $merchantServices = [
            // Test Plumbing Services
            1 => [
                1, 2, 3, 4, 5, 6,
            ],

            // Roshab Electrical Works
            2 => [
                7, 8, 9, 10, 11, 12,
            ],

            // Roshab Shahi Home Repair
            5 => [
                1, 2, 4,
                7, 9, 10, 11,
                13, 14, 16,
                18, 19, 20, 21, 23,
            ],

            // John Doe Carpenter Service
            6 => [
                35, 36, 37, 38, 39,
            ],
        ];

        foreach ($merchantServices as $userId => $serviceCategoryIds) {
            $merchant = Merchant::where('user_id', $userId)->first();

            if (!$merchant) {
                continue;
            }

            foreach ($serviceCategoryIds as $serviceCategoryId) {
                DB::table('merchant_service_categories')->updateOrInsert(
                    [
                        'merchant_id' => $merchant->id,
                        'service_category_id' => $serviceCategoryId,
                    ],
                    [
                        'base_rate' => $merchant->hourly_rate,
                        'experience_levels' => json_encode(['intermediate']),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}