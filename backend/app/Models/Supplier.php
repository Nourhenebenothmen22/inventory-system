<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'image', // attribut image
    ];

    // Relation : un fournisseur peut fournir plusieurs produits (optionnel)
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the supplier image URL.
     */
    protected function image(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::get(fn ($value) => 
            $value ? asset('storage/' . $value) : null
        );
    }
}
