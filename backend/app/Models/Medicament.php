<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    use HasFactory;

    // Laravel will map this model to 'medicaments' table automatically

    protected $fillable = [
        'nom',
        'quantite',
        'date_expiration',
        'categorie',
        'fournisseur_id',
        'seuil_alerte',
        'created_at',
        'modified_at',
    ];

    public $timestamps = false;

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class, 'fournisseur_id');
    }

    public function mouvementsStock()
    {
        return $this->hasMany(MouvementsStock::class, 'medicament_id');
    }
}
