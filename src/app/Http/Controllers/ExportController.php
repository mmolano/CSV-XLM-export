<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use SoapBox\Formatter\Formatter;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class ExportController extends Controller
{
   private function generateExport($type, $format)
   {
      $columns = array_filter(array_map('trim', explode(',', $type)));

      $books = Book::select($columns)->get();

      switch ($format) {
         case 'csv':
            return $this->exportCSV($type, $books);
         case 'xml':
            return $this->exportXML($type, $books);
         default:
            return null;
      }
   }

   private function exportCSV($type, $collection)
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

   private function exportXML($type, $collection)
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

   private function createZip($files)
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

   public function export(Request $request, $type, $format)
   {
      $isXmlRequested = str_contains($format, 'xml');
      $isCsvRequested = str_contains($format, 'csv');
      $filesToDownload = [];

      if ($isXmlRequested) {
         $filesToDownload[] = $this->generateExport($type, 'xml');
      }

      if ($isCsvRequested) {
         $filesToDownload[] = $this->generateExport($type, 'csv');
      }

      if ($isXmlRequested && $isCsvRequested) {
         $zipFileName = $this->createZip($filesToDownload);
         return response()->download(storage_path("app/public/$zipFileName"), $zipFileName, ['Content-Disposition' => 'attachment; filename=' . $zipFileName]);
      }

      $fileToDownload = $filesToDownload[0];

      return response()->download(storage_path("app/public/$fileToDownload"), $fileToDownload, ['Content-Disposition' => 'attachment; filename=' . $fileToDownload]);
   }
}

?>