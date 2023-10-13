<?php

namespace Tests;

use App\Models\Book;
use App\Models\Consumer;
use Faker\Factory;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Support\Str;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public $faker;

    public function __construct(?string $name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);

        $this->faker = Factory::create('fr_FR');
    }

    private function createConsumer(): Consumer
    {
        return Consumer::create([
            'token' => Str::random(32),
        ]);
    }

    public function getBook(string $url): TestResponse
    {
        $consumer = $this->createConsumer();

        return $this->get('/api' . $url, [
            'Authorization' => 'Bearer ' . $consumer->token
        ]);
    }

    public function postBook(string $url, array $params = []): TestResponse
    {
        $consumer = $this->createConsumer();

        return $this->post('/api' . $url, $params, [
            'Authorization' => 'Bearer ' . $consumer->token
        ]);
    }

    public function putBook(string $url, array $params = []): TestResponse
    {
        $consumer = $this->createConsumer();

        return $this->patch('/api' . $url, $params, [
            'Authorization' => 'Bearer ' . $consumer->token
        ]);
    }

    public function deleteBook(string $url): TestResponse
    {
        $consumer = $this->createConsumer();

        return $this->delete('/api' . $url, [], [
            'Authorization' => 'Bearer ' . $consumer->token
        ]);
    }

    public function setBook(array $data = [])
    {
        $data = array_replace_recursive([
            'title' => $data['title'],
            'author' => $data['author']
        ], $data);

        return $this->postBook('/book', $data)->json();
    }
}