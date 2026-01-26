import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Github, Linkedin, Loader2, X, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EnhancedResumeUploadProps {
  onUpload: (text: string, githubUrl?: string, linkedinUrl?: string) => void;
  isAnalyzing?: boolean;
}

const EnhancedResumeUpload = ({ onUpload, isAnalyzing }: EnhancedResumeUploadProps) => {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Use PDF.js via CDN for text extraction
    const pdfjsLib = (window as any).pdfjsLib;
    
    if (!pdfjsLib) {
      // Fallback: read as text if PDF.js not loaded
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          resolve(text || "");
        };
        reader.readAsText(file);
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);
    setIsParsing(true);
    setParseError(null);

    try {
      let text = "";
      
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else {
        // Plain text or other formats
        text = await file.text();
      }

      if (!text.trim()) {
        throw new Error("No text could be extracted from the file");
      }

      setResumeText(text);
    } catch (error) {
      console.error("Error parsing file:", error);
      setParseError("Failed to parse file. Please try a different format or paste your resume text below.");
    } finally {
      setIsParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    disabled: isParsing || isAnalyzing,
  });

  const handleAnalyze = () => {
    if (resumeText.trim()) {
      onUpload(
        resumeText.trim(),
        githubUrl.trim() || undefined,
        linkedinUrl.trim() || undefined
      );
    }
  };

  const clearFile = () => {
    setFileName(null);
    setResumeText("");
    setParseError(null);
  };

  const isReady = resumeText.trim().length > 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Upload Your Resume
        </h2>
        <p className="text-muted-foreground">
          Our AI will extract and analyze your skills automatically
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? "upload-zone-active" : ""} ${
          isParsing || isAnalyzing ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {isParsing ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Parsing your resume...</p>
            </motion.div>
          ) : fileName ? (
            <motion.div
              key="file"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <FileText className="w-12 h-12 text-success mb-4" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-destructive-foreground" />
                </button>
              </div>
              <p className="font-medium">{fileName}</p>
              <p className="text-sm text-success flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-4 h-4" />
                Resume parsed successfully
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-primary mb-4" />
              <p className="font-medium mb-2">
                {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (PDF, TXT, DOC, DOCX)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {parseError && (
        <p className="text-destructive text-sm text-center">{parseError}</p>
      )}

      {/* Manual text input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Or paste your resume text:
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume content here..."
          className="w-full h-32 p-4 rounded-xl bg-secondary/50 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isAnalyzing}
        />
        <p className="text-xs text-muted-foreground text-right">
          {resumeText.length} characters {resumeText.length < 50 && "(minimum 50)"}
        </p>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub Profile (optional)
          </label>
          <Input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username"
            className="bg-secondary/50"
            disabled={isAnalyzing}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn Profile (optional)
          </label>
          <Input
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="bg-secondary/50"
            disabled={isAnalyzing}
          />
        </div>
      </div>

      {/* Analyze button */}
      <Button
        onClick={handleAnalyze}
        disabled={!isReady || isAnalyzing}
        className="w-full btn-primary h-12 text-lg"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Analyzing Your Career...
          </>
        ) : (
          "Analyze My Career Readiness"
        )}
      </Button>
    </motion.div>
  );
};

export default EnhancedResumeUpload;
