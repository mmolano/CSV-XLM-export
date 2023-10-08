<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use App\Http\Controllers\BookController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('book')->group(function () {
    Route::get('/', [BookController::class, 'all'])->name('book.all');
    Route::post('/', [BookController::class, 'store'])->name('book.post');
    Route::put('/{id}', [BookController::class, 'update'])->name('book.update');
    Route::delete('/{id}', [BookController::class, 'destroy'])->name('book.delete');
});

Route::get('/book/export/csv', [BookController::class, 'exportToCSV'])->name('book.csv');
Route::get('/book/export/xml', [BookController::class, 'exportToXML'])->name('book.xml');
