import { CloudUpload } from "lucide-react";
import { useCallback, useState } from "react";
import type { Accept, FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { UploadFileResponse } from "./upload-files";
import { UploadSpinner } from "./upload-spinner";
import { useUploadFiles } from "./use-upload-files";

type UploadDropzoneState = {
  progress: number | null;
  isDragActive: boolean;
};

export function UploadZone(props: {
  /// Required props

  // Either the absolute upload URL or an async function that generates it
  uploadUrl: string | (() => Promise<string>);

  /// Optional functionality props

  // An object of with a common [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) as keys and an array of file extensions as values (similar to [showOpenFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker)'s types accept option)
  fileTypes?: Accept;
  // Whether the user can select multiple files to upload. Defaults to `false`
  multiple?: boolean;
  // Whether the upload should start right after the user drags the file in. Defaults to `false`
  uploadImmediately?: boolean;

  // Maximum allowed file size in bytes. Defaults to no limit.
  maxFileSizeInBytes: number;

  /// Optional life-cycle props

  // Called every time the combined upload progresses by at least 10 percent. `progress` % is a multiple of 10.
  onUploadProgress?: (progress: number) => void;
  // Called at the start of each upload.
  onUploadBegin?: (fileName: string) => void;
  // Called when all the files have been uploaded.
  onUploadComplete?: (uploaded: UploadFileResponse[]) => Promise<void> | void;
  // Called if there was an error at any point in the upload process.
  onUploadError?: (error: unknown) => void;

  /// Optional appearance props

  // Text, if provided, is shown below the "Choose files" line
  subtitle?: string;
  // Replaces all of the content shown in the dropzone. `progress` % is a multiple of 10 if the upload is in progress or `null`.
  content?: (state: UploadDropzoneState) => string;
  // Replaces the `className` of the dropzone. `progress` % is a multiple of 10 if the upload is in progress or `null`.
  className?: (state: UploadDropzoneState) => string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const { startUpload, isUploading } = useUploadFiles(props.uploadUrl, {
    onUploadComplete: async (res) => {
      setFiles([]);
      await props.onUploadComplete?.(res);
      setUploadProgress(0);
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
      props.onUploadProgress?.(p);
    },
    onUploadError: props.onUploadError,
    onUploadBegin: props.onUploadBegin,
  });

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (props.maxFileSizeInBytes) {
        const oversizedFiles = acceptedFiles.filter(
          (f) => f.size > props.maxFileSizeInBytes
        );
        if (oversizedFiles.length) {
          const sizeLimit = formatFileSize(props.maxFileSizeInBytes);
          setError(
            `File size exceeds ${sizeLimit}. Please try uploading a smaller file.`
          );
          return;
        }
      }
      setFiles(acceptedFiles);

      if (props.uploadImmediately === true) {
        void startUpload(acceptedFiles);
        return;
      }
    },
    [props, startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: props.fileTypes,
    disabled: false,
  });

  const onUploadClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (files.length === 0) {
      return;
    }

    void startUpload(files);
  };

  const combinedState = {
    isDragActive,
    progress: isUploading ? uploadProgress : null,
    error,
  };

  return (
    <div
      className={
        props.className?.(combinedState) ??
        twMerge(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-200/25 px-6 py-10 text-center",
          isDragActive && "bg-blue-600/10",
          files.length === 0 && "py-[4.25rem]"
        )
      }
      {...getRootProps()}
    >
      {props.content?.(combinedState) ?? <CloudUpload className="size-10" />}
      <label
        htmlFor="file-upload"
        className={twMerge(
          "relative text-primary mt-4 flex w-64 cursor-pointer items-center justify-center text-sm font-semibold leading-6 focus-within:outline-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
        )}
      >
        Choose files or drag and drop
        <input className="sr-only" {...getInputProps()} />
      </label>
      <div className="text-sm text-muted-foreground">
        Max file size: {formatFileSize(props.maxFileSizeInBytes)}
      </div>
      {props.subtitle !== undefined ? (
        <div
          className={twMerge(
            "m-0 h-[1.25rem] text-xs leading-5 text-gray-600 dark:text-gray-500"
          )}
        >
          {props.subtitle}
        </div>
      ) : null}
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
      {files.length > 0 ? (
        <button
          className={twMerge(
            "relative mt-4 flex h-10 w-36 items-center justify-center overflow-hidden rounded-md text-white after:transition-[width] after:duration-500",
            isUploading
              ? `before:absolute before:-z-20 before:w-full before:h-full before:bg-blue-400 ` +
                  `bg-blue-400 after:absolute after:-z-10 after:left-0 after:h-full after:bg-blue-600 ${progressWidths[uploadProgress]}`
              : "bg-blue-600"
          )}
          onClick={onUploadClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <UploadSpinner />
          ) : (
            `Upload ${files.length} file${files.length === 1 ? "" : "s"}`
          )}
        </button>
      ) : null}
    </div>
  );
}

const progressWidths: Record<number, string> = {
  0: "after:w-0",
  10: "after:w-[10%]",
  20: "after:w-[20%]",
  30: "after:w-[30%]",
  40: "after:w-[40%]",
  50: "after:w-[50%]",
  60: "after:w-[60%]",
  70: "after:w-[70%]",
  80: "after:w-[80%]",
  90: "after:w-[90%]",
  100: "after:w-[100%]",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";

  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";

  return (bytes / 1048576).toFixed(1) + " MB";
}
