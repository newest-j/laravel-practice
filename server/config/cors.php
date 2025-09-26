<?php
/*and as for this i wrote this because the cors i need because the is two different origin the frontend locahost 5173 and the backend localhost 8000
if it was pure laravel now not need for the cors because its all on port like localhost 8000 or backend.con or .api.com*/
return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */
    // ok so the cors path registration is only for a fetch and axios not a redirect 
    // the * in the api is a wildcard that mean include any path after the api
    // but sanctum is just that not path added to the front
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
