<?php

namespace App\Http\Controllers\Api;


use App\Models\InventoryLog;
use Illuminate\Http\Request;

class InventoryLogController
{
    public function index()
    {
        return InventoryLog::with('product')->latest()->get();
    }
}
