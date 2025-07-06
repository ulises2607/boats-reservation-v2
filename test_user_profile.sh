#!/usr/bin/env bash

# Script para probar la gestión de perfil de usuario

echo "=== TESTING USER PROFILE MANAGEMENT ==="
echo ""

echo "✅ Features Implemented:"
echo ""

echo "🔧 Backend Features:"
echo "   - GET /api/v1/users/:id - View user profile"
echo "   - PUT /api/v1/users/:id - Update user profile"
echo "   - DELETE /api/v1/users/:id - Delete user account"
echo "   - Access control: Own profile or admin only"
echo "   - Role update restriction: Admin only"
echo ""

echo "🎨 Frontend Features:"
echo "   - User Profile page with view/edit modes"
echo "   - Form validation for name and email"
echo "   - Redux integration for state management"
echo "   - Success/error feedback"
echo "   - Role display and conditional editing"
echo "   - Protected route (/profile - requires auth)"
echo ""

echo "🚀 Navigation Integration:"
echo "   - 'My Profile' link added to Header navigation"
echo "   - Accessible to all authenticated users"
echo "   - Responsive design"
echo ""

echo "🧪 Manual Testing Steps:"
echo ""

echo "STEP 1: Test Profile Access"
echo "   1. Login as any user (felipe@example.com / password123)"
echo "   2. Click 'My Profile' in navigation"
echo "   3. Should show user profile in view mode"
echo "   4. Verify user information display"
echo ""

echo "STEP 2: Test Profile Editing"
echo "   1. Click 'Edit Profile' button"
echo "   2. Form should populate with current data"
echo "   3. Try updating name and email"
echo "   4. Click 'Save Changes'"
echo "   5. Should show success message and update display"
echo ""

echo "STEP 3: Test Form Validation"
echo "   1. Enter edit mode"
echo "   2. Clear name field - should show error"
echo "   3. Enter invalid email - should show error"
echo "   4. Click 'Cancel' - should reset form"
echo ""

echo "STEP 4: Test Role Management (Admin Only)"
echo "   1. Login as admin (admin@test.com / password123)"
echo "   2. Go to profile"
echo "   3. Edit mode should show role dropdown"
echo "   4. Can change role between renter/owner/admin"
echo ""

echo "STEP 5: Test Different User Roles"
echo "   - Renter: felipe@example.com / password123"
echo "   - Owner: marina@test.com / password123"
echo "   - Admin: admin@test.com / password123"
echo ""

echo "🔍 Backend API Testing:"
echo ""

echo "Testing user profile endpoints..."

# Get a fresh token for testing
echo "Logging in to get fresh token..."
login_response=$(curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"felipe@example.com","password":"password123"}}')

if echo "$login_response" | grep -q '"code":200'; then
  token=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  user_id=$(echo "$login_response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  
  echo "✅ Login successful - User ID: $user_id"
  
  # Test GET profile
  echo "Testing GET profile..."
  get_response=$(curl -s -X GET "http://localhost:3001/api/v1/users/$user_id" \
    -H "Authorization: Bearer $token")
  
  if echo "$get_response" | grep -q '"code":200'; then
    echo "✅ GET profile endpoint working"
    current_name=$(echo "$get_response" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "   Current name: $current_name"
  else
    echo "❌ GET profile endpoint failed"
  fi
  
  # Test PUT profile
  echo "Testing PUT profile..."
  put_response=$(curl -s -X PUT "http://localhost:3001/api/v1/users/$user_id" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -d '{"user":{"name":"Felipe Profile Test"}}')
  
  if echo "$put_response" | grep -q '"code":200'; then
    echo "✅ PUT profile endpoint working"
    updated_name=$(echo "$put_response" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "   Updated name: $updated_name"
  else
    echo "❌ PUT profile endpoint failed"
  fi
  
else
  echo "❌ Login failed - cannot test endpoints"
fi

echo ""
echo "🎯 Expected Behaviors:"
echo "   ✅ Profile viewing and editing functionality"
echo "   ✅ Form validation and error handling"
echo "   ✅ Success feedback on updates"
echo "   ✅ Role-based features (admin role editing)"
echo "   ✅ Responsive and user-friendly interface"
echo ""

echo "🚀 Ready to test user profile management!"
echo "   Frontend: http://localhost:3000/profile"
