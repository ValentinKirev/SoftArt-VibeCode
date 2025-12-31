<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get role IDs
        $ownerRole = Role::where('slug', 'owner')->first();
        $pmRole = Role::where('slug', 'pm')->first();
        $backendRole = Role::where('slug', 'backend')->first();
        $frontendRole = Role::where('slug', 'frontend')->first();
        $designerRole = Role::where('slug', 'designer')->first();
        $qaRole = Role::where('slug', 'qa')->first();

        // Create owner user
        User::updateOrCreate(
            ['email' => 'ivan@admin.local'],
            [
                'name' => 'Иван Иванов',
                'password' => Hash::make('password'),
                'role_id' => $ownerRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create project manager user
        User::updateOrCreate(
            ['email' => 'maria@pm.local'],
            [
                'name' => 'Мария Георгиева',
                'password' => Hash::make('password'),
                'role_id' => $pmRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create backend developer user
        User::updateOrCreate(
            ['email' => 'petar@backend.local'],
            [
                'name' => 'Петър Георгиев',
                'password' => Hash::make('password'),
                'role_id' => $backendRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create frontend developer user
        User::updateOrCreate(
            ['email' => 'elena@frontend.local'],
            [
                'name' => 'Елена Петрова',
                'password' => Hash::make('password'),
                'role_id' => $frontendRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create designer user
        User::updateOrCreate(
            ['email' => 'alexandra@designer.local'],
            [
                'name' => 'Александра Димитрова',
                'password' => Hash::make('password'),
                'role_id' => $designerRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create QA engineer user
        User::updateOrCreate(
            ['email' => 'boris@qa.local'],
            [
                'name' => 'Борис Тодоров',
                'password' => Hash::make('password'),
                'role_id' => $qaRole->id,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Users seeded successfully!');
    }
}
