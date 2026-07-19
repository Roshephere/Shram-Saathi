<?php

namespace Database\Seeders;

use App\Models\Merchant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MerchantServiceCategorySeederV2 extends Seeder
{
    /**
     * Assign 3-6 relevant service categories to the merchants created by
     * MerchantSeederV2.
     */
    public function run(): void
    {
        $categoryAssignments = [
            8 => [1, 2, 3, 4, 6],                  // Plumbing
            9 => [7, 8, 9, 10, 11, 12],           // Electrical
            10 => [13, 14, 15, 16, 18, 20],       // HVAC and appliance repair
            11 => [24, 25, 27, 28, 29],           // Cleaning
            12 => [30, 31, 32, 33, 34],           // Painting
            13 => [35, 36, 37, 38, 39],           // Carpentry
            14 => [46, 47, 48, 49],               // Computer and networking
            15 => [40, 41, 42, 43, 44, 45],       // Web and software development
            16 => [50, 51, 52, 53, 54, 55],       // Creative services
            17 => [56, 57, 58, 59, 60],           // Home tuition
            18 => [62, 63, 64, 65, 66],           // Courier and moving
            19 => [67, 68, 69, 70, 71],           // Beauty and wellness
            20 => [72, 73, 74, 75, 76],           // Vehicle services
            21 => [77, 78, 79, 80, 81],           // Events and media
            22 => [87, 88, 89, 90, 91],           // Construction trades
            23 => [92, 93, 94, 95],               // Fitness and therapy
            24 => [82, 83, 84, 85, 86],           // Professional services
            25 => [18, 19, 20, 21, 22, 23],       // Appliance repair
        ];

        DB::transaction(function () use ($categoryAssignments): void {
            foreach ($categoryAssignments as $userId => $serviceCategoryIds) {
                $merchant = Merchant::query()->where('user_id', $userId)->first();

                if (! $merchant) {
                    throw new RuntimeException(
                        "Merchant for user_id {$userId} was not found. Run MerchantSeederV2 first."
                    );
                }

                // Keep this seeder repeatable and prevent stale assignments for
                // the merchants managed by this V2 seed set.
                DB::table('merchant_service_categories')
                    ->where('merchant_id', $merchant->id)
                    ->delete();

                $timestamp = now();
                $rows = [];

                foreach ($serviceCategoryIds as $serviceCategoryId) {
                    $rows[] = [
                        'merchant_id' => $merchant->id,
                        'service_category_id' => $serviceCategoryId,
                        'base_rate' => (int) $merchant->hourly_rate,
                        'experience_levels' => json_encode(['intermediate']),
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp,
                    ];
                }

                DB::table('merchant_service_categories')->insert($rows);
            }
        });
    }
}
