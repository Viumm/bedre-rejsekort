import type {
  RejseplanenApiRequest,
  RejseplanenApiResponse,
  RejseplanenStation,
  SimpleDeparture,
} from "./types";

const REJSEPLANEN_API_URL = "https://www.rejseplanen.dk/bin/iphone.exe";
const API_VERSION = "1.24";
const API_EXTENSION = "DK.11";
const API_AID = "j1sa92pcj72ksh0-web";

/**
 * Creates the base request object for Rejseplanen API
 */
function createBaseRequest(): Omit<RejseplanenApiRequest, "svcReqL"> {
  return {
    id: `req_${Date.now()}`,
    ver: API_VERSION,
    lang: "dan",
    auth: {
      type: "AID",
      aid: API_AID,
    },
    client: {
      id: "DK",
      type: "WEB",
      name: "rejseplanwebapp",
      l: "vs_webapp",
      v: "1.0.5",
    },
    formatted: false,
    ext: API_EXTENSION,
  };
}

/**
 * Makes a request to the Rejseplanen API
 */
async function makeRequest(
  svcReqL: RejseplanenApiRequest["svcReqL"]
): Promise<RejseplanenApiResponse> {
  const request: RejseplanenApiRequest = {
    ...createBaseRequest(),
    svcReqL,
  };

  const response = await fetch(REJSEPLANEN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Rejseplanen API error: ${response.status}`);
  }

  const data: RejseplanenApiResponse = await response.json();

  if (data.err !== "OK") {
    throw new Error(`Rejseplanen API error: ${data.errTxt || data.err}`);
  }

  return data;
}

/**
 * Parse Rejseplanen coordinates to lat/lng
 * Coordinates are stored as integers (multiply by 1000000)
 */
function parseCoordinates(x: number, y: number): { lat: number; lng: number } {
  return {
    lat: y / 1000000,
    lng: x / 1000000,
  };
}

/**
 * Search for stations by name
 * @param query - Search query (supports wildcards with ?)
 * @param maxResults - Maximum number of results (default: 10)
 */
export async function searchStations(
  query: string,
  maxResults: number = 10
): Promise<RejseplanenStation[]> {
  // Add wildcard if not present
  const searchQuery = query.endsWith("?") ? query : `${query}?`;

  const response = await makeRequest([
    {
      req: {
        input: {
          field: "S",
          loc: {
            name: searchQuery,
            type: "ALL",
            dist: 1000,
          },
          maxLoc: maxResults,
        },
      },
      meth: "LocMatch",
      id: "1|1|",
    },
  ]);

  const result = response.svcResL[0];
  if (result.err !== "OK" || !result.res.match?.locL) {
    return [];
  }

  return result.res.match.locL
    .filter((loc) => loc.type === "S") // Only stations
    .map((loc) => ({
      id: loc.extId,
      extId: loc.extId,
      name: loc.name,
      type: loc.type,
      coordinates: parseCoordinates(loc.crd.x, loc.crd.y),
      isMainStation: loc.isMainMast,
    }));
}

/**
 * Find stations near given coordinates
 * @param lat - Latitude
 * @param lng - Longitude
 * @param maxDistance - Maximum distance in meters (default: 1000)
 * @param maxResults - Maximum number of results (default: 10)
 */
export async function getNearbyStops(
  lat: number,
  lng: number,
  maxDistance: number = 1000,
  maxResults: number = 10
): Promise<RejseplanenStation[]> {
  // Convert to Rejseplanen format (multiply by 1000000)
  const x = Math.round(lng * 1000000);
  const y = Math.round(lat * 1000000);

  const response = await makeRequest([
    {
      req: {
        ring: {
          cCrd: { x, y },
          maxDist: maxDistance,
        },
        maxLoc: maxResults,
      },
      meth: "LocGeoPos",
      id: "1|2|",
    },
  ]);

  const result = response.svcResL[0];
  if (result.err !== "OK" || !result.res.locL) {
    return [];
  }

  return result.res.locL
    .filter((loc) => loc.type === "S") // Only stations
    .map((loc) => ({
      id: loc.extId,
      extId: loc.extId,
      name: loc.name,
      type: loc.type,
      coordinates: parseCoordinates(loc.crd.x, loc.crd.y),
      isMainStation: loc.isMainMast,
    }));
}

/**
 * Get departures from a station
 * @param stationId - Station external ID
 * @param maxDepartures - Maximum number of departures (default: 10)
 */
export async function getDepartures(
  stationId: string,
  maxDepartures: number = 10
): Promise<SimpleDeparture[]> {
  const response = await makeRequest([
    {
      req: {
        stbLoc: {
          lid: `A=1@L=${stationId}@`,
        },
        type: "DEP",
        maxJny: maxDepartures,
      },
      meth: "StationBoard",
      id: "1|3|",
    },
  ]);

  const result = response.svcResL[0];
  if (result.err !== "OK" || !result.res.jnyL || !result.res.common?.prodL) {
    return [];
  }

  const products = result.res.common.prodL;

  return result.res.jnyL.map((jny) => {
    const product = products[jny.prodX];
    const scheduledTime = jny.stbStop.dTimeS;
    const realTime = jny.stbStop.dTimeR;

    return {
      id: jny.jid,
      line: product?.name || "Unknown",
      direction: jny.dirTxt,
      scheduledTime: formatTime(scheduledTime),
      realTime: realTime ? formatTime(realTime) : undefined,
      platform: jny.stbStop.dPltfR?.txt || jny.stbStop.dPltfS?.txt,
      isDelayed: realTime !== undefined && realTime !== scheduledTime,
    };
  });
}

/**
 * Format time from HHMMSS to HH:MM
 */
function formatTime(time: string): string {
  if (time.length < 4) return time;
  return `${time.slice(0, 2)}:${time.slice(2, 4)}`;
}

