export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    thumbnail?: string;
    headline?: string;
    body?: string;
  };
}

export interface GuardianResponse {
  response: {
    status?: string;
    userTier?: string;
    total: number;
    startIndex: number;
    pageSize: number;
    currentPage: number;
    pages: number;
    orderBy?: string;
    results: GuardianArticle[];
  };
}
