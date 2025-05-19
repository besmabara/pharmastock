<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;

    // Laravel will map this model to 'fournisseurs' table automatically

    protected $fillable = [
        'nom',
        'contact',
    ];

    public $timestamps = false;

    // Optional: if you want to define relation with medicaments
    public function medicaments()
    {
        return $this->hasMany(Medicament::class, 'fournisseur_id');
    }
}
