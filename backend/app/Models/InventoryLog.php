<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'quantity_changed',
        'type',
    ];

    // Relation : un log d’inventaire appartient à un produit
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
