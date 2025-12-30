<?php

$app = new Illuminate\Foundation\Application(
    dirname(__DIR__)
);

// Register essential service providers
$app->register(Illuminate\Events\EventServiceProvider::class);
$app->register(Illuminate\Routing\RoutingServiceProvider::class);

// Register database provider if we need it
$app->register(Illuminate\Database\DatabaseServiceProvider::class);

// Register our kernels
$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);

return $app;
