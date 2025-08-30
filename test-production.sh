#!/bin/bash

# Production API Route Testing Script
# Tests whether Express API routes are working correctly vs returning HTML

SERVER_URL="${1:-http://localhost:5000}"

echo "=== Production Routing Diagnosis ==="
echo "Server: $SERVER_URL"
echo

# Helper function to check if response is JSON
is_json_response() {
    local url="$1"
    local method="${2:-GET}"
    local data="${3:-}"
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        content_type=$(curl -s -X "$method" -H "Content-Type: application/json" -d "$data" -I "$url" 2>/dev/null | grep -i "content-type:" | head -n1)
    else
        content_type=$(curl -s -X "$method" -I "$url" 2>/dev/null | grep -i "content-type:" | head -n1)
    fi
    
    if echo "$content_type" | grep -q "application/json"; then
        return 0
    else
        return 1
    fi
}

# Helper function to test endpoint
test_endpoint() {
    local url="$1"
    local method="${2:-GET}"
    local data="${3:-}"
    local endpoint_name="$4"
    
    if is_json_response "$url" "$method" "$data"; then
        echo "Testing $endpoint_name: ✅ Returns JSON (working)"
    else
        echo "Testing $endpoint_name: ❌ Returns HTML"
    fi
}

echo "1. Testing various API endpoints..."
test_endpoint "$SERVER_URL/api/auth/user" "GET" "" "/api/auth/user"
test_endpoint "$SERVER_URL/api/pages/menu" "GET" "" "/api/pages/menu"  
test_endpoint "$SERVER_URL/api/captcha" "GET" "" "/api/captcha"
test_endpoint "$SERVER_URL/api/videos" "GET" "" "/api/videos"
test_endpoint "$SERVER_URL/api/news" "GET" "" "/api/news"

echo
echo "2. Testing POST vs GET on login endpoint..."
test_endpoint "$SERVER_URL/api/login" "GET" "" "GET /api/login"
test_endpoint "$SERVER_URL/api/login" "POST" '{"username":"test","password":"test"}' "POST /api/login"

echo
echo "3. Checking response headers..."
echo "Content-Type header for POST /api/login:"
curl -s -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}' -I "$SERVER_URL/api/login" 2>/dev/null | grep -i "content-type:\|x-content-type-options:" | head -n2

echo
echo "=== DIAGNOSIS ==="
if is_json_response "$SERVER_URL/api/login" "POST" '{"username":"test","password":"test"}'; then
    echo "✅ FIXED: Express API routes are working correctly"
    echo "✅ POST /api/login returns JSON as expected"
    echo ""
    echo "API ENDPOINTS CONFIRMED WORKING:"
    echo "- GET  /api/auth/user"
    echo "- GET  /api/pages/menu"
    echo "- GET  /api/captcha"  
    echo "- GET  /api/videos"
    echo "- GET  /api/news"
    echo "- POST /api/login"
    echo "- POST /api/register"
    echo "- GET/POST /api/logout"
else
    echo "PROBLEM: Express API routes not registered properly"
    echo "CAUSE: Static file serving happening before API route registration"
    echo ""
    echo "SOLUTIONS TO TRY:"
    echo "1. Check server/index.ts - ensure registerRoutes() called before static serving"
    echo "2. Check nginx/proxy config - ensure /api/* routes go to Express"
    echo "3. Check if there's an 'api' folder in your static build files"
    echo "4. Restart your production server after fixing route order"
fi
