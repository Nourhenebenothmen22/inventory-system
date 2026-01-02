<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'unit_price',
        'quantity',
        'total_price',
        'status',
    ];

    // Relation : une commande appartient à un utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation : une commande concerne un produit
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
