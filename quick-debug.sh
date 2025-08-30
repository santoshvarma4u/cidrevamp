#!/bin/bash

# Quick Production Debug for CID Authentication
# Usage: ./quick-debug.sh <YOUR_PRODUCTION_SERVER_IP_OR_URL>

if [ -z "$1" ]; then
    echo "Usage: $0 <PRODUCTION_SERVER_URL>"
    echo "Example: $0 http://192.168.1.100:5000"
    echo "Example: $0 https://cid-staging.tspolice.gov.in"
    exit 1
fi

PROD_URL="$1"

echo "=== Quick Production Debug ==="
echo "Testing: $PROD_URL"
echo ""

# Test 1: Basic API connectivity
echo "1. Testing API connectivity..."
RESPONSE=$(curl -s -w "%{http_code}" "$PROD_URL/api/auth/user")
HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

if [ "$HTTP_CODE" = "401" ]; then
    echo "✓ API working (returns 401 as expected)"
elif [ "$HTTP_CODE" = "200" ]; then
    echo "? Unexpected 200 response"
else
    echo "✗ API issue (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

# Test 2: Login endpoint response type
echo ""
echo "2. Testing login endpoint response format..."
LOGIN_RESPONSE=$(curl -s -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}' \
    "$PROD_URL/api/auth/login")

if echo "$LOGIN_RESPONSE" | grep -q "DOCTYPE html"; then
    echo "✗ PROBLEM FOUND: Login returns HTML instead of JSON"
    echo "This means Express routing is broken in production"
    echo ""
    echo "SOLUTION: Check your production server setup:"
    echo "1. Ensure API routes are registered before static file serving"
    echo "2. Check if reverse proxy is interfering with /api routes"
    echo "3. Verify Express app configuration matches development"
    exit 1
elif echo "$LOGIN_RESPONSE" | grep -q "CAPTCHA\|password\|username"; then
    echo "✓ Login endpoint returns JSON correctly"
    echo "Response: $LOGIN_RESPONSE"
else
    echo "? Unexpected login response:"
    echo "$LOGIN_RESPONSE"
fi

# Test 3: Get and test CAPTCHA
echo ""
echo "3. Testing CAPTCHA system..."
CAPTCHA_RESPONSE=$(curl -s "$PROD_URL/api/captcha")
CAPTCHA_ID=$(echo "$CAPTCHA_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CAPTCHA_ID" ]; then
    echo "✓ CAPTCHA system working"
    echo "CAPTCHA ID: $CAPTCHA_ID"
    
    # Save CAPTCHA for manual viewing
    echo "$CAPTCHA_RESPONSE" | grep -o '"svg":"[^"]*"' | cut -d'"' -f4 | sed 's/\\//g' > captcha_debug.svg
    echo "CAPTCHA saved to: captcha_debug.svg"
    
    echo ""
    echo "MANUAL TEST NEEDED:"
    echo "1. Open captcha_debug.svg in a browser to see the CAPTCHA text"
    echo "2. Run this command with the CAPTCHA text you see:"
    echo ""
    echo "curl -H 'Content-Type: application/json' \\"
    echo "  -d '{\"username\":\"admin\",\"password\":\"admin123\",\"captchaSessionId\":\"$CAPTCHA_ID\",\"captchaInput\":\"CAPTCHA_TEXT_HERE\"}' \\"
    echo "  '$PROD_URL/api/auth/login'"
    echo ""
    echo "Expected result: JSON with user data (successful login)"
    echo "If you get HTML instead, there's a routing issue in production"
    
else
    echo "✗ CAPTCHA system failed"
    echo "Response: $CAPTCHA_RESPONSE"
fi

echo ""
echo "=== SUMMARY ==="
echo "If login endpoint returns HTML instead of JSON:"
echo "  → Problem: Express routes not working in production"
echo "  → Check: API route registration order"
echo "  → Check: Reverse proxy configuration"
echo ""
echo "If CAPTCHA test works but login still fails:"
echo "  → Problem: Authentication logic or database"
echo "  → Check: Database connection and admin user"
echo "  → Check: Server logs for detailed errors"
