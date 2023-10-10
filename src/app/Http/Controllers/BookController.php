<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    private function handleErrorResponse(int $errorType, string $functionType, string $logMessage = ''): JsonResponse
    {
        $errorMessages = [
            1 => [
                'message' => 'The request could not be validated',
                'status' => 400,
                'log' => true
            ],
            2 => [
                'message' => 'An error occured while adding a new book.',
                'status' => 500,
                'log' => false
            ],
            3 => [
                'message' => 'Could not find the requested book',
                'status' => 400,
                'log' => true
            ],
            4 => [
                'message' => 'Could not delete the requested book',
                'status' => 500,
                'log' => false
            ],
            5 => [
                'message' => 'Could not update the requested book',
                'status' => 500,
                'log' => false
            ]
        ];

        if ($log = $errorMessages[$errorType]['log']) {
            Log::error($log, [
                'path' => class_basename(self::class),
                'func' => $functionType,
                'message' => $logMessage,
            ]);
        }

        return response()->json([
            'message' => $errorMessages[$errorType]['message']
        ], $errorMessages[$errorType]['status']);
    }

    //TODO: update tests
    public function all(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'sort_by' => 'string|in:author,title',
            'sort_order' => 'string|in:asc,desc',
        ]);

        if ($validation->fails()) {
            return $this->handleErrorResponse(1, 'all', json_encode($validation->errors()));
        }

        $query = Book::query();

        if ($request->has('sort_by') && $request->has('sort_order')) {
            $sortField = $request->input('sort_by');
            $sortOrder = $request->input('sort_order');
            $query->orderBy($sortField, $sortOrder);
        }

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('title', 'like', '%' . $searchTerm . '%')
                ->orWhere('author', 'like', '%' . $searchTerm . '%');
        }

        $books = $query->paginate(5);

        return response()->json($books);
    }

    public function store(Request $request): JsonResponse
    {
        $validation = Validator::make($request->all(), [
            'title' => ['string', 'required'],
            'author' => ['string', 'required']
        ]);

        if ($validation->fails()) {
            return $this->handleErrorResponse(1, 'store', json_encode($validation->errors()));
        } else if (!$book = Book::create($request->only(['title', 'author']))) {
            return $this->handleErrorResponse(2, 'store');
        }

        return response()->json([
            'message' => 'A new book has been added',
            'data' => $book
        ], 200);
    }

    public function destroy(Request $request): JsonResponse
    {
        if (!$book = Book::where('id', $request->id)->first()) {
            return $this->handleErrorResponse(3, 'destroy', 'The book with id: ' . $request->id . ' could not be found');
        } else if (!$book->delete()) {
            return $this->handleErrorResponse(4, 'destroy');
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
            return $this->handleErrorResponse(1, 'update', json_encode($validation->errors()));
        } else if (!$book = Book::where('id', $request->id)->first()) {
            return $this->handleErrorResponse(3, 'update', 'The book with id: ' . $request->id . ' could not be find');
        } else if (!$book->update($request->only('author'))) {
            return $this->handleErrorResponse(5, 'update');
        }
        ;

        return response()->json([
            'message' => 'Book author has been updated',
            'data' => $book
        ], 200);
    }

    
}