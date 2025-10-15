export interface CloudinaryUploadResponse {
	secure_url: string;
	public_id: string;
	version: number;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string;
	bytes: number;
	pages?: number;
}

export interface CloudinaryUploadOptions {
	folder?: string;
	public_id?: string;
	overwrite?: boolean;
	resource_type?: "image" | "video" | "raw" | "auto";
    transformation?: any[];
}

class CloudinaryService {
	private cloudName: string;
	private apiKey: string;
	private apiSecret: string;

	constructor() {
		this.cloudName = process.env.NEXT_PUBLIC_CLAUDINARY_CLOUD_NAME || "";
		this.apiKey = process.env.NEXT_PUBLIC_CLAUDINARY_API_KEY || "";
		this.apiSecret = process.env.NEXT_PUBLIC_CLAUDINARY_API_SECRET || "";

		if (!this.cloudName || !this.apiKey) {
			console.warn(
				"Cloudinary credentials are missing. Please check your environment variables."
			);
			console.warn(
				"Required: NEXT_PUBLIC_CLAUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLAUDINARY_API_KEY"
			);
		}
	}

	/**
	 * Generate a unique public ID for uploads
	 * @param prefix - Optional prefix for the public ID
	 * @returns A unique public ID string
	 */
	private generateUniquePublicId(prefix: string = "logo"): string {
		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 8);
		return `${prefix}_${timestamp}_${random}`;
	}
	/**
     * Generates a display URL for an asset, handling PDF-to-image conversion.
     * @param publicId The public ID of the asset.
     * @param format The format (e.g., 'jpg', 'pdf').
     * @param page Optional page number for PDFs.
     * @returns A string containing the full image URL for display.
     */
    generateDisplayUrl(publicId: string, format: string, page?: number): string {
        if (!this.cloudName) {
            console.error("Cloudinary cloud name is not configured.");
            return ""; // Return empty string if not configured
        }

        let transformations = "";
        let displayFormat = format;

        // If it's a PDF and a page is specified, add the page transformation
        // and set the display format to JPG.
        if (format === 'pdf' && page) {
            transformations = `pg_${page}/`;
            displayFormat = 'jpg';
        }

        return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformations}${publicId}.${displayFormat}`;
    }
	
	/**
	 * Upload a file to Cloudinary
	 * @param file - The file to upload
	 * @param options - Upload options
	 * @returns Promise with Cloudinary response
	 */
	async uploadFile(
		file: File,
		options: CloudinaryUploadOptions = {}
	): Promise<CloudinaryUploadResponse> {
		if (!this.cloudName || !this.apiKey || !this.apiSecret) {
			throw new Error("Cloudinary credentials are not configured");
		}

		// Validate file
		if (!file) {
			throw new Error("No file provided");
		}

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			throw new Error("File size must be less than 10MB");
		}

		// Validate file type for images
		const supportedFormats = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "application/pdf", // Allow PDFs
        ];

        if (!supportedFormats.includes(file.type)) {
            throw new Error("File type not supported. Please upload a JPG, PNG, or PDF.");
        }
        
        // Let Cloudinary auto-detect the resource type for flexibility
        const resourceType = "auto";

		try {
			// Create FormData for the upload
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "inter-iit"); // Use your actual preset name

			// Add optional parameters
			if (options.folder) {
				formData.append("folder", options.folder);
			}

			if (options.public_id) {
				formData.append("public_id", options.public_id);
			}

			// Note: overwrite parameter is not supported for unsigned uploads
			// Remove the overwrite parameter handling for unsigned uploads

			// For unsigned uploads, transformations are not supported via FormData
			// They need to be applied via URL parameters or after upload

			// Upload to Cloudinary with retry logic
			const uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`;

			let lastError: Error | null = null;
			const maxRetries = 3;

			for (let attempt = 1; attempt <= maxRetries; attempt++) {
				try {
					const response = await fetch(uploadUrl, {
						method: "POST",
						body: formData,
					});

					if (!response.ok) {
						const errorData = await response.json().catch(() => ({}));
						const errorMessage =
							errorData.error?.message ||
							`Upload failed with status: ${response.status}`;

						if (response.status >= 400 && response.status < 500) {
							// Client error - don't retry
							throw new Error(errorMessage);
						}

						throw new Error(errorMessage);
					}

					const result: CloudinaryUploadResponse = await response.json();
					return result;
				} catch (error) {
					lastError = error as Error;

					if (
						attempt < maxRetries &&
						(!error || (error as any).status >= 500)
					) {
						// Only retry for server errors or network issues
						console.warn(
							`Upload attempt ${attempt} failed, retrying...`,
							error
						);
						await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
						continue;
					}

					throw error;
				}
			}

			throw lastError || new Error("Upload failed after retries");
		} catch (error) {
			console.error("Cloudinary upload error:", error);

			if (error instanceof Error) {
				// Provide user-friendly error messages
				if (error.message.includes("Invalid signature")) {
					throw new Error(
						"Upload configuration error. Please contact support."
					);
				}
				if (error.message.includes("Invalid image file")) {
					throw new Error(
						"The selected file is not a valid image. Please choose a different file."
					);
				}
				if (error.message.includes("File size too large")) {
					throw new Error(
						"The image file is too large. Please choose a smaller file (max 10MB)."
					);
				}
				if (error.message.includes("Network")) {
					throw new Error(
						"Network error. Please check your internet connection and try again."
					);
				}

				throw error;
			}

			throw new Error("Failed to upload file to Cloudinary");
		}
	}

	/**
	 * Upload company logo with specific optimizations
	 * @param file - The logo file to upload
	 * @returns Promise with Cloudinary response
	 */
	async uploadCompanyLogo(file: File): Promise<CloudinaryUploadResponse> {
		try {
			// Generate a unique public ID for the logo
			const publicId = this.generateUniquePublicId("company_logo");

			// Upload without transformations first (unsigned uploads don't support transformations)
			const result = await this.uploadFile(file, {
				folder: "careq/company-logos",
				resource_type: "image",
				public_id: publicId,
				// Note: overwrite is not supported for unsigned uploads
			});

			// Return the original URL without transformations
			return result;
		} catch (error) {
			console.error("Company logo upload failed:", error);
			throw new Error(
				"Failed to upload company logo. Please check your internet connection and try again."
			);
		}
	}

	/**
	 * Upload post images with specific optimizations
	 * @param file - The image file to upload
	 * @returns Promise with Cloudinary response
	 */
	async uploadPostImage(file: File): Promise<CloudinaryUploadResponse> {
		try {
			// Generate a unique public ID for the post image
			const publicId = this.generateUniquePublicId("post_image");

			// Upload the image
			const result = await this.uploadFile(file, {
				folder: "inter-iit/posts",
				resource_type: "image",
				public_id: publicId,
			});

			return result;
		} catch (error) {
			console.error("Post image upload failed:", error);
			throw new Error(
				"Failed to upload image. Please check your internet connection and try again."
			);
		}
	}

	/**
	 * Upload user avatar with specific optimizations
	 * @param file - The avatar image file to upload
	 * @returns Promise with Cloudinary response
	 */
	async uploadUserAvatar(file: File): Promise<CloudinaryUploadResponse> {
		try {
			// Validate file type - only images for avatars
			const supportedFormats = [
				"image/jpeg",
				"image/jpg", 
				"image/png",
				"image/webp"
			];

			if (!supportedFormats.includes(file.type)) {
				throw new Error("Avatar must be a JPG, PNG, or WebP image.");
			}

			// Validate file size (max 5MB for avatars)
			const maxSize = 5 * 1024 * 1024; // 5MB
			if (file.size > maxSize) {
				throw new Error("Avatar file size must be less than 5MB");
			}

			// Generate a unique public ID for the avatar
			const publicId = this.generateUniquePublicId("user_avatar");

			// Upload the avatar
			const result = await this.uploadFile(file, {
				folder: "inter-iit/avatars",
				resource_type: "image",
				public_id: publicId,
			});

			return result;
		} catch (error) {
			console.error("Avatar upload failed:", error);
			throw new Error(
				"Failed to upload avatar. Please check your internet connection and try again."
			);
		}
	}

	/**
	 * Extract public ID from Cloudinary URL
	 * @param url - The Cloudinary URL
	 * @returns The public ID or null if invalid URL
	 */
	extractPublicIdFromUrl(url: string): string | null {
		try {
			if (!url.includes("cloudinary.com")) {
				return null;
			}

			// Extract public ID from URL
			// Example: https://res.cloudinary.com/demo/image/upload/v1234567/folder/sample.jpg
			const parts = url.split("/");
			const uploadIndex = parts.findIndex((part) => part === "upload");

			if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
				return null;
			}

			// Get the part after 'upload' and version (if exists)
			let publicIdPart = parts.slice(uploadIndex + 1).join("/");

			// Remove version if present (starts with 'v' followed by numbers)
			if (publicIdPart.startsWith("v") && /^v\d+\//.test(publicIdPart)) {
				publicIdPart = publicIdPart.substring(publicIdPart.indexOf("/") + 1);
			}

			// Remove file extension
			const lastDotIndex = publicIdPart.lastIndexOf(".");
			if (lastDotIndex > 0) {
				publicIdPart = publicIdPart.substring(0, lastDotIndex);
			}

			return publicIdPart;
		} catch (error) {
			console.warn("Failed to extract public ID from URL:", error);
			return null;
		}
	}

	/**
	 * Delete a file from Cloudinary
	 * @param publicId - The public ID of the file to delete
	 * @param resourceType - The type of resource to delete
	 * @returns Promise with deletion result
	 */
	async deleteFile(
		publicId: string,
		resourceType: "image" | "video" | "raw" = "image"
	): Promise<{ result: string }> {
		if (!this.cloudName || !this.apiKey || !this.apiSecret) {
			throw new Error("Cloudinary credentials are not configured");
		}

		try {
			// For deletion, we need to use the server-side API with signature
			// This should ideally be done through your backend API
			const timestamp = Math.round(new Date().getTime() / 1000);

			// Note: For security, the actual deletion should be implemented on the backend
			// This is a placeholder implementation
			console.warn(
				"File deletion should be implemented on the backend for security"
			);

			return { result: "ok" };
		} catch (error) {
			console.error("Cloudinary delete error:", error);
			throw new Error("Failed to delete file from Cloudinary");
		}
	}

	/**
	 * Generate a transformation URL
	 * @param publicId - The public ID of the file
	 * @param transformations - Array of transformation objects
	 * @returns Transformed image URL
	 */
	generateTransformationUrl(
		publicId: string,
		transformations: any[] = []
	): string {
		if (!this.cloudName) {
			throw new Error("Cloudinary cloud name is not configured");
		}

		const baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;

		if (transformations.length === 0) {
			return `${baseUrl}/${publicId}`;
		}

		const transformationString = transformations
			.map((t) =>
				Object.entries(t)
					.map(([k, v]) => `${k}_${v}`)
					.join(",")
			)
			.join("/");

		return `${baseUrl}/${transformationString}/${publicId}`;
	}
}

// Export singleton instance
export const cloudinaryService = new CloudinaryService();

// Export the class for testing or multiple instances
export { CloudinaryService };