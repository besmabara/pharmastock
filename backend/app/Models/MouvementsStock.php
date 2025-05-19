<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MouvementsStock extends Model
{
    use HasFactory;

    // Laravel will map this model to 'mouvements_stock' table automatically

    protected $table = 'mouvements_stock';

    protected $fillable = [
        'medicament_id',
        'utilisateur_id',
        'type_mouvement',
        'quantite',
        'note',
        'created_at',
    ];


    public function medicament()
    {
        return $this->belongsTo(Medicament::class, 'medicament_id');
    }

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateurs::class, 'utilisateur_id');
    }
}
