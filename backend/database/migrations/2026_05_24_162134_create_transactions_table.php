<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->unique()->constrained('bookings')->onDelete('cascade');
            $table->foreignId('merchant_id')->constrained('merchants')->onDelete('cascade');
            
            $table->decimal('service_amount', 12, 2);
            $table->decimal('commission_rate', 5, 2)->default(10); // 10% platform commission
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('merchant_amount', 12, 2);
            
            $table->enum('status', ['pending', 'completed', 'refunded', 'failed'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->text('notes')->nullable();
            
            $table->datetime('completed_at')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
