<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        \Spatie\Permission\Models\Permission::create(['name' => 'manage inventory']);
        \Spatie\Permission\Models\Permission::create(['name' => 'view orders']);
        \Spatie\Permission\Models\Permission::create(['name' => 'manage users']);

        // Create roles and assign permissions
        $roleAdmin = \Spatie\Permission\Models\Role::create(['name' => 'admin']);
        $roleAdmin->givePermissionTo(\Spatie\Permission\Models\Permission::all());

        $roleUser = \Spatie\Permission\Models\Role::create(['name' => 'user']);
        $roleUser->givePermissionTo(['view orders']);
    }
}
