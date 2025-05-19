<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Utilisateurs extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'username',
        'password',
        'email',
        'role',
        'created_at',
    ];

    protected $hidden = [
        'password',
    ];


    public function mouvementsStock()
    {
        return $this->hasMany(MouvementsStock::class, 'utilisateur_id');
    }
}
