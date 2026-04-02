const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export async function apiRequest<T>(
  path: string,
  options: RequestInit,
): Promise<Result<T>> {
  if (!API_URL) {
    console.error("API_URL is not set");
    return { success: false, error: new Error("API_URL is not set") };
  }
  if (!path || !path.startsWith("/")) {
    console.error("Invalid path");
    return { success: false, error: new Error("Invalid path") };
  }
  try {
    const response = await fetch(`${API_URL}${path}`, options);
    if (!response.ok) {
      return {
        success: false,
        error: new Error(`HTTP error! status: ${response.status}`),
      };
    }
    const responseData = await response.json();
    return { success: true, value: responseData };
  } catch (error) {
    console.error("An error occurred:", error);
    return { success: false, error: new Error("An error occurred") };
  }
}
