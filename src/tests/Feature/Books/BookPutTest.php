<?php

namespace Tests\Feature\Books;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookPutTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     */
    public function putBookWithBadBookId()
    {
        $response = $this->putBook('/book/9999')
            ->assertStatus(400);

        $this->assertEquals('Could not find the requested book', $response->json()['message']);
    }

    /**
     * @test
     */
    public function putBookWithBadParam()
    {
        $book = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);

        $response = $this->putBook('/book/' . $book['data']['id'], [
            'author' => 1
        ]);

        $this->assertEquals('The request could not be validated', $response->json()['message']);
    }

    /**
     * @test
     */
    public function putBookWithGoodParams()
    {
        $book = $this->setBook([
            'title' => 'Adventure Time',
            'author' => 'Georges Ram'
        ]);

        $newParams = [
            'author' => 'John Leon'
        ];

        $this->putBook('/book/' . $book['data']['id'], $newParams);

        $updated = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertEquals($book['data']['id'], $updated->json()["data"][0]['id']);
        $this->assertEquals($newParams['author'], $updated->json()["data"][0]['author']);
    }

    /**
     * @test
     */
    public function putBookWithGoodParamsAndMultipleBooks()
    {
        $book = $this->setBook([
            'title' => 'Adventure Time',
            'author' => 'Georges Ram'
        ]);
        $book2 = $this->setBook([
            'title' => 'Peppa',
            'author' => 'Gregory Liam'
        ]);
        $book3 = $this->setBook([
            'title' => 'Razer',
            'author' => 'Erica Malory'
        ]);

        $newParams = [
            'author' => 'John Leon'
        ];

        $this->putBook('/book/' . $book2['data']['id'], $newParams);

        $updated = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertEquals($book['data']['id'], $updated->json()["data"][0]['id']);
        $this->assertEquals($book['data']['author'], $updated->json()["data"][0]['author']);

        $this->assertEquals($book2['data']['id'], $updated->json()["data"][1]['id']);
        $this->assertEquals($newParams['author'], $updated->json()["data"][1]['author']);

        $this->assertEquals($book3['data']['id'], $updated->json()["data"][2]['id']);
        $this->assertEquals($book3['data']['author'], $updated->json()["data"][2]['author']);
    }
}
