import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

const ResumeUpload = ({ onUpload, isProcessing }: ResumeUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div
        {...getRootProps()}
        className={`upload-zone relative ${isDragActive ? "upload-zone-active" : ""} ${
          isProcessing ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4"
              >
                <Loader2 className="w-8 h-8 text-primary" />
              </motion.div>
              <p className="text-lg font-medium">Analyzing your resume...</p>
              <p className="text-sm text-muted-foreground mt-2">
                AI is extracting your skills
              </p>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <p className="text-lg font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Click or drag to replace
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6"
              >
                {isDragActive ? (
                  <FileText className="w-10 h-10 text-primary" />
                ) : (
                  <Upload className="w-10 h-10 text-primary" />
                )}
              </motion.div>
              <p className="text-xl font-semibold mb-2">
                {isDragActive ? "Drop your resume here" : "Upload your resume"}
              </p>
              <p className="text-muted-foreground">
                Drag & drop your PDF resume or click to browse
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>PDF format only</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated border gradient */}
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, hsl(262 83% 58% / 0.2) 0%, hsl(180 85% 55% / 0.2) 100%)',
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ResumeUpload;