<?php

/** @var Factory $factory */

use App\Models\Consumer;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

$factory->define(Consumer::class, function (Faker $faker) {
    return [
        'token' => 'replaceWithRealToken',
    ];
});