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
            Schema::table('merchants', function (Blueprint $table) {
            // Index for ORDER BY avg_rating DESC LIMIT N (category-only browse)
            $table->index('avg_rating', 'merchants_avg_rating_index');
        });

        Schema::table('merchant_service_categories', function (Blueprint $table) {
            // Composite index for the WHERE EXISTS subquery
            $table->index(['service_category_id', 'merchant_id'], 'msc_category_merchant_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('merchants', function (Blueprint $table) {
            $table->dropIndex('merchants_avg_rating_index');
        });

        Schema::table('merchant_service_categories', function (Blueprint $table) {
            $table->dropIndex('msc_category_merchant_index');
        });

    }
};
