<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;

class DummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Categories
        $categories = [
            ['name' => 'Électronique', 'description' => 'Produits high-tech et gadgets'],
            ['name' => 'Informatique', 'description' => 'Ordinateurs et accessoires'],
            ['name' => 'Bureautique', 'description' => 'Fournitures de bureau'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // 2. Create Suppliers
        $suppliers = [
            ['name' => 'Tech Master', 'email' => 'contact@techmaster.com', 'phone' => '0123456789'],
            ['name' => 'Global Office', 'email' => 'sales@globaloffice.com', 'phone' => '0987654321'],
        ];

        foreach ($suppliers as $sup) {
            Supplier::create($sup);
        }

        // 3. Create Products with dummy images
        $products = [
            [
                'name' => 'MacBook Pro M2',
                'category_id' => 2,
                'supplier_id' => 1,
                'price' => 2499.99,
                'quantity' => 15,
                'image' => null // Laravel uses asset('storage/') in Model
            ],
            [
                'name' => 'Clavier Mécanique RGB',
                'category_id' => 2,
                'supplier_id' => 1,
                'price' => 129.50,
                'quantity' => 5, // Low stock for alerts
                'image' => null
            ],
            [
                'name' => 'Écran 4K 27"',
                'category_id' => 1,
                'supplier_id' => 1,
                'price' => 450.00,
                'quantity' => 8, // Low stock
                'image' => null
            ],
            [
                'name' => 'Chaise Ergonomique',
                'category_id' => 3,
                'supplier_id' => 2,
                'price' => 299.00,
                'quantity' => 20,
                'image' => null
            ],
        ];

        foreach ($products as $prod) {
            Product::create($prod);
        }

        // 4. Create some Orders
        $admin = User::where('email', 'admin@example.com')->first();
        if ($admin) {
            $orderData = [
                ['product_id' => 1, 'quantity' => 2, 'status' => 'completed'],
                ['product_id' => 2, 'quantity' => 1, 'status' => 'pending'],
                ['product_id' => 3, 'quantity' => 5, 'status' => 'completed'],
                ['product_id' => 4, 'quantity' => 3, 'status' => 'canceled'],
                ['product_id' => 1, 'quantity' => 1, 'status' => 'completed'],
            ];

            foreach ($orderData as $data) {
                $product = Product::find($data['product_id']);
                Order::create([
                    'user_id' => $admin->id,
                    'product_id' => $product->id,
                    'unit_price' => $product->price,
                    'quantity' => $data['quantity'],
                    'total_price' => $product->price * $data['quantity'],
                    'status' => $data['status'],
                    'created_at' => now()->subDays(rand(1, 15)),
                ]);

                // Create a log for each order
                \App\Models\InventoryLog::create([
                    'product_id' => $product->id,
                    'quantity_changed' => -$data['quantity'],
                    'type' => 'sale',
                    'created_at' => now()->subDays(rand(1, 15)),
                ]);
            }

            // Create some stock restock logs
            $products = Product::all();
            foreach ($products as $product) {
                 \App\Models\InventoryLog::create([
                    'product_id' => $product->id,
                    'quantity_changed' => rand(20, 50),
                    'type' => 'restock',
                    'created_at' => now()->subDays(rand(16, 30)),
                ]);
            }
        }
    }
}
