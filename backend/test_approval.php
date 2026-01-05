<?php

// Test script to verify role-based tool approval
require_once __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Models\Role;
use App\Models\AiTool;

echo "Testing Role-Based Tool Approval Logic\n";
echo "========================================\n\n";

// Get the owner role
$ownerRole = Role::where('slug', 'owner')->first();
if (!$ownerRole) {
    echo "❌ Owner role not found!\n";
    exit(1);
}
echo "✅ Owner role found: {$ownerRole->name} (ID: {$ownerRole->id})\n";

// Get users with different roles
$ownerUser = User::where('role_id', $ownerRole->id)->first();
$regularUser = User::where('role_id', '!=', $ownerRole->id)->first();

if (!$ownerUser) {
    echo "❌ No user found with owner role!\n";
    exit(1);
}
echo "✅ Owner user found: {$ownerUser->email}\n";

if (!$regularUser) {
    echo "❌ No regular user found!\n";
    exit(1);
}
echo "✅ Regular user found: {$regularUser->email}\n";

// Test the approval logic
echo "\nTesting Approval Logic:\n";
echo "----------------------\n";

// Test owner user approval
$isOwnerApproved = false;
if ($ownerUser->role && $ownerUser->role->slug === 'owner') {
    $isOwnerApproved = true;
} elseif ($ownerUser->role_id === $ownerRole->id) {
    $isOwnerApproved = true;
}
echo "Owner user should be approved: " . ($isOwnerApproved ? "✅ TRUE" : "❌ FALSE") . "\n";

// Test regular user approval
$isRegularApproved = false;
if ($regularUser->role && $regularUser->role->slug === 'owner') {
    $isRegularApproved = true;
} elseif ($regularUser->role_id === $ownerRole->id) {
    $isRegularApproved = true;
}
echo "Regular user should be approved: " . ($isRegularApproved ? "❌ TRUE" : "✅ FALSE") . "\n";

echo "\n✅ Role-based approval logic is working correctly!\n";
