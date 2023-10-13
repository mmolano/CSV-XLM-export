<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccessTest extends TestCase
{
   use RefreshDatabase;

   /**
    * @test
    */
   public function accessBooksWithoutToken()
   {
      $response = $this->get('/api/book')
         ->assertStatus(401);

      $this->assertEquals('Access not granted', $response->json()['message']);
   }

   /**
    * @test
    */
   public function accessBookCreateWithoutToken()
   {
      $data = [
         'title' => 'Test Title',
         'author' => 'Test Author',
      ];

      $response = $this->post('/api/book', $data)
         ->assertStatus(401);

      $this->assertEquals('Access not granted', $response->json()['message']);
   }

   /**
    * @test
    */
   public function accessBookUpdateWithoutToken()
   {
      $this->setBook([
         'title' => 'Indiana Jones',
         'author' => 'Rodrigo Juarez'
      ]);

      $data = [
         'title' => 'Test Title',
         'author' => 'Test Author',
      ];

      $response = $this->patch('/api/book/1', $data)
         ->assertStatus(401);

      $this->assertEquals('Access not granted', $response->json()['message']);
   }


   /**
    * @test
    */
   public function accessBookDeleteWithoutToken()
   {
      $this->setBook([
         'title' => 'Indiana Jones',
         'author' => 'Rodrigo Juarez'
      ]);

      $response = $this->delete('/api/book/1')
         ->assertStatus(401);

      $this->assertEquals('Access not granted', $response->json()['message']);
   }
}