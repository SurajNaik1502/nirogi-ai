export interface ReportAnalysis {
  summary: string;
  detailed_analysis: string;
}

export async function uploadAndAnalyzeReport(
  file: File,
  reportType: string,
  reportDate: string
): Promise<ReportAnalysis> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("report_type", reportType);
  formData.append("report_date", reportDate);
  // Replace with your backend URL
  const response = await fetch("http://localhost:8000/upload-report/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload and analyze report");
  }

  const data = await response.json();

  return {
    summary: data.summary,
    detailed_analysis: data.detailed_analysis,
  };
}
