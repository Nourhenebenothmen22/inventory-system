<?php

namespace App\Http\Controllers\Api;


use App\Models\Order;
use App\Models\Product;
use App\Models\InventoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController
{
    public function index()
    {
        $user = auth()->user();
        
        $query = Order::with(['user', 'product']);

        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        return $query->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->quantity < $request->quantity) {
            return response()->json(['message' => 'Stock insuffisant'], 400);
        }

        // Create Order as PENDING first
        $order = Order::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'unit_price' => $product->price,
            'quantity' => $request->quantity,
            'total_price' => $product->price * $request->quantity,
            'status' => 'pending',
        ]);

        return response()->json($order->load(['user', 'product']), 201);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,completed,canceled',
        ]);

        $user = auth()->user();

        // Security Check: 
        // 1. Admin can do everything
        // 2. User can only change their OWN order status to 'canceled' and ONLY if it's currently 'pending'
        if (!$user->hasRole('admin')) {
            if ($order->user_id !== $user->id) {
                return response()->json(['message' => 'Accès refusé'], 403);
            }
            if ($request->status !== 'canceled') {
                return response()->json(['message' => 'Vous ne pouvez qu\'annuler votre commande'], 403);
            }
            if ($order->status !== 'pending') {
                return response()->json(['message' => 'Cette commande ne peut plus être annulée'], 400);
            }
        }

        // Only handle stock if transitioning TO completed FROM pending (Admin Action)
        if ($request->status === 'completed' && $order->status === 'pending') {
            return DB::transaction(function () use ($request, $order) {
                $product = $order->product;
                
                if ($product->quantity < $order->quantity) {
                    return response()->json(['message' => 'Stock insuffisant pour valider cette commande'], 400);
                }

                // Deduct Stock
                $product->decrement('quantity', $order->quantity);

                // Log Inventory
                InventoryLog::create([
                    'product_id' => $product->id,
                    'quantity_changed' => -$order->quantity,
                    'type' => 'sale',
                ]);

                $order->update(['status' => 'completed']);
                return response()->json($order->load(['user', 'product']));
            });
        }

        $order->update(['status' => $request->status]);
        return response()->json($order->load(['user', 'product']));
    }
}
