<?php

namespace Database\Seeders;

use App\Models\Merchant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MerchantSeederV2 extends Seeder
{
    /**
     * Seed additional ShramSaathi workers and their merchant profiles.
     *
     * User IDs 1-7 are reserved by the existing seed data, so this seeder
     * explicitly uses IDs 8-25.
     */
    public function run(): void
    {
        $workers = [
            [
                'user_id' => 8,
                'name' => 'Rajesh Shrestha',
                'email' => 'rajesh.shrestha@shramsaathi.test',
                'phone' => '9841001008',
                'business_name' => 'Everest Plumbing & Sanitary',
                'pan_no' => '601234508',
                'location' => 'Kathmandu',
                'hourly_rate' => 650,
                'experience_years' => 8,
            ],
            [
                'user_id' => 9,
                'name' => 'Sita Maharjan',
                'email' => 'sita.maharjan@shramsaathi.test',
                'phone' => '9841001009',
                'business_name' => 'Patan Electrical Solutions',
                'pan_no' => '601234509',
                'location' => 'Lalitpur',
                'hourly_rate' => 700,
                'experience_years' => 6,
            ],
            [
                'user_id' => 10,
                'name' => 'Bikash Prajapati',
                'email' => 'bikash.prajapati@shramsaathi.test',
                'phone' => '9841001010',
                'business_name' => 'Bhaktapur AC & Appliance Care',
                'pan_no' => '601234510',
                'location' => 'Bhaktapur',
                'hourly_rate' => 850,
                'experience_years' => 7,
            ],
            [
                'user_id' => 11,
                'name' => 'Nirmala Gurung',
                'email' => 'nirmala.gurung@shramsaathi.test',
                'phone' => '9841001011',
                'business_name' => 'Fewa Home Cleaning',
                'pan_no' => '601234511',
                'location' => 'Pokhara',
                'hourly_rate' => 450,
                'experience_years' => 5,
            ],
            [
                'user_id' => 12,
                'name' => 'Suman Thapa',
                'email' => 'suman.thapa@shramsaathi.test',
                'phone' => '9841001012',
                'business_name' => 'Chitwan Paint & Decor',
                'pan_no' => '601234512',
                'location' => 'Bharatpur',
                'hourly_rate' => 600,
                'experience_years' => 9,
            ],
            [
                'user_id' => 13,
                'name' => 'Prakash Rai',
                'email' => 'prakash.rai@shramsaathi.test',
                'phone' => '9841001013',
                'business_name' => 'Koshi Furniture & Carpentry',
                'pan_no' => '601234513',
                'location' => 'Biratnagar',
                'hourly_rate' => 750,
                'experience_years' => 11,
            ],
            [
                'user_id' => 14,
                'name' => 'Anil Sah',
                'email' => 'anil.sah@shramsaathi.test',
                'phone' => '9841001014',
                'business_name' => 'Madhesh Computer Network Services',
                'pan_no' => '601234514',
                'location' => 'Birgunj',
                'hourly_rate' => 950,
                'experience_years' => 8,
            ],
            [
                'user_id' => 15,
                'name' => 'Ramesh Karki',
                'email' => 'ramesh.karki@shramsaathi.test',
                'phone' => '9841001015',
                'business_name' => 'Lumbini Web & Software Studio',
                'pan_no' => '601234515',
                'location' => 'Butwal',
                'hourly_rate' => 1250,
                'experience_years' => 6,
            ],
            [
                'user_id' => 16,
                'name' => 'Sabina Limbu',
                'email' => 'sabina.limbu@shramsaathi.test',
                'phone' => '9841001016',
                'business_name' => 'Dharan Creative Design Hub',
                'pan_no' => '601234516',
                'location' => 'Dharan',
                'hourly_rate' => 1100,
                'experience_years' => 7,
            ],
            [
                'user_id' => 17,
                'name' => 'Manoj Yadav',
                'email' => 'manoj.yadav@shramsaathi.test',
                'phone' => '9841001017',
                'business_name' => 'Mithila Home Tuition Center',
                'pan_no' => '601234517',
                'location' => 'Janakpur',
                'hourly_rate' => 400,
                'experience_years' => 10,
            ],
            [
                'user_id' => 18,
                'name' => 'Deepak Chaudhary',
                'email' => 'deepak.chaudhary@shramsaathi.test',
                'phone' => '9841001018',
                'business_name' => 'Bheri Courier & Moving',
                'pan_no' => '601234518',
                'location' => 'Nepalgunj',
                'hourly_rate' => 550,
                'experience_years' => 6,
            ],
            [
                'user_id' => 19,
                'name' => 'Kamala Tamang',
                'email' => 'kamala.tamang@shramsaathi.test',
                'phone' => '9841001019',
                'business_name' => 'Makwanpur Beauty & Wellness',
                'pan_no' => '601234519',
                'location' => 'Hetauda',
                'hourly_rate' => 800,
                'experience_years' => 8,
            ],
            [
                'user_id' => 20,
                'name' => 'Arjun Mahato',
                'email' => 'arjun.mahato@shramsaathi.test',
                'phone' => '9841001020',
                'business_name' => 'Narayani Auto Care',
                'pan_no' => '601234520',
                'location' => 'Chitwan',
                'hourly_rate' => 700,
                'experience_years' => 9,
            ],
            [
                'user_id' => 21,
                'name' => 'Pooja Koirala',
                'email' => 'pooja.koirala@shramsaathi.test',
                'phone' => '9841001021',
                'business_name' => 'Mechi Event & Photography',
                'pan_no' => '601234521',
                'location' => 'Damak',
                'hourly_rate' => 1150,
                'experience_years' => 5,
            ],
            [
                'user_id' => 22,
                'name' => 'Hari Bhandari',
                'email' => 'hari.bhandari@shramsaathi.test',
                'phone' => '9841001022',
                'business_name' => 'Rapti Construction Works',
                'pan_no' => '601234522',
                'location' => 'Tulsipur',
                'hourly_rate' => 650,
                'experience_years' => 12,
            ],
            [
                'user_id' => 23,
                'name' => 'Laxmi Adhikari',
                'email' => 'laxmi.adhikari@shramsaathi.test',
                'phone' => '9841001023',
                'business_name' => 'Kathmandu Fitness & Physio',
                'pan_no' => '601234523',
                'location' => 'Kathmandu',
                'hourly_rate' => 900,
                'experience_years' => 7,
            ],
            [
                'user_id' => 24,
                'name' => 'Binod Shahi',
                'email' => 'binod.shahi@shramsaathi.test',
                'phone' => '9841001024',
                'business_name' => 'Gandaki Accounting & Legal Services',
                'pan_no' => '601234524',
                'location' => 'Pokhara',
                'hourly_rate' => 1400,
                'experience_years' => 10,
            ],
            [
                'user_id' => 25,
                'name' => 'Gita Joshi',
                'email' => 'gita.joshi@shramsaathi.test',
                'phone' => '9841001025',
                'business_name' => 'Valley Appliance Repair',
                'pan_no' => '601234525',
                'location' => 'Lalitpur',
                'hourly_rate' => 725,
                'experience_years' => 6,
            ],
        ];

        DB::transaction(function () use ($workers): void {
            foreach ($workers as $worker) {
                $user = User::find($worker['user_id']) ?? new User();
                $user->id = $worker['user_id'];
                $user->forceFill([
                    'name' => $worker['name'],
                    'email' => $worker['email'],
                    'password' => Hash::make('password'),
                    'phone' => $worker['phone'],
                    'status' => 1,
                    'registration_step' => 3,
                    'registration_status' => 'complete',
                    'registration_completed_at' => now(),
                ])->save();

                $user->assignRole('worker');

                Merchant::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'business_name' => $worker['business_name'],
                        'phone' => $worker['phone'],
                        'logo' => null,
                        'pan_no' => $worker['pan_no'],
                        'location' => $worker['location'],
                        'status' => 'active',
                        'hourly_rate' => $worker['hourly_rate'],
                        'extras' => [
                            'experience_years' => $worker['experience_years'],
                            'available' => true,
                        ],
                        'verified_at' => now(),
                    ]
                );
            }
        });
    }
}
