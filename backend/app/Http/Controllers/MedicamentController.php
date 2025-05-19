<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use App\Http\Requests\StoreMedicamentRequest;
use App\Http\Requests\UpdateMedicamentRequest;
use App\Models\MouvementsStock;

class MedicamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Medicament::all();
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
    public function store(StoreMedicamentRequest $request)
    {
        $medicament = Medicament::create($request->all());
        $medicament->load('fournisseur');

        return $medicament;
    }


    /**
     * Display the specified resource.
     */
    public function show(Medicament $medicament)
    {
        return $medicament;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Medicament $medicament)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMedicamentRequest $request, Medicament $medicament)
    {
        $medicament->update($request->all());

        $type = $request->filled('typeMouvement')
            ? $request->input('typeMouvement')
            : 'Réinitialisation de la quantité';

        $note = $request->filled('note')
            ? $request->input('note')
            : "changement de quantité d'apres utilisateur";

        MouvementsStock::create([
            'medicament_id'   => $medicament->id,
            'utilisateur_id'  => auth()->id(),
            'type_mouvement'  => $type,
            'quantite'        => $request->quantite,
            'note'            => $note,
            'created_at'      => now(),
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medicament $medicament)
    {
        $medicament->delete();
    }
}
