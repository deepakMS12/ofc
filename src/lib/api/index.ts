// API Client
export { default as apiClient } from './client';
export { authApiClient } from './authApiClient';

// API Modules
export * from './auth';
export * from './dashboard';
export * from './devices';
export * from './message';
export * from './history';
export * from './account';
export * from './doc';
export * from './apiKey';
export * from './upload';

// Re-export API objects for convenience
export { authApi } from './auth';
export { dashboardApi } from './dashboard';
export { devicesApi } from './devices';
export { messageApi } from './message';
export { historyApi } from './history';
export { accountApi } from './account';
export { docApi } from './doc';
export { apiKeyApi } from './apiKey';
export { uploadApi } from './upload';

