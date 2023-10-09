<?php

use Illuminate\Http\Request;
use App\Http\Controllers\BookController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('book')->group(function () {
    Route::get('/', [BookController::class, 'all'])->name('book.all');
    Route::get('/{id}', [BookController::class, 'show'])->name('book.show');
    Route::post('/', [BookController::class, 'store'])->name('book.post');
    Route::patch('/{id}', [BookController::class, 'update'])->name('book.update');
    Route::delete('/{id}', [BookController::class, 'destroy'])->name('book.delete');
});

