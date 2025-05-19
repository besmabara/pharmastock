<?php

namespace App\Http\Controllers;

use App\Models\Utilisateurs;
use App\Http\Requests\StoreutilisateursRequest;
use App\Http\Requests\UpdateutilisateursRequest;
use App\Http\Resources\UtilisateurCollection;
use App\Http\Resources\UtilisateurResource;
use App\Models\Medicament;

class UtilisateursController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new UtilisateurCollection(Utilisateurs::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUtilisateursRequest $request)
    {
        $validatedData = $request->validated();

        $validatedData['password'] = bcrypt($validatedData['password']);
        $validatedData['created_at'] = now();

        $utilisateur = Utilisateurs::create($validatedData);

        return new UtilisateurResource($utilisateur);
    }

    /**
     * Display the specified resource.
     */
    public function show(Utilisateurs $utilisateur)
    {

        return new UtilisateurResource($utilisateur);

        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Utilisateurs $utilisateurs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUtilisateursRequest $request, Utilisateurs $utilisateur)
    {
        $data = $request->all();

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            // If password is not provided, don't update it — remove from data
            unset($data['password']);
        }

        $utilisateur->update($data);

        return response()->json([
            'message' => 'Utilisateur updated successfully',
            'data' => $utilisateur
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Utilisateurs $utilisateur)
    {
        $utilisateur->delete();
    }
}
