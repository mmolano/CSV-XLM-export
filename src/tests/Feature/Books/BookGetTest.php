<?php

namespace Tests\Feature\Books;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookGetTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     */
    public function getBookWithoutBooksInDb()
    {
        $response = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertEmpty($response->json()['data']);
    }

    /**
     * @test
     */
    public function getBookWithOneBookInDb()
    {
        $book = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);

        $response = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(1, $response->json()["data"]);

        $this->assertEquals($book['data']['id'], $response->json()["data"][0]['id']);
        $this->assertEquals($book['data']['title'], $response->json()["data"][0]['title']);
        $this->assertEquals($book['data']['author'], $response->json()["data"][0]['author']);
    }

    /**
     * @test
     */
    public function getBookWithMultipleBooksInDb()
    {
        $book1 = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);
        $book2 = $this->setBook([
            'title' => 'Harry Potter',
            'author' => 'Ketty Jones'
        ]);
        $book3 = $this->setBook([
            'title' => 'Ted',
            'author' => 'Henry Klein'
        ]);

        $response = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(3, $response->json()["data"]);

        $this->assertEquals($book1['data']['id'], $response->json()["data"][0]['id']);
        $this->assertEquals($book1['data']['title'], $response->json()["data"][0]['title']);
        $this->assertEquals($book1['data']['author'], $response->json()["data"][0]['author']);

        $this->assertEquals($book2['data']['id'], $response->json()["data"][1]['id']);
        $this->assertEquals($book2['data']['title'], $response->json()["data"][1]['title']);
        $this->assertEquals($book2['data']['author'], $response->json()["data"][1]['author']);

        $this->assertEquals($book3['data']['id'], $response->json()["data"][2]['id']);
        $this->assertEquals($book3['data']['title'], $response->json()["data"][2]['title']);
        $this->assertEquals($book3['data']['author'], $response->json()["data"][2]['author']);
    }

    /**
     * @test
     */
    public function getBooksWithSortOrderBadParams()
    {
        $book1 = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);
        $book2 = $this->setBook([
            'title' => 'Harry Potter',
            'author' => 'Ketty Jones'
        ]);


        $response = $this->getBook('/book?sort_order=john')
            ->assertStatus(400);


        $this->assertEquals("The request could not be validated", $response->json()["message"]);
    }

    /**
     * @test
     */
    public function getBooksWithSortByBadParams()
    {
        $book1 = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);
        $book2 = $this->setBook([
            'title' => 'Harry Potter',
            'author' => 'Ketty Jones'
        ]);


        $response = $this->getBook('/book?sort_by=description')
            ->assertStatus(400);


        $this->assertEquals("The request could not be validated", $response->json()["message"]);
    }

    /**
     * @test
     */
    public function getBooksWithSearch()
    {
        $book1 = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);
        $book2 = $this->setBook([
            'title' => 'Harry Potter',
            'author' => 'Ketty Jones'
        ]);
        $book3 = $this->setBook([
            'title' => 'Ted',
            'author' => 'Henry Klein'
        ]);

        $response = $this->getBook('/book?search=ted')
            ->assertSuccessful();

        $this->assertCount(1, $response->json()["data"]);

        $this->assertEquals($book3['data']['id'], $response->json()["data"][0]['id']);
        $this->assertEquals($book3['data']['title'], $response->json()["data"][0]['title']);
        $this->assertEquals($book3['data']['author'], $response->json()["data"][0]['author']);

        $response = $this->getBook('/book?search=e')
            ->assertSuccessful();

        $this->assertCount(3, $response->json()["data"]);

        $this->assertEquals($book1['data']['id'], $response->json()["data"][0]['id']);
        $this->assertEquals($book1['data']['title'], $response->json()["data"][0]['title']);
        $this->assertEquals($book1['data']['author'], $response->json()["data"][0]['author']);

        $this->assertEquals($book2['data']['id'], $response->json()["data"][1]['id']);
        $this->assertEquals($book2['data']['title'], $response->json()["data"][1]['title']);
        $this->assertEquals($book2['data']['author'], $response->json()["data"][1]['author']);

        $this->assertEquals($book3['data']['id'], $response->json()["data"][2]['id']);
        $this->assertEquals($book3['data']['title'], $response->json()["data"][2]['title']);
        $this->assertEquals($book3['data']['author'], $response->json()["data"][2]['author']);
    }

    /**
     * @test
     */
    public function getBooksWithSortsGoodParams()
    {
        $book1 = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);
        $book2 = $this->setBook([
            'title' => 'Harry Potter',
            'author' => 'Ketty Jones'
        ]);
        $book3 = $this->setBook([
            'title' => 'Ted',
            'author' => 'Henry Klein'
        ]);

        $response = $this->getBook('/book?sort_by=title&sort_order=asc')
            ->assertSuccessful();

        $this->assertCount(3, $response->json()["data"]);

        $this->assertEquals($book1['data']['id'], $response->json()["data"][1]['id']);
        $this->assertEquals($book1['data']['title'], $response->json()["data"][1]['title']);
        $this->assertEquals($book1['data']['author'], $response->json()["data"][1]['author']);

        $this->assertEquals($book2['data']['id'], $response->json()["data"][0]['id']);
        $this->assertEquals($book2['data']['title'], $response->json()["data"][0]['title']);
        $this->assertEquals($book2['data']['author'], $response->json()["data"][0]['author']);

        $this->assertEquals($book3['data']['id'], $response->json()["data"][2]['id']);
        $this->assertEquals($book3['data']['title'], $response->json()["data"][2]['title']);
        $this->assertEquals($book3['data']['author'], $response->json()["data"][2]['author']);

        $response = $this->getBook('/book?sort_by=title&sort_order=desc')
            ->assertSuccessful();

        $this->assertCount(3, $response->json()["data"]);

        $this->assertEquals($book1['data']['id'], $response->json()["data"][1]['id']);
        $this->assertEquals($book1['data']['title'], $response->json()["data"][1]['title']);
        $this->assertEquals($book1['data']['author'], $response->json()["data"][1]['author']);

        $this->assertEquals($book2['data']['id'], $response->json()["data"][2]['id']);
        $this->assertEquals($book2['data']['title'], $response->json()["data"][2]['title']);
        $this->assertEquals($book2['data']['author'], $response->json()["data"][2]['author']);

        $this->assertEquals($book3['data']['id'], $response->json()["data"][0]['id']);
        $this->assertEquals($book3['data']['title'], $response->json()["data"][0]['title']);
        $this->assertEquals($book3['data']['author'], $response->json()["data"][0]['author']);
    }

    /**
     * @test
     */
    public function getBooksWithSortsGoodParamsAndSearch()
    {
        $book1 = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);
        $book2 = $this->setBook([
            'title' => 'Harry Potter',
            'author' => 'Ketty Jones'
        ]);
        $book3 = $this->setBook([
            'title' => 'Ted',
            'author' => 'Henry Klein'
        ]);

        $response = $this->getBook('/book?sort_by=title&sort_order=asc&search=o')
            ->assertSuccessful();

        $this->assertCount(2, $response->json()["data"]);

        $this->assertEquals($book1['data']['id'], $response->json()["data"][1]['id']);
        $this->assertEquals($book1['data']['title'], $response->json()["data"][1]['title']);
        $this->assertEquals($book1['data']['author'], $response->json()["data"][1]['author']);

        $this->assertEquals($book2['data']['id'], $response->json()["data"][0]['id']);
        $this->assertEquals($book2['data']['title'], $response->json()["data"][0]['title']);
        $this->assertEquals($book2['data']['author'], $response->json()["data"][0]['author']);
    }
}
