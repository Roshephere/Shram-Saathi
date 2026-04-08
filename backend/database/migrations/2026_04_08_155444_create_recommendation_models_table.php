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
        Schema::create('recommendation_models', function (Blueprint $table) {
            $table->id();
            $table->string('model_name')->unique();
            $table->text('description')->nullable();
            $table->decimal('skill_weight', 5, 2)->default(1.00);
            $table->decimal('rating_weight', 5, 2)->default(1.00);
            $table->decimal('availability_weight', 5, 2)->default(1.00);
            $table->boolean('is_active')->default(true);
            $table->json('extras')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recommendation_models');
    }
};
