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
        Schema::create('merchant_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_request_id')->constrained()->cascadeOnDelete();
            $table->decimal('rating_overall', 3, 2); // e.g., 4.5
            $table->decimal('rating_skill', 3, 2)->nullable();
            $table->decimal('rating_timeliness', 3, 2)->nullable();
            $table->decimal('rating_communication', 3, 2)->nullable();
            $table->text('review_text')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->json('extras')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchant_reviews');
    }
};
