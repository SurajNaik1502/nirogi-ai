import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import {
  FileText,
  CalendarIcon,
  PlusCircle,
  Trash2,
  FilePlus,
  Upload,
  Brain,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchMedicalReports,
  createMedicalReport,
  deleteMedicalReport,
  updateMedicalReport,
  MedicalReport,
} from "@/services/reportService";
// import { analyzeReportText, extractTextFromFile } from '@/services/reportAnalysisService';
import { uploadAndAnalyzeReport } from "@/services/reportAnalysisService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  report_type: z.string().min(1, "Report type is required"),
  report_date: z.date({
    required_error: "Report date is required",
  }),
  notes: z.string().optional(),
});

const ReportAnalyzer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      report_type: "",
      notes: "",
    },
  });

  const loadReports = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await fetchMedicalReports(user.id);
      if (data) {
        setReports(data as MedicalReport[]);
      }
    } catch (error) {
      console.error("Error loading medical reports:", error);
      toast({
        title: "Error",
        description: "Failed to load medical reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    try {
      let analysisResult = null;

      if (uploadedFile) {
        try {
          analysisResult = await uploadAndAnalyzeReport(
            uploadedFile,
            values.report_type,
            values.report_date.toISOString().split("T")[0]
          );
        } catch (error) {
          console.error("Error analyzing report:", error);
          toast({
            title: "Warning",
            description:
              "Report saved but analysis failed. You can analyze it later.",
            variant: "destructive",
          });
        }
      }

      const newReport = await createMedicalReport(user.id, {
        report_type: values.report_type,
        report_date: values.report_date.toISOString().split("T")[0],
        notes: values.notes || null,
        file_url: uploadedFile ? uploadedFile.name : null,
        analysis_result: analysisResult,
      });

      if (newReport) {
        setReports([newReport as MedicalReport, ...reports]);
        toast({
          title: "Success",
          description: analysisResult
            ? "Medical report added and analyzed successfully"
            : "Medical report added successfully",
        });
        setDialogOpen(false);
        form.reset();
        setUploadedFile(null);
      }
    } catch (error) {
      console.error("Error adding medical report:", error);
      toast({
        title: "Error",
        description: "Failed to add medical report",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeReport = async (report: MedicalReport) => {
    if (!report.file_url) {
      toast({
        title: "No file to analyze",
        description: "Please upload a report file first",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    try {
      // Call your backend: send reportType, reportDate & file
      const file = uploadedFile; // or fetch the actual file again if you have to

      if (!file) {
        toast({
          title: "File Missing",
          description: "No uploaded file found. Please re-upload.",
          variant: "destructive",
        });
        setAnalyzing(false);
        return;
      }

      const analysis = await uploadAndAnalyzeReport(
        file,
        report.report_type,
        report.report_date
      );

      // ✅ Directly update in-memory report
      const updatedReport = {
        ...report,
        analysis_result: {
          summary: analysis.summary,
          detailed_analysis: analysis.detailed_analysis,
        },
      };

      setReports(reports.map((r) => (r.id === report.id ? updatedReport : r)));
      setSelectedReport(updatedReport);

      toast({
        title: "Analysis Complete",
        description: "AI analysis has been generated for this report.",
      });
    } catch (error) {
      console.error("Error analyzing report:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    try {
      await deleteMedicalReport(id);
      setReports(reports.filter((report) => report.id !== id));
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
      toast({
        title: "Success",
        description: "Medical report deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting medical report:", error);
      toast({
        title: "Error",
        description: "Failed to delete medical report",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Report Analyzer
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload and analyze your medical reports
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medical Report</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={form.control}
                    name="report_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="blood-test">
                              Blood Test
                            </SelectItem>
                            <SelectItem value="x-ray">X-Ray</SelectItem>
                            <SelectItem value="mri">MRI</SelectItem>
                            <SelectItem value="ct-scan">CT Scan</SelectItem>
                            <SelectItem value="ultrasound">
                              Ultrasound
                            </SelectItem>
                            <SelectItem value="ecg">ECG</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="report_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Report Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="report-file">Upload Report</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="report-file"
                        type="file"
                        className="flex-1"
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedFile(file);
                            toast({
                              title: "File selected",
                              description: `${file.name} ready for analysis`,
                            });
                          }
                        }}
                      />
                    </div>
                    {uploadedFile && (
                      <p className="text-xs text-green-600">
                        Selected: {uploadedFile.name}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Upload PDF, JPG, PNG, or TXT files (max 10MB)
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    Add Report
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Your Reports</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="flex space-x-2">
                      <div
                        className="h-2 w-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No reports found</h3>
                    <p className="text-muted-foreground mt-2 mb-4">
                      Add your medical reports to analyze them
                    </p>
                    <Button
                      onClick={() => setDialogOpen(true)}
                      className="w-full"
                    >
                      <FilePlus className="mr-2 h-4 w-4" />
                      Add Your First Report
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${
                          selectedReport?.id === report.id ? "bg-white/5" : ""
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-health-blue" />
                              <h4 className="font-medium">
                                {report.report_type === "blood-test"
                                  ? "Blood Test"
                                  : report.report_type === "x-ray"
                                  ? "X-Ray"
                                  : report.report_type === "mri"
                                  ? "MRI"
                                  : report.report_type === "ct-scan"
                                  ? "CT Scan"
                                  : report.report_type === "ultrasound"
                                  ? "Ultrasound"
                                  : report.report_type === "ecg"
                                  ? "ECG"
                                  : "Other"}
                              </h4>
                            </div>

                            <div className="flex items-center gap-1 mt-1">
                              <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {format(
                                  parseISO(report.report_date),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReport(report.id);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedReport ? (
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>
                    {selectedReport.report_type === "blood-test"
                      ? "Blood Test Report"
                      : selectedReport.report_type === "x-ray"
                      ? "X-Ray Report"
                      : selectedReport.report_type === "mri"
                      ? "MRI Report"
                      : selectedReport.report_type === "ct-scan"
                      ? "CT Scan Report"
                      : selectedReport.report_type === "ultrasound"
                      ? "Ultrasound Report"
                      : selectedReport.report_type === "ecg"
                      ? "ECG Report"
                      : "Medical Report"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Report Date
                        </p>
                        <p className="font-medium">
                          {format(
                            parseISO(selectedReport.report_date),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Added On
                        </p>
                        <p className="font-medium">
                          {format(
                            parseISO(selectedReport.created_at),
                            "MMMM d, yyyy"
                          )}
                        </p>
                      </div>
                    </div>

                    {selectedReport.file_url ? (
                      <div className="border border-white/10 rounded-md p-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-health-blue" />
                          <span className="text-sm">View Report File</span>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-white/10 rounded-md p-4 text-center">
                        <p className="text-muted-foreground">
                          No report file uploaded
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="font-medium">Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedReport.notes ||
                          "No notes available for this report."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">AI Analysis</h3>
                        {!selectedReport.analysis_result && (
                          <Button
                            size="sm"
                            onClick={() => handleAnalyzeReport(selectedReport)}
                            disabled={analyzing}
                          >
                            {analyzing ? (
                              <>
                                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Brain className="mr-2 h-4 w-4" />
                                Analyze Report
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      {selectedReport.analysis_result ? (
                        <div className="space-y-4">
                          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-md">
                            <h4 className="font-medium text-blue-400 mb-2">
                              Summary
                            </h4>
                            <p className="text-sm">
                              {selectedReport.analysis_result.summary}
                            </p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-md">
                            <h4 className="font-medium mb-2">
                              Detailed Analysis
                            </h4>
                            <div className="text-sm whitespace-pre-wrap">
                              {selectedReport.analysis_result.detailed_analysis}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 p-4 rounded-md text-center">
                          <Brain className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-4">
                            No analysis available. Click "Analyze Report" to
                            generate AI insights.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-morphism h-full">
                <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium">No report selected</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Select a report from the list to view details or analyze it
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportAnalyzer;
