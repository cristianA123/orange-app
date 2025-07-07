export interface IRpcError {
  statusCode?: number;
  status?: number;
  code?: string | number;
  message?: string;
  error?: string;
  response?: {
    status?: number;
    message?: string;
  };
  service?: string;
  source?: string;
  errors?: Array<{
    property: string;
    constraints: Record<string, string>;
  }>;
  name?: string;
  meta?: {
    target?: string[];
  };
}
