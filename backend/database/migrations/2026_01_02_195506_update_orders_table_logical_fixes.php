<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop old foreign key to change deletion behavior
            $table->dropForeign(['product_id']);
            
            // Re-add foreign key with onRecord (restricting deletion)
            $table->foreign('product_id')->references('id')->on('products')->onDelete('restrict');

            // Add new columns
            $table->decimal('unit_price', 10, 2)->after('product_id')->nullable();
            $table->enum('status', ['pending', 'completed', 'canceled'])->default('pending')->after('total_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            
            $table->dropColumn(['unit_price', 'status']);
        });
    }
};
