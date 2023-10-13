<?php

namespace Tests\Feature\Books;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookDeleteTest extends TestCase
{
   use RefreshDatabase;

   /**
    * @test
    */
   public function deleteBookWithInvalidId()
   {
      $this->setBook([
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

      $this->assertCount(1, $bookExist->json()["data"]);

      $response = $this->deleteBook('/book/' . $book['data']['id'])
         ->assertSuccessful();

      $bookDeleted = $this->getBook('/book')
         ->assertSuccessful();

      $this->assertCount(0, $bookDeleted->json()["data"]);

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

      $this->assertCount(3, $bookExist->json()["data"]);

      $response = $this->deleteBook('/book/' . $book2['data']['id'])
         ->assertSuccessful();

      $bookDeleted = $this->getBook('/book')
         ->assertSuccessful();

      $this->assertCount(2, $bookDeleted->json()["data"]);

      $this->assertEquals('The book has been deleted', $response->json()['message']);

      $this->assertEquals($book['data']['id'], $bookDeleted->json()["data"][0]['id']);
      $this->assertEquals($book['data']['author'], $bookDeleted->json()["data"][0]['author']);

      $this->assertEquals($book3['data']['id'], $bookDeleted->json()["data"][1]['id']);
      $this->assertEquals($book3['data']['author'], $bookDeleted->json()["data"][1]['author']);
   }
}