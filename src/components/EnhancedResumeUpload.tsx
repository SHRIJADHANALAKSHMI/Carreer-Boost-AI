import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Github, Linkedin, Loader2, X, CheckCircle2, Sparkles, CloudUpload } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EnhancedResumeUploadProps {
  onUpload: (text: string, githubUrl?: string, linkedinUrl?: string) => void;
  isAnalyzing?: boolean;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Floating particle component
const FloatingDot = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-primary/30"
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      y: [0, -30, -60],
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const EnhancedResumeUpload = ({ onUpload, isAnalyzing }: EnhancedResumeUploadProps) => {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="w-full max-w-2xl mx-auto space-y-8"
    >
      {/* Header with animated text */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <CloudUpload className="w-12 h-12 text-primary" />
        </motion.div>
        <h2 className="text-2xl md:text-4xl font-bold mb-3">
          {"Upload Your Resume".split(" ").map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground"
        >
          Our AI will extract and analyze your skills automatically
        </motion.p>
      </motion.div>

      {/* Enhanced Dropzone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <div
          {...getRootProps()}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-500 ${
            isDragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : fileName 
                ? "border-success/50 bg-success/5" 
                : "border-border hover:border-primary/50 bg-background/50"
          } ${isParsing || isAnalyzing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          
          {/* Background effects */}
          <motion.div
            animate={{ 
              opacity: isDragActive ? 0.1 : 0,
            }}
            className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"
          />

          {/* Floating dots when dragging */}
          {isDragActive && (
            <div className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                >
                  <FloatingDot delay={i * 0.2} />
                </motion.div>
              ))}
            </div>
          )}
        
        <AnimatePresence mode="wait">
          {isParsing ? (
            <motion.div
              key="parsing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center relative z-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-16 h-16 text-primary mb-4" />
              </motion.div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-muted-foreground font-medium"
              >
                Parsing your resume...
              </motion.p>
            </motion.div>
          ) : fileName ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center relative z-10"
            >
              <motion.div 
                className="relative"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0px hsl(142 70% 40% / 0)",
                      "0 0 30px hsl(142 70% 40% / 0.3)",
                      "0 0 0px hsl(142 70% 40% / 0)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mb-4"
                >
                  <FileText className="w-10 h-10 text-success" />
                </motion.div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center shadow-lg"
                >
                  <X className="w-4 h-4 text-destructive-foreground" />
                </motion.button>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-lg"
              >
                {fileName}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-success mt-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Resume parsed successfully</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center relative z-10"
            >
              <motion.div
                animate={isDragActive ? { 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                } : { y: [0, -5, 0] }}
                transition={{ duration: isDragActive ? 0.5 : 2, repeat: Infinity }}
                className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${
                  isDragActive ? "bg-primary/20" : "bg-secondary"
                }`}
              >
                <Upload className={`w-10 h-10 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
              </motion.div>
              <motion.p className="font-semibold text-lg mb-2">
                {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
              </motion.p>
              <p className="text-sm text-muted-foreground">
                or click to browse (PDF, TXT, DOC, DOCX)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.div>

      {parseError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm text-center"
        >
          {parseError}
        </motion.p>
      )}

      {/* Manual text input with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <label className="text-sm font-medium text-muted-foreground">
          Or paste your resume text:
        </label>
        <motion.div
          whileFocus={{ boxShadow: "0 0 20px hsl(262 83% 55% / 0.1)" }}
        >
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            className="w-full h-36 p-4 rounded-xl bg-background/80 border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            disabled={isAnalyzing}
          />
        </motion.div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {resumeText.length} characters {resumeText.length < 50 && "(minimum 50)"}
          </p>
          {resumeText.length >= 50 && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-success flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Ready
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Optional fields with staggered animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div
          whileHover={{ y: -2 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub Profile (optional)
          </label>
          <Input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username"
            className="bg-background/80 focus:ring-2 focus:ring-primary/50"
            disabled={isAnalyzing}
          />
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="space-y-2"
        >
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn Profile (optional)
          </label>
          <Input
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="bg-background/80 focus:ring-2 focus:ring-primary/50"
            disabled={isAnalyzing}
          />
        </motion.div>
      </motion.div>

      {/* Enhanced Analyze button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={handleAnalyze}
          disabled={!isReady || isAnalyzing}
          whileHover={isReady && !isAnalyzing ? { scale: 1.02, boxShadow: "0 20px 40px hsl(262 83% 55% / 0.25)" } : {}}
          whileTap={isReady && !isAnalyzing ? { scale: 0.98 } : {}}
          className={`w-full h-14 rounded-xl font-semibold text-lg relative overflow-hidden ${
            isReady && !isAnalyzing
              ? "bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] text-white"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {/* Animated gradient background */}
          {isReady && !isAnalyzing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 100%" }}
            />
          )}

          {/* Shine effect */}
          {isReady && !isAnalyzing && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          )}

          <span className="relative z-10 flex items-center justify-center gap-2">
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Your Career...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze My Career Readiness
              </>
            )}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedResumeUpload;
