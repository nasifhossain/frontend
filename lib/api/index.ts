import { toast } from "@/hooks/use-toast";

// Base API configuration
const API_BASE_URL =
	process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.careq.in/api/v0";

// API request options
export interface RequestOptions extends RequestInit {
	requireAuth?: boolean;
	showErrorToast?: boolean;
	showSuccessToast?: boolean;
	successMessage?: string;
}





function getAuthToken(): string | null {
	//FROM LOCAL STORAGE
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

// Set token in localStorage
export function setToken(token: string): void {
	if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
}

// Clear token cache when token changes
export function clearTokenCache(): void {
	if (typeof window === "undefined") return;
    localStorage.removeItem("token");
}

// Main API request function
export async function apiRequest(
	endpoint: string,
	options: RequestOptions = {}
): Promise<any> {
	const {
		requireAuth = true,
		showErrorToast = true,
		showSuccessToast = false,
		successMessage,
		...fetchOptions
	} = options;

	// Add timeout to prevent hanging requests
	const timeoutMs = 30000; // 30 seconds
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		// Prepare headers
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...(fetchOptions.headers as Record<string, string>),
		};
		// Add authorization header if required
		if (requireAuth) {
			const token = getAuthToken();
			if (!token) {
				throw new Error("Authentication required");
			}
			headers["authorization"] = `Bearer ${token}`;
		}

		// Prepare request configuration
		const config: RequestInit = {
			...fetchOptions,
			headers,
			signal: controller.signal,
		};

		// Make the request
		const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
		
		// Clear timeout on successful response
		clearTimeout(timeoutId);

		// Handle non-JSON responses (like 204 No Content)
		let data: any;
		const contentType = response.headers.get("content-type");

		if (contentType && contentType.includes("application/json")) {
			data = await response.json();
			console.log("API Response:", data); // Log the response for debugging
		} else {
			// Handle empty responses or non-JSON responses
			data = {
				success: response.ok,
				message: response.ok ? "Request successful" : "Request failed",
			};
		}

		// Handle HTTP errors
		if (!response.ok) {
			console.error("API Error:", {
				status: response.status,
				statusText: response.statusText,
				data: data,
				endpoint: endpoint,
				method: options.method,
			});

			// Try to extract meaningful error message
			let errorMessage = "Request failed";
			if (data && typeof data === "object") {
				if (data.error) {
					errorMessage = data.error;
				} else if (data.message) {
					errorMessage = data.message;
				} else if (Object.keys(data).length > 0) {
					// If data is not empty but has no error/message, stringify it
					errorMessage = JSON.stringify(data);
				} else {
					errorMessage = `HTTP ${response.status}: ${response.statusText}`;
				}
			} else {
				errorMessage = `HTTP ${response.status}: ${response.statusText}`;
			}

			const error: any = {
				message: errorMessage,
				status: response.status,
				code: data?.error || data?.code,
				details: data,
			}; // Handle specific status codes
				if (response.status === 401) {
					// Clear token cache when unauthorized
					clearTokenCache();

					// Only perform a full-page redirect for endpoints that require auth.
					// For public endpoints (like login) we should not force a reload —
					// instead return a sensible error so the UI can show a toast.
					if (requireAuth) {
						// Unauthorized - redirect to login
						if (typeof window !== "undefined") {
							window.location.href = "/login?unauthorized=true";
						}
						throw new Error("Authentication expired. Please log in again.");
					}
					// If requireAuth is false (e.g. login endpoint), fall through and
					// allow the generic error handling below to surface an error
				}

			if (showErrorToast) {
				console.log("Showing error toast:", error.message);
				toast({
					variant: "destructive",
					title: "Error",
					description: error.message,
				});
			}

			throw error;
		}

		// Show success toast if requested
		if (showSuccessToast && successMessage) {
			toast({
				title: "Success",
				description: successMessage,
			});
		}

		// Return the data
		if (typeof data !== "undefined") {
			return data;
		} else {
			throw new Error("API response does not contain expected data.");
		}
	} catch (error) {
		// Clear timeout in case of error
		clearTimeout(timeoutId);
		
		// Handle network errors or other exceptions
		let errorMessage = (error as Error)?.message || "bs kuch error h";
		
		// Handle timeout errors
		if (error instanceof Error && error.name === 'AbortError') {
			errorMessage = "Request timed out. Please try again.";
		}

		if (showErrorToast && !errorMessage.includes("Authentication expired")) {
			toast({
				variant: "destructive",
				title: "Error",
				description: errorMessage,
			});
		}

		throw error;
	}
}

// Convenience methods for common HTTP verbs
export const api = {
	get: (endpoint: string, options?: Omit<RequestOptions, "method">) =>
		apiRequest(endpoint, { ...options, method: "GET" }),

	post: (
		endpoint: string,
		data?: any,
		options?: Omit<RequestOptions, "method" | "body">
	) =>
		apiRequest(endpoint, {
			...options,
			method: "POST",
			body: data ? JSON.stringify(data) : undefined,
		}),

	put: (
		endpoint: string,
		data?: any,
		options?: Omit<RequestOptions, "method" | "body">
	) =>
		apiRequest(endpoint, {
			...options,
			method: "PUT",
			body: data ? JSON.stringify(data) : undefined,
		}),

	patch: (
		endpoint: string,
		data?: any,
		options?: Omit<RequestOptions, "method" | "body">
	) =>
		apiRequest(endpoint, {
			...options,
			method: "PATCH",
			body: data ? JSON.stringify(data) : undefined,
		}),

	delete: (endpoint: string, options?: Omit<RequestOptions, "method">) =>
		apiRequest(endpoint, { ...options, method: "DELETE" }),
};
// Export helper functions (clearTokenCache and setWidgetAuthToken are already exported above)
