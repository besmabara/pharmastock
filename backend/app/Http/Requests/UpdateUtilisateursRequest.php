<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUtilisateursRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $data = [];

        if ($this->has('username')) {
            $data['username'] = $this->input('username');
        }
        if ($this->has('password')) {
            $data['password'] = $this->input('password');
        }
        if ($this->has('email')) {
            $data['email'] = $this->input('email');
        }
        if ($this->has('role')) {
            $data['role'] = $this->input('role');
        }
        if ($this->has('createdAt')) {
            $data['created_at'] = $this->input('createdAt');
        }

        $this->merge($data);
    }

    public function rules(): array
    {
        $method = $this->method();

        // Get the ID of the user being updated (assumes route model binding: utilisateurs/{utilisateur})
        $utilisateurId = $this->route('utilisateur')?->id ?? null;

        if ($method === 'PUT') {
            return [
                'username' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('utilisateurs', 'username')->ignore($utilisateurId),
                ],
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('utilisateurs', 'email')->ignore($utilisateurId),
                ],
                'password' => ['required', 'string', 'min:8'],
                'role' => ['required', 'string', 'max:50'],
                'created_at' => ['nullable', 'date'],
            ];
        } else { // PATCH or others
            return [
                'username' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('utilisateurs', 'username')->ignore($utilisateurId),
                ],
                'email' => [
                    'sometimes',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('utilisateurs', 'email')->ignore($utilisateurId),
                ],
                'password' => ['sometimes', 'string', 'min:8'],
                'role' => ['sometimes', 'string', 'max:50'],
                'created_at' => ['sometimes', 'nullable', 'date'],
            ];
        }
    }
}
