<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;


    protected $fillable = [
        'nom',
        'contact',
    ];

    public $timestamps = false;

    public function medicaments()
    {
        return $this->hasMany(Medicament::class, 'fournisseur_id');
    }
}
