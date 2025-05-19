<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicamentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $data = [];

        if ($this->has('fournisseurId')) {
            $data['fournisseur_id'] = $this->input('fournisseurId');
        }
        if ($this->has('dateExpiration')) {
            $data['date_expiration'] = $this->input('dateExpiration');
        }
        if ($this->has('quantite')) {
            $data['quantite'] = $this->input('quantite');
        }
        if ($this->has('prix')) {
            $data['prix'] = $this->input('prix');
        }
        if ($this->has('description')) {
            $data['description'] = $this->input('description');
        }
        if ($this->has('nom')) {
            $data['nom'] = $this->input('nom');
        }

        $this->merge($data);
    }


    public function rules(): array
    {
        $method = $this->method();

        if ($method == 'PUT') {
            return [
                'nom'              => 'string|max:150',
                'prix'             => 'nullable|numeric|min:0',
                'quantite'         => 'nullable|integer|min:0',
                'fournisseur_id'   => 'nullable|exists:fournisseurs,id',
                'date_expiration'  => 'nullable|date|after:today',
            ];
        } else {
            return [
                'nom'              => 'sometimes|nullable|string|max:150',
                'prix'             => 'sometimes|nullable|numeric|min:0',
                'quantite'         => 'sometimes|nullable|integer|min:0',
                'fournisseur_id'   => 'sometimes|nullable|exists:fournisseurs,id',
                'date_expiration'  => 'sometimes|nullable|date|after:today',
            ];
        }
    }
}
