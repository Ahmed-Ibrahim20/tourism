/**
 * Central API Service Facade - SOLID Principles & Design Patterns
 * Clean Architecture access point for all application services.
 */

import { API_CONFIG, getApiBaseUrl } from './config';
import { httpClient } from './httpClient';
import { authService } from './modules/authService';
import { adminDashboardService } from './modules/adminDashboardService';
import { adminCategoriesService, publicCategoriesService } from './modules/categoriesService';
import { adminDestinationsService, publicDestinationsService } from './modules/destinationsService';
import { adminPackagesService, publicPackagesService } from './modules/packagesService';
import { adminServicesService, publicServicesService } from './modules/servicesService';
import { adminUsersService } from './modules/usersService';
import { bookingsService, quotesService } from './modules/bookingsAndQuotesService';
import { adminMediaService } from './modules/mediaService';

export const apiService = {
  config: API_CONFIG,
  getBaseUrl: getApiBaseUrl,
  client: httpClient,
  
  // Modules
  auth: authService,
  
  // Admin Domain
  admin: {
    dashboard: adminDashboardService,
    categories: adminCategoriesService,
    destinations: adminDestinationsService,
    services: adminServicesService,
    packages: adminPackagesService,
    bookings: bookingsService,
    quotes: quotesService,
    users: adminUsersService,
    media: adminMediaService,
  },
  
  // Public Domain
  public: {
    categories: publicCategoriesService,
    destinations: publicDestinationsService,
    packages: publicPackagesService,
    services: publicServicesService,
    bookings: bookingsService,
    quotes: quotesService,
  },
};

export default apiService;

// Export types
export * from './config';
export * from './types/common';
export * from './types/models';
export * from './modules/authService';
export * from './modules/adminDashboardService';
export * from './modules/categoriesService';
export * from './modules/destinationsService';
export * from './modules/packagesService';
export * from './modules/servicesService';
export * from './modules/usersService';
export * from './modules/bookingsAndQuotesService';
