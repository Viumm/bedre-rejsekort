/**
 * Rejseplanen API Types
 * Based on the HaCon HAFAS API used by Rejseplanen.dk
 */

export interface RejseplanenLocation {
  /** Location identifier string */
  lid: string;
  /** Location type: S = Station, A = Address, P = POI */
  type: "S" | "A" | "P";
  /** Display name */
  name: string;
  /** External ID (station ID) */
  extId: string;
  /** Coordinates */
  crd: {
    /** Longitude * 1000000 */
    x: number;
    /** Latitude * 1000000 */
    y: number;
  };
  /** Product class bitmask */
  pCls?: number;
  /** Is main mast (main station) */
  isMainMast?: boolean;
  /** Meta station (represents multiple platforms) */
  meta?: boolean;
  /** Weight/relevance score */
  wt?: number;
}

export interface RejseplanenProduct {
  /** Product ID */
  pid?: string;
  /** Full name (e.g., "Bus 2A") */
  name: string;
  /** Short name (e.g., "2A") */
  nameS?: string;
  /** Line number */
  number?: string;
  /** Icon index */
  icoX: number;
  /** Class bitmask */
  cls: number;
  /** Product context with additional details */
  prodCtx?: {
    name: string;
    line: string;
    lineId: string;
    catOut: string;
    catOutS: string;
    catOutL: string;
    catIn: string;
    catCode: string;
  };
}

export interface RejseplanenDeparture {
  /** Journey ID */
  jid: string;
  /** Date in YYYYMMDD format */
  date: string;
  /** Product index in prodL array */
  prodX: number;
  /** Direction text */
  dirTxt: string;
  /** Status: P = Planned */
  status: string;
  /** Stop details */
  stbStop: {
    /** Scheduled departure time (HHMMSS) */
    dTimeS: string;
    /** Real-time departure time (HHMMSS) */
    dTimeR?: string;
    /** Platform scheduled */
    dPltfS?: {
      type: string;
      txt: string;
    };
    /** Platform real-time */
    dPltfR?: {
      type: string;
      txt: string;
    };
  };
}

export interface RejseplanenApiRequest {
  id: string;
  ver: string;
  lang: string;
  auth: {
    type: string;
    aid: string;
  };
  client: {
    id: string;
    type: string;
    name: string;
    l: string;
    v: string;
  };
  formatted: boolean;
  ext: string;
  svcReqL: Array<{
    req: Record<string, unknown>;
    meth: string;
    id: string;
  }>;
}

export interface RejseplanenApiResponse {
  ver: string;
  ext: string;
  lang: string;
  id: string;
  err: string;
  errTxt?: string;
  svcResL: Array<{
    id: string;
    meth: string;
    err: string;
    res: {
      common?: {
        locL: RejseplanenLocation[];
        prodL: RejseplanenProduct[];
      };
      match?: {
        locL: RejseplanenLocation[];
      };
      locL?: RejseplanenLocation[];
      jnyL?: RejseplanenDeparture[];
    };
  }>;
}

/** Simplified station type for app use */
export interface RejseplanenStation {
  id: string;
  extId: string;
  name: string;
  type: "S" | "A" | "P";
  coordinates: {
    lat: number;
    lng: number;
  };
  isMainStation?: boolean;
}

/** Simplified departure type for app use */
export interface SimpleDeparture {
  id: string;
  line: string;
  direction: string;
  scheduledTime: string;
  realTime?: string;
  platform?: string;
  isDelayed: boolean;
}

