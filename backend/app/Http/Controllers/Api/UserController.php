<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;

class UserController
{
    public function index()
    {
        // On retourne tous les utilisateurs avec leurs rôles
        return response()->json(User::with('roles')->get());
    }

    public function destroy(User $user)
    {
        // Empêcher de se supprimer soi-même
        if (auth()->id() === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }
}
