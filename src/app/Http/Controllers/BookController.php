<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    public function all(): JsonResponse
    {
        return response()
            ->json(Book::all());
    }

    public function store(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'title' => ['string', 'required'],
            'author' => ['string', 'required']
        ]);

        if ($validation->fails()) {
            Log::error('Could not validate request', [
                'path' => class_basename(self::class),
                'func' => 'store',
                'message' => json_encode($validation->errors())
            ]);
            return response()->json([
                'message' => 'Could not validate request'
            ], 400);
        } else if (!$book = Book::create($request->only(['title', 'author']))) {
            return response()->json([
                'message' => 'Error while trying to add a new book'
            ], 400);
        }

        return response()->json([
            'message' => 'Book added',
            'data' => $book
        ], 200);
    }

    public function destroy(Request $request): JsonResponse
    {
        if (!$book = Book::where('id', $request->id)->first()) {
            Log::error('Could not find the book', [
                'path' => class_basename(self::class),
                'func' => 'destroy',
                'message' => 'The book with id: '. $request->id . ' could not be find'
            ]);
            return response()->json([
                'message' => 'Could not find the book'
            ], 400);
        } else if (!$book->delete()) {
            return response()->json([
                'message' => 'Could not delete the book'
            ], 400);
        }

        return response()->json([
            'message' => 'The book has been deleted'
        ], 200);
    }

    public function update(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'author' => ['string']
        ]);

        if ($validation->fails()) {
            Log::error('Could not validate request', [
                'path' => class_basename(self::class),
                'func' => 'update',
                'message' => json_encode($validation->errors())
            ]);
            return response()->json([
                'message' => 'Could not validate request'
            ], 400);
        } else if (!$book = Book::where('id', $request->id)->first()) {
            return response()->json([
                'message' => 'Could not find the book'
            ], 400);
        } else if (!$book->update($request->only('author'))) {
            return response()->json([
                'message' => 'Could not update author'
            ], 400);
        };

        return response()->json([
            'message' => 'Book author has been updated',
            'data' => $book
        ], 200);
    }
}
