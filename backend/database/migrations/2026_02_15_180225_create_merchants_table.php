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
        Schema::create('merchants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            
            $table->string('business_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('logo')->nullable();
            $table->string('pan_no')->nullable();
            // $table->decimal('avg_rating',4,2)->default(0);
            $table->decimal('hourly_rate',12,2)->nullable();
            $table->string('location')->nullable();
            $table->enum('status', ['pending', 'active', 'suspended'])->default('pending');

            $table->json('extras')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchants');
    }
};
