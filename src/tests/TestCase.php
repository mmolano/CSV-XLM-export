<?php

namespace Tests;

use App\Models\Book;
use Faker\Factory;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\TestResponse;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public $faker;

    public function __construct(?string $name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);

        $this->faker = Factory::create('fr_FR');
    }

    public function getBook(string $url): TestResponse
    {
        return $this->get($url);
    }

    public function postBook(string $url, array $params = []): TestResponse
    {
        return $this->post($url, $params);
    }

    public function putBook(string $url, array $params = []): TestResponse
    {
        return $this->put($url, $params);
    }

    public function deleteBook(string $url): TestResponse
    {
        return $this->delete($url);
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
