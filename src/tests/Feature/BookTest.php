<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class BookTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    /*
     * ----- GET & POST /book -----
     */
    /**
     * @test
     */
    public function getBookWithoutBooksInDb()
    {
        $response = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertEmpty($response->json());
    }

    /**
     * @test
     */
    public function getBookWithOneBookInDb()
    {
        $params = [
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ];

        $book = $this->setBook($params);

        $response = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(1, $response->json());

        $this->assertEquals($book['data']['id'], $response->json()[0]['id']);
        $this->assertEquals($book['data']['title'], $response->json()[0]['title']);
        $this->assertEquals($book['data']['author'], $response->json()[0]['author']);
    }

    /**
     * @test
     */
    public function getBookWithMultipleBooksInDb()
    {
        $params1 = [
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ];

        $params2 = [
            'title' => 'Harry Potter',
            'author' => 'Ketty Jones'
        ];

        $params3 = [
            'title' => 'Ted',
            'author' => 'Henry Klein'
        ];

        $book1 = $this->setBook($params1);
        $book2 = $this->setBook($params2);
        $book3 = $this->setBook($params3);

        $response = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(3, $response->json());

        $this->assertEquals($book1['data']['id'], $response->json()[0]['id']);
        $this->assertEquals($book1['data']['title'], $response->json()[0]['title']);
        $this->assertEquals($book1['data']['author'], $response->json()[0]['author']);

        $this->assertEquals($book2['data']['id'], $response->json()[1]['id']);
        $this->assertEquals($book2['data']['title'], $response->json()[1]['title']);
        $this->assertEquals($book2['data']['author'], $response->json()[1]['author']);

        $this->assertEquals($book3['data']['id'], $response->json()[2]['id']);
        $this->assertEquals($book3['data']['title'], $response->json()[2]['title']);
        $this->assertEquals($book3['data']['author'], $response->json()[2]['author']);
    }

    /*
     * ----- Route PUT /book -----
     */

    /**
     * @test
     */
    public function putBookWithBadBookId()
    {
        $response = $this->putBook('/book/9999')
            ->assertStatus(400);

        $this->assertEquals('Could not find the book', $response->json()['message']);
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

        $response = $this->putBook('/book/'.$book['data']['id'], [
            'author' => 1
        ]);

        $this->assertEquals('Could not validate request', $response->json()['message']);
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

        $this->putBook('/book/'.$book['data']['id'], [
            'author' => 'John Leon'
        ]);

        $updated = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertEquals($book['data']['id'], $updated->json()[0]['id']);
    }
}
