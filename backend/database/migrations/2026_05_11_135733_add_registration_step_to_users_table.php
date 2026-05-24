<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->integer('registration_step')->default(0)->after('password'); // 0 = not started, 1, 2, 3 = step completed
            $table->enum('registration_status', ['incomplete', 'in_progress', 'complete'])->default('incomplete')->after('registration_step');
            $table->timestamp('registration_completed_at')->nullable()->after('registration_status');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'registration_step', 'registration_status', 'registration_completed_at']);
        });
    }
};
