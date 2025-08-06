#!/bin/bash

echo "🚀 CO2e Portal Environment Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if file exists
file_exists() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 missing${NC}"
        return 1
    fi
}

# Function to create .env file
create_env_file() {
    local file_path=$1
    local template_path=$2
    
    if [ ! -f "$file_path" ]; then
        if [ -f "$template_path" ]; then
            cp "$template_path" "$file_path"
            echo -e "${GREEN}✅ Created $file_path from template${NC}"
        else
            echo -e "${RED}❌ Template $template_path not found${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  $file_path already exists${NC}"
    fi
}

echo -e "\n${BLUE}📁 Checking project structure...${NC}"
file_exists "package.json"
file_exists "Backend/package.json"

echo -e "\n${BLUE}🔧 Setting up environment files...${NC}"

# Frontend .env
create_env_file ".env" ".env.example"

# Backend .env
create_env_file "Backend/.env" "Backend/.env.example"

echo -e "\n${BLUE}📋 Checking .gitignore...${NC}"
if grep -q "\.env" .gitignore; then
    echo -e "${GREEN}✅ .env files are properly ignored in .gitignore${NC}"
else
    echo -e "${RED}❌ .env files not found in .gitignore${NC}"
fi

echo -e "\n${BLUE}📦 Installing dependencies...${NC}"

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd Backend
npm install
cd ..

echo -e "\n${BLUE}🔍 Environment files status:${NC}"
file_exists ".env"
file_exists "Backend/.env"

echo -e "\n${GREEN}🎉 Setup complete!${NC}"
echo -e "\n${YELLOW}📝 Next steps:${NC}"
echo "1. Edit .env files with your actual values"
echo "2. Start the backend: cd Backend && npm start"
echo "3. Start the frontend: npm start"
echo -e "\n${BLUE}📚 For more information, see ENV_SETUP.md${NC}"
