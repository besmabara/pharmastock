<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('medicaments', function (Blueprint $table) {
            // Add unique constraint to 'nom'
            $table->dropUnique('medicaments_nom_unique'); // drop existing unique index
            $table->unique('nom');

            // Modify 'created_at' and 'updated_at' to have default timestamps if needed
            // Note: Changing columns requires doctrine/dbal package
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'))->change();
            $table->timestamp('updated_at')->default(DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('medicaments', function (Blueprint $table) {
            $table->dropUnique(['nom']);
            // Optionally revert timestamps to nullable or original state
            $table->timestamp('created_at')->nullable()->change();
            $table->timestamp('updated_at')->nullable()->change();
        });
    }
};
