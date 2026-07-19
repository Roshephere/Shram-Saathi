<?php

namespace Database\Seeders;

use App\Models\Merchant;
use App\Models\MerchantLocation;
use App\Utils\GeoHash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class MerchantLocationSeeder extends Seeder
{
    /**
     * Seed one active primary location for every merchant created by
     * MerchantSeederV2.
     */
    public function run(): void
    {
        $locations = [
            8 => [
                'city' => 'Kathmandu',
                'address' => 'Ward 10, New Baneshwor, Kathmandu',
                'latitude' => 27.7172,
                'longitude' => 85.3240,
            ],
            9 => [
                'city' => 'Lalitpur',
                'address' => 'Ward 5, Kumaripati, Lalitpur',
                'latitude' => 27.6766,
                'longitude' => 85.3241,
            ],
            10 => [
                'city' => 'Bhaktapur',
                'address' => 'Ward 4, Suryabinayak, Bhaktapur',
                'latitude' => 27.6725,
                'longitude' => 85.4278,
            ],
            11 => [
                'city' => 'Pokhara',
                'address' => 'Ward 6, Lakeside, Pokhara',
                'latitude' => 28.2096,
                'longitude' => 83.9856,
            ],
            12 => [
                'city' => 'Bharatpur',
                'address' => 'Ward 10, Hakim Chowk, Bharatpur',
                'latitude' => 27.6833,
                'longitude' => 84.4333,
            ],
            13 => [
                'city' => 'Biratnagar',
                'address' => 'Ward 9, Main Road, Biratnagar',
                'latitude' => 26.4542,
                'longitude' => 87.2800,
            ],
            14 => [
                'city' => 'Birgunj',
                'address' => 'Ward 10, Adarsh Nagar, Birgunj',
                'latitude' => 27.0172,
                'longitude' => 84.8756,
            ],
            15 => [
                'city' => 'Butwal',
                'address' => 'Ward 8, Sukhkhanagar, Butwal',
                'latitude' => 27.7000,
                'longitude' => 83.4500,
            ],
            16 => [
                'city' => 'Dharan',
                'address' => 'Ward 12, Chatara Line, Dharan',
                'latitude' => 26.8167,
                'longitude' => 87.2833,
            ],
            17 => [
                'city' => 'Janakpur',
                'address' => 'Ward 4, Ramanand Chowk, Janakpur',
                'latitude' => 26.7288,
                'longitude' => 85.9249,
            ],
            18 => [
                'city' => 'Nepalgunj',
                'address' => 'Ward 2, Dhamboji, Nepalgunj',
                'latitude' => 28.0500,
                'longitude' => 81.6167,
            ],
            19 => [
                'city' => 'Hetauda',
                'address' => 'Ward 4, School Road, Hetauda',
                'latitude' => 27.4167,
                'longitude' => 85.0333,
            ],
            20 => [
                'city' => 'Chitwan',
                'address' => 'Ratnanagar, Tandi, Chitwan',
                'latitude' => 27.5333,
                'longitude' => 84.3333,
            ],
            21 => [
                'city' => 'Damak',
                'address' => 'Ward 6, Phalgunanda Chowk, Damak',
                'latitude' => 26.6667,
                'longitude' => 87.7000,
            ],
            22 => [
                'city' => 'Tulsipur',
                'address' => 'Ward 5, BP Chowk, Tulsipur',
                'latitude' => 28.1333,
                'longitude' => 82.3000,
            ],
            23 => [
                'city' => 'Kathmandu',
                'address' => 'Ward 3, Maharajgunj, Kathmandu',
                'latitude' => 27.7172,
                'longitude' => 85.3240,
            ],
            24 => [
                'city' => 'Pokhara',
                'address' => 'Ward 8, New Road, Pokhara',
                'latitude' => 28.2096,
                'longitude' => 83.9856,
            ],
            25 => [
                'city' => 'Lalitpur',
                'address' => 'Ward 14, Satdobato, Lalitpur',
                'latitude' => 27.6766,
                'longitude' => 85.3241,
            ],
        ];

        DB::transaction(function () use ($locations): void {
            foreach ($locations as $userId => $location) {
                $merchant = Merchant::query()->where('user_id', $userId)->first();

                if (! $merchant) {
                    throw new RuntimeException(
                        "Merchant for user_id {$userId} was not found. Run MerchantSeederV2 first."
                    );
                }

                $latitude = number_format($location['latitude'], 7, '.', '');
                $longitude = number_format($location['longitude'], 7, '.', '');

                MerchantLocation::updateOrCreate(
                    [
                        'merchant_id' => $merchant->id,
                        'is_primary' => true,
                    ],
                    [
                        'label' => 'Primary Location',
                        'country' => 'Nepal',
                        'address' => $location['address'],
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                        'geohash' => GeoHash::encode(
                            (float) $latitude,
                            (float) $longitude,
                            6
                        ),
                        'is_primary' => true,
                        'is_active' => true,
                    ]
                );
            }
        });
    }
}
