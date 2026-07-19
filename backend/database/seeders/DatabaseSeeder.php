<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // $this->call(ArticalSeeder::class);
        
        // $this->call([MerchantSeeder::class, MerchantServiceCategorySeeder::class, RoleSeeder::class]);

         $this->call([
            // Must create service category IDs 1-95.
            // ServiceCategorySeeder::class,

            // Your existing seeders that create users 1-7
            // and their merchant profiles.
            // UserSeeder::class,
            // MerchantSeeder::class,

            // New seeders — keep this exact relative order.
            MerchantSeederV2::class,
            MerchantLocationSeeder::class,
            MerchantServiceCategorySeederV2::class,
        ]);
    }
}
