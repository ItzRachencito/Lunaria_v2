# Lunaria - Feature Comparison: Web vs Mobile

## Overview

This document compares the features between the web application (`04_frontend_web/lunaria-frontend-react`) and the mobile application (`05_frontend_mobile/lunaria-mobile`) to identify gaps that need to be implemented in the mobile version.

---

## Current Feature Comparison

### Authentication Features

| Feature | Web | Mobile | Status |
|---------|-----|--------|--------|
| Login | ✅ Complete | ✅ Complete | ✅ OK |
| Register | ✅ Complete | ✅ Complete | ✅ OK |
| Forgot Password | ✅ Complete | ❌ Missing | 🔴 HIGH PRIORITY |
| Reset Password | ✅ Complete | ❌ Missing | 🔴 HIGH PRIORITY |

### User Features (Regular Users)

| Feature | Web | Mobile | Status |
|---------|-----|--------|--------|
| Dashboard | ✅ Complete | ✅ Complete | ✅ OK |
| Explore/Browse Items | ✅ Complete | ✅ Complete | ✅ OK |
| Favorites | ✅ Complete (13KB) | ❌ Placeholder only (750 bytes) | 🔴 HIGH PRIORITY |
| Profile | N/A | ✅ Complete | ✅ OK |

### Admin Features

| Feature | Web | Mobile | Status |
|---------|-----|--------|--------|
| Manage Items (CRUD) | ✅ Complete | ✅ Complete | ✅ OK |
| Manage Brands (CRUD) | ✅ Complete | ✅ Complete | ✅ OK |
| Manage Categories (CRUD) | ✅ Complete | ✅ Complete | ✅ OK |
| Manage Stock | ✅ Complete (8KB) | ❌ Placeholder only | 🔴 HIGH PRIORITY |
| Manage Users | ✅ Complete | ❌ Placeholder only | 🟡 MEDIUM PRIORITY |
| Sale History | ✅ Complete | ✅ Complete | ✅ OK |
| Dashboard Statistics | ✅ Complete | ⚠️ Basic | 🟡 MEDIUM PRIORITY |

---

## Detailed Gap Analysis

### 1. Password Recovery Flow (HIGH PRIORITY)

**Web Implementation:**
- `/forgot-password` - Form to enter email and request OTP
- `/reset-password` - Form to enter OTP and new password

**Mobile Status:**
- No screens exist for password recovery
- API services `authApi.ts` exists but lacks password reset endpoints

**Required Implementation:**
- Create `ForgotPasswordScreen.tsx`
- Create `ResetPasswordScreen.tsx`
- Add navigation routes in `AuthNavigator.tsx`
- Implement password reset API calls

---

### 2. Favorites Feature (HIGH PRIORITY)

**Web Implementation (Favorites.jsx - 13KB):**
- Display list of favorited items
- Remove from favorites functionality
- View item details in modal
- Add to cart from favorites
- Add to favorites toggle

**Mobile Implementation (FavoritesScreen.tsx - 750 bytes):**
- Static placeholder with title and subtitle only

**Required Implementation:**
- Integrate with `favoritesApi.ts`
- Display favorited items list
- Implement remove from favorites
- Add item detail view
- Add to cart functionality

---

### 3. Stock Management (HIGH PRIORITY)

**Web Implementation (ManageStock.jsx - 8KB):**
- View stock levels per item
- Add stock (inventory increase)
- Remove stock (inventory decrease)
- Stock movement history
- Low stock alerts

**Mobile Implementation (ManageStockScreen.tsx - 1.3KB):**
- Static "Coming soon" placeholder

**Required Implementation:**
- Full CRUD for stock operations
- Stock movement tracking
- Stock history view
- Low stock notifications
- Add to navigation for admin users

---

### 4. User Management (MEDIUM PRIORITY)

**Web Implementation (ManageUsers.jsx):**
- View all users
- Create new users
- Edit user details
- Change user roles
- Deactivate/activate users

**Mobile Implementation (ManageUsersScreen.tsx):**
- Static "Coming soon" placeholder

**Required Implementation:**
- User list view
- User creation form
- User edit functionality
- Role management
- User activation/deactivation

**Note:** Mobile has the file but it's not added to navigation

---

### 5. Dashboard Statistics (MEDIUM PRIORITY)

**Web Dashboard:**
- Total sales count
- Total revenue
- Low stock items count
- Recent sales chart
- Top selling items

**Mobile Dashboard:**
- Basic welcome message
- Limited statistics

**Required Implementation:**
- Add sales statistics
- Add revenue metrics
- Add low stock alerts
- Add recent activity

---

## API Services Comparison

### Mobile API (`src/api/`)
- ✅ authApi.ts
- ✅ baseApi.ts
- ✅ brandsApi.ts
- ✅ categoriesApi.ts
- ✅ favoritesApi.ts
- ✅ itemsApi.ts
- ✅ salesApi.ts
- ❌ usersApi.ts (missing)
- ❌ stockApi.ts (missing)

---

## Navigation Structure

### Web Routes (App.jsx)
```
/dashboard      → Dashboard
/explore        → Explore
/favorites      → Favorites (protected, USER)
/category       → ManageCategory (protected, ADMIN)
/brand          → ManageBrand (protected, ADMIN)
/users          → ManageUsers (protected, ADMIN)
/items          → ManageItems (protected, ADMIN)
/stock          → ManageStock (protected, ADMIN)
/login          → Login
/register       → Register
/forgot-password → ForgotPassword
/reset-password  → ResetPassword
/ventas          → SaleHistory (protected, ADMIN)
```

### Mobile Navigation

**Auth Stack:**
- Login
- Register

**User Tabs (Regular User):**
- Dashboard
- Explore
- Favorites
- Profile

**Admin Tabs:**
- Dashboard
- ManageItems
- ManageBrands
- ManageCategories
- SaleHistory
- ❌ ManageUsers (exists but not in nav)
- ❌ ManageStock (exists but not in nav)

---

## Recommended Implementation Priority

1. **Phase 1 - Critical (Auth & Core)**
   - ForgotPassword screen
   - ResetPassword screen
   - Favorites full implementation
   - Stock Management full implementation

2. **Phase 2 - Important (Admin)**
   - User Management full implementation
   - Dashboard statistics enhancement

3. **Phase 3 - Nice to Have**
   - Additional UI/UX improvements to match web
   - Offline support
   - Push notifications

---

## Summary

The mobile application is missing significant functionality compared to the web version:

- **2 Auth screens** (password recovery)
- **2 Admin screens** (stock, users) - exist as placeholders
- **1 User screen** (favorites) - exists as placeholder
- **Navigation updates** needed to include missing admin screens

The mobile app currently has 8 API service files but is missing `usersApi.ts` and `stockApi.ts` which would be needed for full functionality.

---

*Generated: March 2026*