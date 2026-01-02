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
        return Order::with(['user', 'product'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $product = Product::findOrFail($request->product_id);

            if ($product->quantity < $request->quantity) {
                return response()->json(['message' => 'Stock insuffisant'], 400);
            }

            // Create Order
            $order = Order::create([
                'user_id' => auth()->id(),
                'product_id' => $product->id,
                'unit_price' => $product->price,
                'quantity' => $request->quantity,
                'total_price' => $product->price * $request->quantity,
                'status' => 'completed',
            ]);

            // Deduct Stock
            $product->decrement('quantity', $request->quantity);

            // Log Inventory
            InventoryLog::create([
                'product_id' => $product->id,
                'quantity_changed' => -$request->quantity,
                'type' => 'sale',
            ]);

            return response()->json($order->load(['user', 'product']), 201);
        });
    }

    public function show(Order $order)
    {
        return $order->load(['user', 'product']);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,completed,canceled',
        ]);

        $order->update(['status' => $request->status]);

        return response()->json($order);
    }
}
