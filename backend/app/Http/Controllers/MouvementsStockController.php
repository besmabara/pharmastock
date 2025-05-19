<?php

namespace App\Http\Controllers;

use App\Models\MouvementsStock;
use App\Http\Requests\StoreMouvementsStockRequest;
use App\Http\Requests\UpdateMouvementsStockRequest;

class MouvementsStockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $movements =  MouvementsStock::all();
        $movements->load("medicament");
        $movements->load("utilisateur");
        return $movements;
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
    public function store(StoreMouvementsStockRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(MouvementsStock $mouvementsStock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MouvementsStock $mouvementsStock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMouvementsStockRequest $request, MouvementsStock $mouvementsStock)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MouvementsStock $mouvementsStock)
    {
        //
    }
}
