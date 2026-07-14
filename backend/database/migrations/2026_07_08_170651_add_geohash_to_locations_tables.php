use Illuminate\Support\Facades\DB;
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_locations', function (Blueprint $table) {
            $table->string('geohash',12 )->nullable()->after('longitude');
            $table->index('geohash', 'user_locations_geohash_index');
        });
        Schema::table('merchant_locations', function (Blueprint $table) {
            $table->string('geohash',12 )->nullable()->after('longitude');
            $table->index('geohash', 'merchant_locations_geohash_index');
        });

        $this->backfillGeohash('user_locations');
        $this->backfillGeohash('merchant_locations');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_locations', function (Blueprint $table) {
            $table->dropIndex('user_locations_geohash_index');
            $table->dropColumn('geohash');
        });
        Schema::table('merchant_locations', function (Blueprint $table) {
            $table->dropIndex('merchant_locations_geohash_index');
            $table->dropColumn('geohash');
        });
    }

    public function backfillGeohash(string $table):void
    {
        $locations = DB::table($table)->whereNotNull('latitude')->whereNotNull('longitude')->get();

        foreach ($locations as $location){
            $geohash = \App\Utils\Geohash::encode($location->latitude, $location->longitude,8);
            DB::table($table)->where('id', $location->id)->update(['geohash' => $geohash]);
        }
        }
        
};
