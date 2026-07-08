export interface CandidateExtent {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
}

export interface CandidateLocation {
    x: number;
    y: number;
}

export interface CandidateAttributes {
    [key: string]: any;
}

export interface CandidateItem {
    address: string;
    location: CandidateLocation;
    score: number;
    attributes: CandidateAttributes;
    extent: CandidateExtent;
}

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Suggestion { text: string, magicKey: string, isCollection: boolean }

export type Suggestions = {
    suggestions: Suggestion[]
}

export type Candidate = {
    spatialReference: SpatialReference;
    candidates: CandidateItem[];
}

export interface AddressAttributes {
    Match_addr: string
    LongLabel: string
    ShortLabel: string
    Addr_type: string
    Type: string
    PlaceName: string
    AddNum: string
    Address: string
    Block: string
    Sector: string
    Neighborhood: string
    District: string
    City: string
    MetroArea: string
    Subregion: string
    Region: string
    Territory: string
    Postal: string
    PostalExt: string
    CountryCode: string
    CntryName: string
    StrucType: string
    StrucDet: string
}

export interface AddressLocation {
    x: number
    y: number
    spatialReference: SpatialReference
}
export type Address = {
    address: AddressAttributes,
    location: AddressLocation
}
