#!/usr/bin/env bash

# Script para probar la API de autenticación

API_BASE="http://localhost:3001"

echo "=== Testing Authentication API ==="
echo ""

# Test 1: Registrar un nuevo usuario
echo "1. Testing user registration..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_BASE/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "Test User",
      "email": "testuser@example.com",
      "password": "password123",
      "password_confirmation": "password123",
      "role": "rented"
    }
  }')

echo "Signup Response: $SIGNUP_RESPONSE"
echo ""

# Test 2: Login
echo "2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/login" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "email": "testuser@example.com",
      "password": "password123"
    }
  }')

echo "Login Response: $LOGIN_RESPONSE"
echo ""

# Extraer el token del response (básico, asumiendo formato JSON)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Extracted Token: $TOKEN"
echo ""

# Test 3: Acceder a current_user con token
if [ ! -z "$TOKEN" ]; then
  echo "3. Testing current_user with token..."
  CURRENT_USER_RESPONSE=$(curl -s -X GET "$API_BASE/api/v1/current_user" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
  
  echo "Current User Response: $CURRENT_USER_RESPONSE"
  echo ""
fi

# Test 4: Acceder a boats sin autenticación
echo "4. Testing boats endpoint without authentication..."
BOATS_RESPONSE=$(curl -s -X GET "$API_BASE/api/v1/boats?page=1&per_page=3" \
  -H "Content-Type: application/json")

echo "Boats Response (first 200 chars): ${BOATS_RESPONSE:0:200}..."
echo ""

echo "=== Testing completed ==="
