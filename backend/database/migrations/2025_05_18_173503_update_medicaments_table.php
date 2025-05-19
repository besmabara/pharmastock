<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('medicaments', function (Blueprint $table) {
            $table->string('nom', 100);
            $table->integer('quantite')->default(0);
            $table->date('date_expiration');
            $table->string('categorie');
            $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->onDelete('set null');
            $table->integer('seuil_alerte')->default(10);
        });
    }

    public function down()
    {
        Schema::table('medicaments', function (Blueprint $table) {
            $table->dropColumn(['nom', 'quantite', 'date_expiration', 'categorie', 'fournisseur_id', 'seuil_alerte']);
        });
    }
};

