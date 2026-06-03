<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations - Update bookings table for marketplace bidding model
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Drop the old status enum and create new one
            $table->dropColumn('status');
            
            // Add new status enum with bidding/in_progress
            // Status: bidding, accepted, rejected, in_progress, completed, cancelled
            $table->enum('status', [
                'bidding', 
                'accepted', 
                'rejected', 
                'in_progress', 
                'completed', 
                'cancelled'
            ])->default('bidding')->after('merchant_id');

            // Rename agreed_price to agreed_rate for consistency with model
            $table->renameColumn('agreed_price', 'agreed_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Drop new status and recreate old one
            $table->dropColumn('status');
            $table->enum('status', [
                'pending', 
                'accepted', 
                'rejected', 
                'completed', 
                'cancelled'
            ])->default('pending')->after('merchant_id');

            // Rename back
            $table->renameColumn('agreed_rate', 'agreed_price');
        });
    }
};
