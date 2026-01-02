<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category_id',
        'supplier_id',
        'price',
        'quantity',
        'image', // attribut image
    ];

    // Relation : un produit appartient à une catégorie
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relation : un produit appartient à un fournisseur
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    // Relation : un produit peut avoir plusieurs commandes
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Relation : un produit peut avoir plusieurs logs d’inventaire
    public function inventoryLogs()
    {
        return $this->hasMany(InventoryLog::class);
    }

    /**
     * Get the product image URL.
     */
    protected function image(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::get(fn ($value) => 
            $value ? asset('storage/' . $value) : null
        );
    }
}
