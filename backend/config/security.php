<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains various security-related configuration options for
    | your Laravel application. Feel free to modify these values based
    | on your security requirements.
    |
    */

    'headers' => [

        /*
        |--------------------------------------------------------------------------
        | Content Security Policy
        |--------------------------------------------------------------------------
        |
        | The Content Security Policy (CSP) helps prevent cross-site scripting
        | attacks and other code injection attacks. You can customize the
        | policy directives here.
        |
        */

        'csp' => env('SECURITY_CSP', false),

        /*
        |--------------------------------------------------------------------------
        | HSTS (HTTP Strict Transport Security)
        |--------------------------------------------------------------------------
        |
        | Force HTTPS connections and prevent protocol downgrade attacks.
        | Only enable in production with valid SSL certificates.
        |
        */

        'hsts' => [
            'enabled' => env('SECURITY_HSTS_ENABLED', env('APP_ENV') === 'production'),
            'max_age' => env('SECURITY_HSTS_MAX_AGE', 31536000),
            'include_subdomains' => env('SECURITY_HSTS_INCLUDE_SUBDOMAINS', true),
            'preload' => env('SECURITY_HSTS_PRELOAD', false),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Password Security
    |--------------------------------------------------------------------------
    |
    | Configure password security requirements for user registration
    | and password updates.
    |
    */

    'passwords' => [
        'min_length' => env('PASSWORD_MIN_LENGTH', 8),
        'require_uppercase' => env('PASSWORD_REQUIRE_UPPERCASE', true),
        'require_lowercase' => env('PASSWORD_REQUIRE_LOWERCASE', true),
        'require_numbers' => env('PASSWORD_REQUIRE_NUMBERS', true),
        'require_symbols' => env('PASSWORD_REQUIRE_SYMBOLS', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Security
    |--------------------------------------------------------------------------
    |
    | Configure authentication-related security settings.
    |
    */

    'auth' => [
        'max_login_attempts' => env('AUTH_MAX_LOGIN_ATTEMPTS', 5),
        'lockout_duration' => env('AUTH_LOCKOUT_DURATION', 900), // 15 minutes
        'require_email_verification' => env('AUTH_REQUIRE_EMAIL_VERIFICATION', true),
        'password_history_count' => env('AUTH_PASSWORD_HISTORY_COUNT', 5),
    ],

];


















