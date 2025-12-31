<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create owner user
        User::create([
            'name' => 'Иван Иванов',
            'email' => 'ivan@admin.local',
            'password' => Hash::make('password'),
            'role' => 'owner',
        ]);

        // Create frontend developer user
        User::create([
            'name' => 'Елена Петрова',
            'email' => 'elena@frontend.local',
            'password' => Hash::make('password'),
            'role' => 'frontend',
        ]);

        // Create backend developer user
        User::create([
            'name' => 'Петър Георгиев',
            'email' => 'petar@backend.local',
            'password' => Hash::make('password'),
            'role' => 'backend',
        ]);
    }
}
