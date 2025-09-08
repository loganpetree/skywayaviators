export interface PageView {
  pagePath: string;
  timestamp: Date;
  date: string; // YYYY-MM-DD format
  viewerType: 'anonymous' | 'authenticated';
  userAgent?: string;
  referrer?: string | null;
  ip?: string;
  pageType?: string;
  source?: string;
  userId?: string;
  sessionId?: string;
}

export interface PageViewAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  viewsByPage: Record<string, number>;
  viewsByDate: Record<string, number>;
  topPages: Array<{
    pagePath: string;
    views: number;
  }>;
  lastUpdated: Date;
}

export interface AnalyticsCounter {
  count: number;
  lastUpdated: Date;
  createdAt: Date;
}
