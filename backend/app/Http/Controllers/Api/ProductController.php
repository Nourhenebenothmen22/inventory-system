<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController
{
    public function index()
    {
        return Product::with(['category', 'supplier'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        return response()->json($product->load(['category', 'supplier']), 201);
    }

    public function show(Product $product)
    {
        return $product->load(['category', 'supplier']);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'price' => 'sometimes|required|numeric|min:0',
            'quantity' => 'sometimes|required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->getRawOriginal('image')) {
                Storage::disk('public')->delete($product->getRawOriginal('image'));
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json($product->load(['category', 'supplier']));
    }

    public function destroy(Product $product)
    {
        if ($product->getRawOriginal('image')) {
            Storage::disk('public')->delete($product->getRawOriginal('image'));
        }
        
        $product->delete();

        return response()->json(null, 204);
    }
}
