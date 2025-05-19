<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUtilisateursRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * For now, let's allow anyone to make this request.
     * You can customize this based on your auth logic.
     */
    public function authorize(): bool
    {
        return true;
    }


    protected function prepareForValidation()
    {
        $this->merge([
            'username'   => $this->input('username'),
            'password'   => $this->input('password'),
            'email'      => $this->input('email'),
            'role'       => $this->input('role'),
            'created_at' => $this->input('createdAt'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * We validate username, email, password, role, and optionally created_at.
     */
    public function rules(): array
    {
        return [
            'username'   => ['required', 'string', 'max:255', 'unique:utilisateurs,username'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:utilisateurs,email'],
            'password'   => ['required', 'string', 'min:8'],
            'role'       => ['required', 'string', 'max:50'],
            'created_at' => ['nullable', 'date'],
        ];
    }
}
