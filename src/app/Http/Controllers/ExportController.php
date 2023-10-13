<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use SoapBox\Formatter\Formatter;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class ExportController extends Controller
{
    private function handleErrorResponse(int $errorType, string $functionType, string $logMessage = ''): JsonResponse
    {
        $errorMessages = [
            1 => [
                'message' => 'The request could not be validated',
                'status' => 400,
                'log' => true
            ],
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

    private function generateExport(string $type, string $format, ?string $searchQuery, ?string $sortOrder, ?string $sortBy): ?string
    {
        $columns = array_filter(array_map('trim', explode(',', $type)));

        $books = Book::select($columns);

        if ($sortBy !== null && $sortOrder !== null) {
            $books->orderBy($sortBy, $sortOrder);
        }

        if ($searchQuery) {
            $books->where('title', 'like', '%' . $searchQuery . '%')
                ->orWhere('author', 'like', '%' . $searchQuery . '%');
        }

        $books = $books->get();

        switch ($format) {
            case 'csv':
                return $this->exportCSV($type, $books);
            case 'xml':
                return $this->exportXML($type, $books);
            default:
                return null;
        }
    }

    private function exportCSV(string $type, Collection $collection): string
    {
        $formattedData = [];

        foreach ($collection as $item) {
            $formattedItem = [];

            if (str_contains($type, 'title')) {
                $formattedItem['title'] = $item['title'];
            }

            if (str_contains($type, 'author')) {
                $formattedItem['author'] = $item['author'];
            }

            $formattedData[] = $formattedItem;
        }

        $formatter = Formatter::make($formattedData, Formatter::ARR);
        $csvData = $formatter->toCsv();

        $now = time();
        $file = $type . '-' . $now . '.csv';

        Storage::disk('local')->put('public/' . $file, $csvData);

        return $file;
    }

    private function exportXML(string $type, Collection $collection): string
    {
        $columns = array_filter(array_map('trim', explode(',', $type)));

        $formattedData = $collection->map(function ($item) use ($columns) {
            $formattedItem = [];
            foreach ($columns as $column) {
                $formattedItem[$column] = $item[$column];
            }
            return $formattedItem;
        });

        $formatter = Formatter::make($formattedData->toArray(), Formatter::ARR);
        $xmlData = $formatter->toXml();

        $now = time();
        $file = $type . '-' . $now . '.xml';

        Storage::disk('local')->put('public/' . $file, $xmlData);

        return $file;
    }

    private function createZip(array $files): string
    {
        $zipFileName = 'xml,csv' . time() . '.zip';
        $zip = new ZipArchive;

        if ($zip->open(storage_path("app/public/$zipFileName"), ZipArchive::CREATE) === TRUE) {
            foreach ($files as $file) {
                $zip->addFile(storage_path("app/public/$file"), $file);
            }
            $zip->close();
        }

        return $zipFileName;
    }

    public function export(Request $request, string $type, string $format)
    {
        $validation = Validator::make($request->all(), [
            'format' => 'nullable|string|in:xml,csv',
            'sort_by' => 'nullable|string|in:author,title',
            'sort_order' => 'nullable|string|in:asc,desc',
        ]);

        if ($validation->fails()) {
            return $this->handleErrorResponse(1, 'export', json_encode($validation->errors()));
        }

        $isXmlRequested = str_contains($format, 'xml');
        $isCsvRequested = str_contains($format, 'csv');
        $filesToDownload = [];

        $searchQuery = $request->query('search');
        $sortOrder = $request->query('sort_order');
        $sortBy = $request->query('sort_by');

        if ($isXmlRequested) {
            $filesToDownload[] = $this->generateExport($type, 'xml', $searchQuery, $sortOrder, $sortBy);
        }

        if ($isCsvRequested) {
            $filesToDownload[] = $this->generateExport($type, 'csv', $searchQuery, $sortOrder, $sortBy);
        }

        if ($isXmlRequested && $isCsvRequested) {
            $zipFileName = $this->createZip($filesToDownload);
            return response()->download(storage_path("app/public/$zipFileName"), $zipFileName, ['Content-Disposition' => 'attachment; filename=' . $zipFileName]);
        }

        $fileToDownload = $filesToDownload[0];

        return response()->download(storage_path("app/public/$fileToDownload"), $fileToDownload, ['Content-Disposition' => 'attachment; filename=' . $fileToDownload]);
    }
}
