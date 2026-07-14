<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Home Repair & Maintenance
            ['id' => 1,  'service_id' => 1, 'name' => 'Plumbing Services'],
            ['id' => 2,  'service_id' => 1, 'name' => 'Leak Repair'],
            ['id' => 3,  'service_id' => 1, 'name' => 'Drain Cleaning'],
            ['id' => 4,  'service_id' => 1, 'name' => 'Bathroom Plumbing'],
            ['id' => 5,  'service_id' => 1, 'name' => 'Water Heater Repair'],
            ['id' => 6,  'service_id' => 1, 'name' => 'Pipe Installation'],

            ['id' => 7,  'service_id' => 1, 'name' => 'Electrical Services'],
            ['id' => 8,  'service_id' => 1, 'name' => 'Wiring Installation'],
            ['id' => 9,  'service_id' => 1, 'name' => 'Light Installation'],
            ['id' => 10, 'service_id' => 1, 'name' => 'Fan Installation'],
            ['id' => 11, 'service_id' => 1, 'name' => 'Switch & Socket Repair'],
            ['id' => 12, 'service_id' => 1, 'name' => 'Breaker & Fuse Repair'],

            ['id' => 13, 'service_id' => 1, 'name' => 'HVAC Services'],
            ['id' => 14, 'service_id' => 1, 'name' => 'AC Repair'],
            ['id' => 15, 'service_id' => 1, 'name' => 'AC Installation'],
            ['id' => 16, 'service_id' => 1, 'name' => 'AC Maintenance'],
            ['id' => 17, 'service_id' => 1, 'name' => 'Heating Repair'],

            ['id' => 18, 'service_id' => 1, 'name' => 'Appliance Repair'],
            ['id' => 19, 'service_id' => 1, 'name' => 'Washing Machine Repair'],
            ['id' => 20, 'service_id' => 1, 'name' => 'Refrigerator Repair'],
            ['id' => 21, 'service_id' => 1, 'name' => 'Microwave Repair'],
            ['id' => 22, 'service_id' => 1, 'name' => 'Oven Repair'],
            ['id' => 23, 'service_id' => 1, 'name' => 'Water Purifier Repair'],

            ['id' => 24, 'service_id' => 4, 'name' => 'Cleaning Services'],
            ['id' => 25, 'service_id' => 4, 'name' => 'House Cleaning'],
            ['id' => 26, 'service_id' => 4, 'name' => 'Office Cleaning'],
            ['id' => 27, 'service_id' => 4, 'name' => 'Deep Cleaning'],
            ['id' => 28, 'service_id' => 4, 'name' => 'Sofa Cleaning'],
            ['id' => 29, 'service_id' => 4, 'name' => 'Carpet Cleaning'],

            ['id' => 30, 'service_id' => 1, 'name' => 'Painting Services'],
            ['id' => 31, 'service_id' => 1, 'name' => 'Interior Painting'],
            ['id' => 32, 'service_id' => 1, 'name' => 'Exterior Painting'],
            ['id' => 33, 'service_id' => 1, 'name' => 'Wall Painting'],
            ['id' => 34, 'service_id' => 1, 'name' => 'Texture Painting'],

            ['id' => 35, 'service_id' => 1, 'name' => 'Carpentry Services'],
            ['id' => 36, 'service_id' => 1, 'name' => 'Door Repair'],
            ['id' => 37, 'service_id' => 1, 'name' => 'Furniture Assembly'],
            ['id' => 38, 'service_id' => 1, 'name' => 'Cabinet Repair'],
            ['id' => 39, 'service_id' => 1, 'name' => 'Custom Woodwork'],

            // IT & Software
            ['id' => 40, 'service_id' => 2, 'name' => 'Web Development'],
            ['id' => 41, 'service_id' => 2, 'name' => 'Software Development'],
            ['id' => 42, 'service_id' => 2, 'name' => 'Mobile App Development'],
            ['id' => 43, 'service_id' => 2, 'name' => 'WordPress Development'],
            ['id' => 44, 'service_id' => 2, 'name' => 'E-commerce Development'],
            ['id' => 45, 'service_id' => 2, 'name' => 'Website Maintenance'],
            ['id' => 46, 'service_id' => 2, 'name' => 'Computer Repair'],
            ['id' => 47, 'service_id' => 2, 'name' => 'Networking Support'],
            ['id' => 48, 'service_id' => 2, 'name' => 'Cloud Deployment'],
            ['id' => 49, 'service_id' => 2, 'name' => 'Cybersecurity Support'],

            // Design & Creative
            ['id' => 50, 'service_id' => 3, 'name' => 'Graphic Design'],
            ['id' => 51, 'service_id' => 3, 'name' => 'Logo Design'],
            ['id' => 52, 'service_id' => 3, 'name' => 'UI/UX Design'],
            ['id' => 53, 'service_id' => 3, 'name' => 'Video Editing'],
            ['id' => 54, 'service_id' => 3, 'name' => 'Animation'],
            ['id' => 55, 'service_id' => 3, 'name' => 'Content Writing'],

            // Education & Tutoring
            ['id' => 56, 'service_id' => 5, 'name' => 'Home Tuition'],
            ['id' => 57, 'service_id' => 5, 'name' => 'Math Tutor'],
            ['id' => 58, 'service_id' => 5, 'name' => 'Science Tutor'],
            ['id' => 59, 'service_id' => 5, 'name' => 'English Tutor'],
            ['id' => 60, 'service_id' => 5, 'name' => 'Programming Tutor'],
            ['id' => 61, 'service_id' => 5, 'name' => 'Music Tutor'],

            // Delivery & Logistics
            ['id' => 62, 'service_id' => 6, 'name' => 'Courier Delivery'],
            ['id' => 63, 'service_id' => 6, 'name' => 'Food Delivery'],
            ['id' => 64, 'service_id' => 6, 'name' => 'Parcel Delivery'],
            ['id' => 65, 'service_id' => 6, 'name' => 'House Shifting'],
            ['id' => 66, 'service_id' => 6, 'name' => 'Furniture Moving'],

            // Beauty & Personal Care
            ['id' => 67, 'service_id' => 7, 'name' => 'Haircut Service'],
            ['id' => 68, 'service_id' => 7, 'name' => 'Makeup Artist'],
            ['id' => 69, 'service_id' => 7, 'name' => 'Facial Service'],
            ['id' => 70, 'service_id' => 7, 'name' => 'Mehendi Artist'],
            ['id' => 71, 'service_id' => 7, 'name' => 'Massage Therapy'],

            // Automotive Services
            ['id' => 72, 'service_id' => 8, 'name' => 'Bike Repair'],
            ['id' => 73, 'service_id' => 8, 'name' => 'Car Repair'],
            ['id' => 74, 'service_id' => 8, 'name' => 'Vehicle Washing'],
            ['id' => 75, 'service_id' => 8, 'name' => 'Battery Replacement'],
            ['id' => 76, 'service_id' => 8, 'name' => 'Tyre Repair'],

            // Events & Photography
            ['id' => 77, 'service_id' => 9, 'name' => 'Photography'],
            ['id' => 78, 'service_id' => 9, 'name' => 'Videography'],
            ['id' => 79, 'service_id' => 9, 'name' => 'Event Decoration'],
            ['id' => 80, 'service_id' => 9, 'name' => 'Catering Service'],
            ['id' => 81, 'service_id' => 9, 'name' => 'DJ Service'],

            // Business & Professional
            ['id' => 82, 'service_id' => 10, 'name' => 'Accounting'],
            ['id' => 83, 'service_id' => 10, 'name' => 'Tax Filing'],
            ['id' => 84, 'service_id' => 10, 'name' => 'Legal Consultation'],
            ['id' => 85, 'service_id' => 10, 'name' => 'Business Consulting'],
            ['id' => 86, 'service_id' => 10, 'name' => 'Data Entry'],

            // Construction & Labor
            ['id' => 87, 'service_id' => 11, 'name' => 'Mason Work'],
            ['id' => 88, 'service_id' => 11, 'name' => 'Tile Installation'],
            ['id' => 89, 'service_id' => 11, 'name' => 'Welding'],
            ['id' => 90, 'service_id' => 11, 'name' => 'General Labor'],
            ['id' => 91, 'service_id' => 11, 'name' => 'Roof Repair'],

            // Health & Wellness
            ['id' => 92, 'service_id' => 12, 'name' => 'Fitness Trainer'],
            ['id' => 93, 'service_id' => 12, 'name' => 'Yoga Instructor'],
            ['id' => 94, 'service_id' => 12, 'name' => 'Physiotherapy'],
            ['id' => 95, 'service_id' => 12, 'name' => 'Diet Consultation'],
        ];

        foreach ($categories as $category) {
            $data = [
                'service_id' => $category['service_id'],
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $data = collect($data)
                ->filter(fn ($value, $column) => Schema::hasColumn('service_categories', $column))
                ->toArray();

            DB::table('service_categories')->updateOrInsert(
                ['id' => $category['id']],
                $data
            );
        }
    }
}