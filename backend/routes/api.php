<?php

use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\MouvementsStockController;
use App\Http\Controllers\UtilisateursController;
use App\Http\Resources\UtilisateurResource;
use App\Models\Utilisateurs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->apiResource("utilisateurs", UtilisateursController::class);
Route::middleware('auth:sanctum')->apiResource("fournisseurs", FournisseurController::class);
Route::middleware('auth:sanctum')->apiResource('medicaments', MedicamentController::class);
Route::middleware('auth:sanctum')->apiResource("mouvements", MouvementsStockController::class);

Route::post('/login',  function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = Utilisateurs::where('email', $request->email)->first();


    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'username' => $user->username,
        'role' => $user->role,
    ]);
});

Route::middleware('auth:sanctum')->post('/user/update', function (Request $request) {

    $user = Utilisateurs::where('username', $request->username)->first();

    $data = $request->validate([
        'username' => 'sometimes|string|max:255',
        'email' => 'sometimes|string|email|max:255',
        'password' => 'sometimes|string|min:6',
    ]);

    if (isset($data['username'])) {
        $user->username = $data['username'];
    }
    if (isset($data['password'])) {
        $user->password = Hash::make($data['password']);
    }
    if (isset($data['email'])) {
        $user->email = $data['email'];
    }


    $user->save();

    return response()->json([
        'message' => 'User updated successfully',
        'user' => $user,
    ]);
});
