import type { City } from "@/types/clock";

// Curated list of major world cities with their timezones and flags
export const CITY_DATABASE: Omit<City, "id">[] = [
    // Americas
    { name: "New York", timezone: "America/New_York", country: "US", flag: "🇺🇸" },
    { name: "Los Angeles", timezone: "America/Los_Angeles", country: "US", flag: "🇺🇸" },
    { name: "Chicago", timezone: "America/Chicago", country: "US", flag: "🇺🇸" },
    { name: "San Francisco", timezone: "America/Los_Angeles", country: "US", flag: "🇺🇸" },
    { name: "Seattle", timezone: "America/Los_Angeles", country: "US", flag: "🇺🇸" },
    { name: "Miami", timezone: "America/New_York", country: "US", flag: "🇺🇸" },
    { name: "Denver", timezone: "America/Denver", country: "US", flag: "🇺🇸" },
    { name: "Toronto", timezone: "America/Toronto", country: "CA", flag: "🇨🇦" },
    { name: "Vancouver", timezone: "America/Vancouver", country: "CA", flag: "🇨🇦" },
    { name: "Mexico City", timezone: "America/Mexico_City", country: "MX", flag: "🇲🇽" },
    { name: "São Paulo", timezone: "America/Sao_Paulo", country: "BR", flag: "🇧🇷" },
    { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", country: "AR", flag: "🇦🇷" },

    // Europe
    { name: "London", timezone: "Europe/London", country: "GB", flag: "🇬🇧" },
    { name: "Paris", timezone: "Europe/Paris", country: "FR", flag: "🇫🇷" },
    { name: "Berlin", timezone: "Europe/Berlin", country: "DE", flag: "🇩🇪" },
    { name: "Amsterdam", timezone: "Europe/Amsterdam", country: "NL", flag: "🇳🇱" },
    { name: "Madrid", timezone: "Europe/Madrid", country: "ES", flag: "🇪🇸" },
    { name: "Rome", timezone: "Europe/Rome", country: "IT", flag: "🇮🇹" },
    { name: "Zurich", timezone: "Europe/Zurich", country: "CH", flag: "🇨🇭" },
    { name: "Stockholm", timezone: "Europe/Stockholm", country: "SE", flag: "🇸🇪" },
    { name: "Moscow", timezone: "Europe/Moscow", country: "RU", flag: "🇷🇺" },
    { name: "Istanbul", timezone: "Europe/Istanbul", country: "TR", flag: "🇹🇷" },

    // Asia
    { name: "Tokyo", timezone: "Asia/Tokyo", country: "JP", flag: "🇯🇵" },
    { name: "Shanghai", timezone: "Asia/Shanghai", country: "CN", flag: "🇨🇳" },
    { name: "Beijing", timezone: "Asia/Shanghai", country: "CN", flag: "🇨🇳" },
    { name: "Hong Kong", timezone: "Asia/Hong_Kong", country: "HK", flag: "🇭🇰" },
    { name: "Singapore", timezone: "Asia/Singapore", country: "SG", flag: "🇸🇬" },
    { name: "Seoul", timezone: "Asia/Seoul", country: "KR", flag: "🇰🇷" },
    { name: "Mumbai", timezone: "Asia/Kolkata", country: "IN", flag: "🇮🇳" },
    { name: "Bangalore", timezone: "Asia/Kolkata", country: "IN", flag: "🇮🇳" },
    { name: "Delhi", timezone: "Asia/Kolkata", country: "IN", flag: "🇮🇳" },
    { name: "Dubai", timezone: "Asia/Dubai", country: "AE", flag: "🇦🇪" },
    { name: "Tel Aviv", timezone: "Asia/Jerusalem", country: "IL", flag: "🇮🇱" },
    { name: "Bangkok", timezone: "Asia/Bangkok", country: "TH", flag: "🇹🇭" },
    { name: "Jakarta", timezone: "Asia/Jakarta", country: "ID", flag: "🇮🇩" },
    { name: "Manila", timezone: "Asia/Manila", country: "PH", flag: "🇵🇭" },
    { name: "Taipei", timezone: "Asia/Taipei", country: "TW", flag: "🇹🇼" },

    // Oceania
    { name: "Sydney", timezone: "Australia/Sydney", country: "AU", flag: "🇦🇺" },
    { name: "Melbourne", timezone: "Australia/Melbourne", country: "AU", flag: "🇦🇺" },
    { name: "Auckland", timezone: "Pacific/Auckland", country: "NZ", flag: "🇳🇿" },

    // Africa
    { name: "Cairo", timezone: "Africa/Cairo", country: "EG", flag: "🇪🇬" },
    { name: "Johannesburg", timezone: "Africa/Johannesburg", country: "ZA", flag: "🇿🇦" },
    { name: "Lagos", timezone: "Africa/Lagos", country: "NG", flag: "🇳🇬" },
    { name: "Nairobi", timezone: "Africa/Nairobi", country: "KE", flag: "🇰🇪" },
];

// Aliases for fuzzy search
export const CITY_ALIASES: Record<string, string> = {
    "nyc": "New York",
    "la": "Los Angeles",
    "sf": "San Francisco",
    "blr": "Bangalore",
    "bom": "Mumbai",
    "del": "Delhi",
    "hk": "Hong Kong",
    "uk": "London",
    "sp": "São Paulo",
    "ba": "Buenos Aires",
};

// Search function with fuzzy matching
export function searchCities(query: string): Omit<City, "id">[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return CITY_DATABASE.slice(0, 10);

    // Check aliases first
    const aliasMatch = CITY_ALIASES[normalizedQuery];
    if (aliasMatch) {
        const city = CITY_DATABASE.find(c => c.name === aliasMatch);
        if (city) return [city];
    }

    // Filter cities by name or country
    return CITY_DATABASE.filter(city =>
        city.name.toLowerCase().includes(normalizedQuery) ||
        city.country.toLowerCase().includes(normalizedQuery)
    ).slice(0, 10);
}

// Generate unique ID for a city
export function generateCityId(name: string): string {
    return `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
}
