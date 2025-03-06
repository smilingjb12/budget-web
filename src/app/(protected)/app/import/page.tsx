"use client";

/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable react/no-unescaped-entities */

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadFileResponse } from "@/components/upload-zone/upload-files";
import { UploadZone } from "@/components/upload-zone/upload-zone";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ImportResult = {
  totalRecords: number;
  errors: { row: number; sheet: string; error: string }[];
};

export default function ImportPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [clearSuccess, setClearSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleUploadComplete = async (uploaded: UploadFileResponse[]) => {
    setIsUploading(false);

    if (uploaded.length === 0) {
      setError("No files were uploaded");
      return;
    }

    try {
      const data = uploaded[0].response as any;

      if (data.success) {
        setImportResult(data.data);
      } else {
        setError(data.error || "Failed to import data");
      }
    } catch (err) {
      setError("An error occurred while processing the import");
      console.error(err);
    }
  };

  const handleUploadError = (error: unknown) => {
    setIsUploading(false);
    setError((error as Error).message || "An error occurred during upload");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleUploadBegin = () => {
    setIsUploading(true);
    setError(null);
    setImportResult(null);
  };

  const handleManualUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);
    setImportResult(null);

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setIsUploading(false);

      if (data.success) {
        setImportResult(data.data);
      } else {
        setError(data.error || "Failed to import data");
      }
    } catch (err) {
      setIsUploading(false);
      setError((err as Error).message || "An error occurred during upload");
      console.error(err);
    }
  };

  const handleClearRecords = async () => {
    setIsClearing(true);
    setClearSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/records/clear", {
        method: "DELETE",
      });

      const data = await response.json();

      setIsClearing(false);

      if (data.success) {
        setClearSuccess(
          data.message || "All records have been cleared successfully"
        );
      } else {
        setError(data.error || "Failed to clear records");
      }
    } catch (err) {
      setIsClearing(false);
      setError(
        (err as Error).message || "An error occurred while clearing records"
      );
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Import Data</h1>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-500">
            Upload an Excel file with "Expenses" and "Income" sheets to import
            your budget data.
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All Records
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all records from the
                database. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearRecords}
                disabled={isClearing}
                className="bg-red-600 hover:bg-red-700"
              >
                {isClearing ? "Clearing..." : "Yes, delete all records"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {clearSuccess && (
        <Alert variant="default" className="bg-green-50 border-green-200 mb-6">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {clearSuccess}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Import from Excel</CardTitle>
          <CardDescription>
            Upload an Excel file with "Expenses" and "Income" sheets to import
            your budget data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">File Requirements:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Excel file (.xlsx) with "Expenses" and "Income" sheets</li>
              <li>
                Each sheet must have columns: "Date and time", "Category",
                "Amount in default currency", and "Comment" (optional)
              </li>
              <li>Categories must match existing categories in the system</li>
            </ul>
          </div>

          <UploadZone
            uploadUrl="/api/import"
            fileTypes={{
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
              "application/vnd.ms-excel": [".xls"],
            }}
            maxFileSizeInBytes={10 * 1024 * 1024} // 10MB
            multiple={false}
            onUploadBegin={handleUploadBegin}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            onUploadProgress={handleUploadProgress}
            subtitle="Drag and drop your Excel file here, or click to browse"
          />

          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">
              Alternative Upload Method
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              If you're experiencing issues with the drag and drop uploader, try
              this alternative method:
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleManualUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90"
                disabled={isUploading}
              />
            </div>
          </div>

          {isUploading && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {importResult && (
            <div className="mt-6 space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  Import Successful
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Successfully imported {importResult.totalRecords} records.
                </AlertDescription>
              </Alert>

              {importResult.errors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Errors ({importResult.errors.length}):
                  </h3>
                  <div className="max-h-60 overflow-y-auto border rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sheet
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Row
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Error
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {importResult.errors.map((error, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {error.sheet}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {error.row}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {error.error}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-4">
                <Button variant="outline" onClick={() => setImportResult(null)}>
                  Import Another File
                </Button>
                <Button onClick={() => router.push("/app/2025")}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Excel Format</CardTitle>
          <CardDescription>
            Your Excel file should follow this format:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Expenses Sheet
              </h3>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date and time
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount in default currency
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        05/03/2025
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        Food
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        32.47
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        Zabka
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        01/03/2025
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        Rent & Bills
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        1381.90
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        Warsaw rent
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Income Sheet
              </h3>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date and time
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount in default currency
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        27/02/2025
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        Paycheck
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        5600.00
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500"></td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        03/01/2025
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        Gift
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        1018.09
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
