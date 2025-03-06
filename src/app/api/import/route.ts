/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable react/no-unescaped-entities */
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { z } from "zod";
import { RecordService } from "../(services)/record-service";

// Schema for validating the Excel data
const excelRowSchema = z.object({
  date: z.string(),
  category: z.string(),
  amount: z.number(),
  comment: z.string().optional().nullable(),
  isExpense: z.boolean(),
});

type ExcelRow = z.infer<typeof excelRowSchema>;

// Category mapping for Excel import
// Maps Excel category names to database category names
const CATEGORY_MAPPING: Record<string, string> = {
  Internet: "Rent & Bills",
  "Wellness & Beauty": "Wellness and Beauty",
  Taxes: "Rent & Bills",
  // Add more mappings as needed
};

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read the file as an array buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    // Process the Excel data
    const result = await processExcelData(workbook);

    return NextResponse.json(
      {
        success: true,
        message: "Import completed successfully",
        data: {
          totalRecords: result.totalRecords,
          errors: result.errors,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error importing Excel data:", error);
    return NextResponse.json(
      {
        error: "Failed to import Excel data",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

async function processExcelData(workbook: XLSX.WorkBook) {
  const result = {
    totalRecords: 0,
    errors: [] as { row: number; sheet: string; error: string }[],
  };

  // Get the sheets we're interested in
  const sheets = workbook.SheetNames;

  for (const sheetName of sheets) {
    // Only process sheets that contain "income" or "expense" (case insensitive)
    const isIncomeSheet = sheetName.toLowerCase().includes("income");
    const isExpenseSheet = sheetName.toLowerCase().includes("expense");

    if (!isIncomeSheet && !isExpenseSheet) {
      continue; // Skip sheets that don't match our criteria
    }

    const isExpense = isExpenseSheet;
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    console.log(`Processing sheet: ${sheetName}, rows: ${jsonData.length}`);

    // Process each row
    for (let rowIndex = 0; rowIndex < jsonData.length; rowIndex++) {
      try {
        const row = jsonData[rowIndex] as any;

        // Skip header row or empty rows
        if (Object.keys(row).length < 3) {
          console.log(`Skipping row ${rowIndex}: Not enough columns`);
          continue;
        }

        // Extract data from the row
        // The first column might have the sheet name as its key
        const keys = Object.keys(row);

        // Date is either in the first column or in __EMPTY if the first column has the sheet name
        let dateStr;
        let categoryName;
        let amount;
        let comment;

        if (
          keys[0].includes("list") ||
          keys[0].includes("income") ||
          keys[0].includes("expense")
        ) {
          // Format where first column has sheet name
          dateStr = row[keys[0]]; // Date is in the first column value
          categoryName = row["__EMPTY"]; // Category is in the second column
          amount = parseFloat(row["__EMPTY_2"]); // Amount is in the fourth column
          comment = row["__EMPTY_9"] || null; // Comment is in the last column
        } else {
          // Try to find the right columns by position
          dateStr = row[keys[0]]; // First column should be date
          categoryName = row[keys[1]]; // Second column should be category

          // Find the amount column - look for a numeric value
          for (let i = 2; i < keys.length; i++) {
            if (
              typeof row[keys[i]] === "number" ||
              !isNaN(parseFloat(row[keys[i]]))
            ) {
              amount = parseFloat(row[keys[i]]);
              break;
            }
          }

          // Comment is usually one of the last columns
          comment = row[keys[keys.length - 1]] || null;
        }

        // Skip if we couldn't extract the essential data
        if (!dateStr || !categoryName || !amount) {
          console.log(`Skipping row ${rowIndex}: Missing essential data`, {
            dateStr,
            categoryName,
            amount,
          });
          continue;
        }

        // Parse the date
        let date: Date;

        if (typeof dateStr === "string" && dateStr.includes("/")) {
          // Handle DD/MM/YYYY format
          const parts = dateStr.split("/");
          if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
            const year = parseInt(parts[2], 10);

            // Create date in the local timezone (GMT+1)
            // First create a UTC date at midnight
            const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));

            // Add one full day (24 hours) to fix the date display issue
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            date = new Date(utcDate.getTime() + oneDayInMilliseconds);

            console.log(
              `Date conversion: Excel=${dateStr}, UTC=${utcDate.toISOString()}, Adjusted=${date.toISOString()}`
            );
          } else {
            date = parseExcelDate(dateStr.toString());
          }
        } else {
          date = parseExcelDate(dateStr.toString());
        }

        // Log the date for debugging
        console.log(
          `Row ${rowIndex} - Original date: ${dateStr}, Parsed date: ${date.toISOString()}`
        );

        // Map category name if needed
        let mappedCategoryName = CATEGORY_MAPPING[categoryName] || categoryName;

        // Special case for "Other" category - map to "Gift" only for income
        if (
          (categoryName === "Other" || categoryName === "Interest") &&
          !isExpense
        ) {
          mappedCategoryName = "Gift";
        }

        // Find the category ID based on the category name
        const categoryResult = await db.query.categories.findFirst({
          where: (categories, { eq, and }) =>
            and(
              eq(categories.name, mappedCategoryName),
              eq(categories.isExpense, isExpense)
            ),
        });

        if (!categoryResult) {
          result.errors.push({
            row: rowIndex + 2, // +2 to account for 0-indexing and header row
            sheet: sheetName,
            error: `Category "${categoryName}" (mapped to "${mappedCategoryName}") not found for ${
              isExpense ? "expense" : "income"
            }`,
          });
          continue;
        }

        // Create the record
        await RecordService.createRecord({
          categoryId: categoryResult.id,
          value: amount,
          comment: comment,
          dateUtc: date.toISOString(),
          isExpense: isExpense,
        });

        result.totalRecords++;
      } catch (error) {
        console.error(`Error processing row ${rowIndex}:`, error);
        result.errors.push({
          row: rowIndex + 2, // +2 to account for 0-indexing and header row
          sheet: sheetName,
          error: (error as Error).message,
        });
      }
    }
  }

  return result;
}

// Helper function to parse Excel date string or number
function parseExcelDate(dateInput: string | number): Date {
  let date: Date;

  if (typeof dateInput === "number" || !isNaN(Number(dateInput))) {
    // Convert to number if it's a string containing a number
    const excelSerialDate =
      typeof dateInput === "number" ? dateInput : Number(dateInput);

    // Excel's date system has a quirk - Excel believes that 1900 was a leap year
    // when it wasn't. This affects dates after February 28, 1900.
    // For our purposes, we'll just handle the conversion directly.

    // Excel dates are number of days since December 30, 1899
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    // Create a date for December 30, 1899 in UTC
    const excelEpoch = new Date(Date.UTC(1899, 11, 30, 0, 0, 0));

    // Calculate the JavaScript date in UTC
    let utcDate = new Date(
      excelEpoch.getTime() + excelSerialDate * millisecondsPerDay
    );

    // If the date is after March 1, 1900, we need to adjust for Excel's leap year bug
    if (excelSerialDate >= 60) {
      // Subtract one day to account for the non-existent February 29, 1900
      utcDate = new Date(utcDate.getTime() - millisecondsPerDay);
    }

    // Add one full day to fix the date display issue
    date = new Date(utcDate.getTime() + millisecondsPerDay);
  } else {
    // Try to parse the date string
    // First, check if it's in DD/MM/YYYY format
    if (typeof dateInput === "string" && dateInput.includes("/")) {
      const parts = dateInput.split("/");
      if (parts.length === 3) {
        // Assuming DD/MM/YYYY format
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed in JS
        const year = parseInt(parts[2], 10);

        // Create UTC date
        const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));

        // Add one full day to fix the date display issue
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        date = new Date(utcDate.getTime() + millisecondsPerDay);
      } else {
        // Create a UTC date
        date = new Date(dateInput);
      }
    } else {
      // Create a UTC date
      date = new Date(dateInput);
    }
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateInput}`);
  }

  return date;
}
