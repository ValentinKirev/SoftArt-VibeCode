<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Owner',
                'slug' => 'owner',
                'description' => 'System owner with full access',
                'permissions' => ['*'], // All permissions
            ],
            [
                'name' => 'Project Manager',
                'slug' => 'pm',
                'description' => 'Project management and team coordination',
                'permissions' => ['view_all_tools', 'manage_projects', 'view_analytics', 'manage_team', 'assign_tasks'],
            ],
            [
                'name' => 'Backend Developer',
                'slug' => 'backend',
                'description' => 'Backend development tools and API management',
                'permissions' => ['view_backend_tools', 'manage_apis', 'monitor_performance', 'database_access', 'deploy_code'],
            ],
            [
                'name' => 'Frontend Developer',
                'slug' => 'frontend',
                'description' => 'Frontend development tools and UI components',
                'permissions' => ['view_frontend_tools', 'edit_ui_components', 'manage_assets', 'preview_changes'],
            ],
            [
                'name' => 'Designer',
                'slug' => 'designer',
                'description' => 'Design and creative tools',
                'permissions' => ['view_design_tools', 'manage_assets', 'create_designs', 'edit_templates'],
            ],
            [
                'name' => 'QA Engineer',
                'slug' => 'qa',
                'description' => 'Quality assurance and testing tools',
                'permissions' => ['view_testing_tools', 'run_tests', 'create_reports', 'manage_bugs', 'access_staging'],
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        $this->command->info('Roles seeded successfully!');
    }
}
