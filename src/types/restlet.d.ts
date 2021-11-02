export type RestletOptions = {
  script: number;
  deploy: number;
};

export type RestletMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RestletQuery = {
  params?: Record<string, any>;
  body?: Record<string, any>;
};
