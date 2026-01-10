/**
 * Response Mapper Utility
 * Converts BE response (snake_case) to FE model (camelCase)
 * Implements Clean Code & SOLID Principle (Single Responsibility)
 */

export interface BeApiResponse {
  error_schema: {
    error_code: string;
    error_message: {
      english: string;
      indonesian: string;
    };
  };
  output_schema: Record<string, any>;
}

export interface EventDetails {
  date: string;
  location: string;
  address: string;
  mapUrl: string;
}

export interface MappedInvitationData {
  slug: string;
  coupleName: string;
  groomName: string;
  groomPhotoUrl: string;
  brideName: string;
  bridePhotoUrl: string;
  youtubeUrl: string;
  gallery: string[];
  eventDetails: EventDetails;
  theme: string; // Theme from BE API
}

/**
 * Converts snake_case string to camelCase
 * @param snakeStr - String in snake_case format
 * @returns String in camelCase format
 */
export function snakeToCamel(snakeStr: string): string {
  return snakeStr.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Recursively converts all keys in an object from snake_case to camelCase
 * @param obj - Object with snake_case keys
 * @returns New object with camelCase keys
 */
export function convertKeysToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamel(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = snakeToCamel(key);
        result[camelKey] = convertKeysToCamel(obj[key]);
      }
    }
    return result;
  }

  return obj;
}

/**
 * Maps BE API response to FE InvitationData model
 * @param response - Raw response from BE API
 * @returns Mapped invitation data ready for FE consumption
 * @throws Error if response structure is invalid
 */
export function mapBeResponseToInvitation(
  response: BeApiResponse
): MappedInvitationData {
  if (!response?.output_schema) {
    throw new Error('Invalid API response: missing output_schema');
  }

  // Convert snake_case keys to camelCase
  const camelData = convertKeysToCamel(response.output_schema);

  // Map to MappedInvitationData interface
  const mappedData: MappedInvitationData = {
    slug: camelData.slug,
    coupleName: camelData.coupleName,
    groomName: camelData.groomName,
    groomPhotoUrl: camelData.groomPhotoUrl,
    brideName: camelData.brideName,
    bridePhotoUrl: camelData.bridePhotoUrl,
    youtubeUrl: camelData.youtubeUrl,
    gallery: camelData.gallery || [],
    eventDetails: {
      date: camelData.eventDetails?.date,
      location: camelData.eventDetails?.location,
      address: camelData.eventDetails?.address,
      mapUrl: camelData.eventDetails?.mapUrl,
    },
    theme: camelData.theme, // Theme from BE response
  };

  return mappedData;
}

/**
 * Checks if API response indicates success
 * @param response - Raw response from BE API
 * @returns true if error_code indicates success (ART-00-000)
 */
export function isApiSuccess(response: BeApiResponse): boolean {
  return response?.error_schema?.error_code === 'ART-00-000';
}
