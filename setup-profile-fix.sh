#!/bin/bash

# Profile Creation Fix - Quick Setup Script
# This script helps you apply the database migration

echo "========================================="
echo "Profile Creation Fix - Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Opening Supabase SQL Editor${NC}"
echo ""
echo "Your Supabase Project URL: https://rqrmvdgellkyjahdscjb.supabase.co"
echo "Dashboard: https://supabase.com/dashboard/project/rqrmvdgellkyjahdscjb"
echo ""
echo "Opening SQL Editor in your browser..."
open "https://supabase.com/dashboard/project/rqrmvdgellkyjahdscjb/sql/new"

echo ""
echo -e "${YELLOW}Step 2: Copy the migration SQL${NC}"
echo ""
echo "The migration file is located at:"
echo "  supabase/migrations/add_profile_trigger.sql"
echo ""
echo "Copying to clipboard..."
cat supabase/migrations/add_profile_trigger.sql | pbcopy
echo -e "${GREEN}✓ Migration SQL copied to clipboard!${NC}"

echo ""
echo -e "${YELLOW}Step 3: Execute in Supabase${NC}"
echo ""
echo "1. Paste the SQL (Cmd+V) into the SQL Editor"
echo "2. Click 'Run' to execute the migration"
echo "3. You should see: 'Success. No rows returned'"
echo ""

echo -e "${YELLOW}Step 4: Verify the trigger${NC}"
echo ""
echo "Run this verification query in the SQL Editor:"
echo ""
echo "SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';"
echo ""
echo "Expected result: One row showing 'handle_new_user'"
echo ""

echo -e "${YELLOW}Step 5: Test signup${NC}"
echo ""
echo "1. Go to http://localhost:3000/sign-up"
echo "2. Create a new test account"
echo "3. Check the profiles table in Supabase"
echo ""

echo "========================================="
echo -e "${GREEN}Setup instructions displayed!${NC}"
echo "========================================="
