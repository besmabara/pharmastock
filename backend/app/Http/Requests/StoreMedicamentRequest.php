<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicamentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'fournisseur_id'   => $this->input('fournisseurId'),
            'date_expiration'  => $this->input('dateExpiration'),
            'quantite'         => $this->input('quantite'),
            'prix'             => $this->input('prix'),
            'description'      => $this->input('description'),
        ]);
    }


    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:150',
            'description' => 'nullable|string',
            'prix' => 'nullable|numeric|min:0',
            'quantite' => 'nullable|integer|min:0',
            'fournisseurId' => 'nullable|exists:fournisseurs,id',
        ];
    }
}
