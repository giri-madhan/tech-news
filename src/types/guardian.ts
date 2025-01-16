export interface Article {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName: string;
  fields: {
    thumbnail?: string;
    trailText: string;
    body?: string;
  };
}

export interface GuardianResponse {
  response: {
    status: string;
    total: number;
    pages: number;
    results: Article[];
  };
}
