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
     * ----- GET & POST /book methods -----
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
        $book = $this->setBook([
            'title' => 'Indiana Jones',
            'author' => 'Rodrigo Juarez'
        ]);

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

        $this->assertEquals($book['data']['id'], $updated->json()[0]['id']);
        $this->assertEquals($newParams['author'], $updated->json()[0]['author']);
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

        $this->assertEquals($book['data']['id'], $updated->json()[0]['id']);
        $this->assertEquals($book['data']['author'], $updated->json()[0]['author']);

        $this->assertEquals($book2['data']['id'], $updated->json()[1]['id']);
        $this->assertEquals($newParams['author'], $updated->json()[1]['author']);

        $this->assertEquals($book3['data']['id'], $updated->json()[2]['id']);
        $this->assertEquals($book3['data']['author'], $updated->json()[2]['author']);
    }

    /*
     * ----- Route DELETE /book -----
     */
    /**
     * @test
     */
    public function deleteBookWithInvalidId()
    {
        $book = $this->setBook([
            'title' => 'Adventure Time',
            'author' => 'Georges Ram'
        ]);

        $response = $this->deleteBook('/book/999');


        $this->assertEquals('Could not find the requested book', $response->json()['message']);
    }

    /**
     * @test
     */
    public function deleteBookWithGoodId()
    {
        $book = $this->setBook([
            'title' => 'Adventure Time',
            'author' => 'Georges Ram'
        ]);

        $bookExist = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(1, $bookExist->json());

        $response = $this->deleteBook('/book/' . $book['data']['id'])
            ->assertSuccessful();

        $bookDeleted = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(0, $bookDeleted->json());

        $this->assertEquals('The book has been deleted', $response->json()['message']);
    }

    /**
     * @test
     */
    public function deleteBookWithMultipleBooks()
    {
        $book = $this->setBook([
            'title' => 'Adventure Time',
            'author' => 'Georges Ram'
        ]);

        $book2 = $this->setBook([
            'title' => 'Adventure Time',
            'author' => 'Georges Ram'
        ]);

        $book3 = $this->setBook([
            'title' => 'Adventure Time',
            'author' => 'Georges Ram'
        ]);

        $bookExist = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(3, $bookExist->json());

        $response = $this->deleteBook('/book/' . $book2['data']['id'])
            ->assertSuccessful();

        $bookDeleted = $this->getBook('/book')
            ->assertSuccessful();

        $this->assertCount(2, $bookDeleted->json());

        $this->assertEquals('The book has been deleted', $response->json()['message']);

        $this->assertEquals($book['data']['id'], $bookDeleted->json()[0]['id']);
        $this->assertEquals($book['data']['author'], $bookDeleted->json()[0]['author']);

        $this->assertEquals($book3['data']['id'], $bookDeleted->json()[1]['id']);
        $this->assertEquals($book3['data']['author'], $bookDeleted->json()[1]['author']);
    }
}
