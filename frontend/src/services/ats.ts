import { getApiBaseUrl } from "./apiClient.ts";

export interface AtsCheckResponse {
  score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  formatting_issues: string[];
  suggestions: string[];
}

export const checkAts = async (
  resumeFile: File,
  jobDescription: string,
  token?: string
): Promise<AtsCheckResponse> => {
  const formData = new FormData();
  formData.append("resume_file", resumeFile);
  formData.append("job_description", jobDescription);

  const baseUrl = getApiBaseUrl();
  const url = baseUrl.endsWith("/api/v1") ? `${baseUrl}/ats/ats-check` : `${baseUrl}/api/v1/ats/ats-check`;

  const finalToken = token || localStorage.getItem("access_token") || "";
  console.log("checkAts token parameter passed:", token);
  console.log("checkAts localStorage token:", localStorage.getItem("access_token"));
  console.log("checkAts finalToken used:", finalToken);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${finalToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || errorData.detail || "Failed to perform ATS check";
    throw new Error(message);
  }

  // If response is successful, extract the data if it is wrapped in the standard APIResponse envelope
  const responseData = await response.json();
  if (responseData && typeof responseData === "object" && "success" in responseData) {
    if (responseData.success) {
      return responseData.data;
    } else {
      throw new Error(responseData.error?.message || "Failed to perform ATS check");
    }
  }

  return responseData;
};
