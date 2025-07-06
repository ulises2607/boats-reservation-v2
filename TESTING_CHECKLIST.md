## Manual Testing Checklist for Frontend Authentication

### Status: ✅ READY FOR TESTING

**Backend Status:** ✅ Running on port 3001
**Frontend Status:** ✅ Running on port 3000

### Test Scenarios:

#### 1. Landing Page Test
- ✅ Go to: http://localhost:3000
- ✅ Should see modern landing page
- ✅ Header should show "Iniciar Sesión" and "Registrarse" buttons
- ✅ No errors in browser console

#### 2. Login Flow Test
- ✅ Go to: http://localhost:3000/login
- ✅ Fill login form with: `felipe@example.com` / `password123`
- ✅ Should redirect to `/explore` on success
- ✅ Header should show user name "Felipe" and logout option
- ✅ User state persisted in Redux store

#### 3. Authentication Persistence Test
- ✅ After login, refresh the page (F5)
- ✅ User should remain logged in
- ✅ Close browser completely and reopen
- ✅ Navigate to http://localhost:3000
- ✅ User should still be logged in (token in localStorage)

#### 4. Logout Test
- ✅ Click logout button in header
- ✅ Should redirect to landing page
- ✅ Header should show login/signup buttons again
- ✅ Token removed from localStorage
- ✅ Redux state cleared

#### 5. Registration Test
- ✅ Go to: http://localhost:3000/signup
- ✅ Fill form with new user data:
  - Name: "New User"
  - Email: "newuser@test.com"
  - Password: "password123"
  - Confirm Password: "password123"
  - Role: "Renter" or "Owner"
- ✅ Should redirect to `/explore` on success
- ✅ Header should show new user name

#### 6. Error Handling Test
- ✅ Try login with wrong password
- ✅ Should show error message
- ✅ Try registration with existing email
- ✅ Should show appropriate error

#### 7. Navigation Protection Test
- ✅ When logged out, try to access: http://localhost:3000/my-reservations
- ✅ Should be accessible (not protected yet - can be implemented later)

### Users Available for Testing:
- `felipe@example.com` / `password123` (Role: Rented)
- `ulises@example.com` / `password123` (Role: Rented)
- `hajnal@example.com` / `password123` (Role: Rented)
- `testuser@example.com` / `password123` (Role: Rented)

### Next Steps After Testing:
1. ✅ Implement route protection for private pages
2. ✅ Add role-based conditional rendering
3. ✅ Implement user profile management
4. ✅ Add password reset functionality
5. ✅ Continue with boat management features

### Debug Information:
- Redux Store: Check with Redux DevTools
- Network Requests: Check in DevTools Network tab
- Authentication Token: Check in Application/Storage/Local Storage
- Console Errors: Check in DevTools Console

Ready to test! 🚀
