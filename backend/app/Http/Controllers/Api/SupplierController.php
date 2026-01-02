<?php

namespace App\Http\Controllers\Api;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SupplierController
{
    public function index()
    {
        return Supplier::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('suppliers', 'public');
        }

        $supplier = Supplier::create($data);

        return response()->json($supplier, 201);
    }

    public function show(Supplier $supplier)
    {
        return $supplier;
    }

    public function update(Request $request, Supplier $supplier)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'image' => 'nullable|image|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            if ($supplier->getRawOriginal('image')) {
                Storage::disk('public')->delete($supplier->getRawOriginal('image'));
            }
            $data['image'] = $request->file('image')->store('suppliers', 'public');
        }

        $supplier->update($data);

        return response()->json($supplier);
    }

    public function destroy(Supplier $supplier)
    {
        if ($supplier->getRawOriginal('image')) {
            Storage::disk('public')->delete($supplier->getRawOriginal('image'));
        }
        $supplier->delete();

        return response()->json(null, 204);
    }
}
