#!/usr/bin/env node

/**
 * Configuration Setup and Validation Script
 * 
 * This script helps developers:
 * 1. Validate their current environment configuration
 * 2. Copy .env.example to .env if needed
 * 3. Provide clear setup instructions
 * 
 * Usage:
 *   node setup-config.js
 *   npm run setup-config  (if added to package.json scripts)
 */

import fs from 'fs';

const ENV_EXAMPLE_PATH = '.env.example';
const ENV_PATH = '.env';

// ANSI color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function copyEnvExample() {
  try {
    if (!checkFileExists(ENV_EXAMPLE_PATH)) {
      log(`❌ ${ENV_EXAMPLE_PATH} not found`, 'red');
      return false;
    }

    const exampleContent = fs.readFileSync(ENV_EXAMPLE_PATH, 'utf8');
    fs.writeFileSync(ENV_PATH, exampleContent);
    log(`✅ Created ${ENV_PATH} from ${ENV_EXAMPLE_PATH}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error copying ${ENV_EXAMPLE_PATH}: ${error.message}`, 'red');
    return false;
  }
}

function validateEnvFile() {
  if (!checkFileExists(ENV_PATH)) {
    return null;
  }

  try {
    const envContent = fs.readFileSync(ENV_PATH, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    const config = {};
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        config[key.trim()] = valueParts.join('=').trim();
      }
    });

    return config;
  } catch (error) {
    log(`❌ Error reading ${ENV_PATH}: ${error.message}`, 'red');
    return null;
  }
}

function checkRequiredVariables(config) {
  const required = [
    { 
      name: 'VITE_AWS_REGION', 
      description: 'AWS region for Cognito Identity Pool',
      example: 'ap-south-1'
    },
    { 
      name: 'VITE_COGNITO_IDENTITY_POOL_ID', 
      description: 'Cognito Identity Pool ID',
      example: 'ap-south-1:12345678-1234-1234-1234-123456789012'
    },
    { 
      name: 'VITE_API_ERROR_ENDPOINT', 
      description: 'Production error reporting API endpoint',
      example: 'https://your-api.execute-api.region.amazonaws.com/production/error'
    },
    { 
      name: 'VITE_USE_PRE_PRODUCTION', 
      description: 'Use pre-production endpoints (true/false)',
      example: 'false'
    }
  ];

  const issues = [];

  required.forEach(req => {
    const value = config[req.name];
    
    if (!value) {
      issues.push({
        type: 'missing',
        variable: req.name,
        description: req.description,
        example: req.example
      });
    } else if (value.includes('your-api') || value.includes('YOUR-') || value.includes('XXXXXXXXX')) {
      issues.push({
        type: 'placeholder',
        variable: req.name,
        description: req.description,
        example: req.example,
        currentValue: value
      });
    }
  });

  return issues;
}

function printSetupInstructions(issues) {
  if (issues.length === 0) {
    log('\n🎉 Configuration looks good!', 'green');
    return;
  }

  log('\n📝 Configuration Setup Required:', 'yellow');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');

  const missing = issues.filter(issue => issue.type === 'missing');
  const placeholders = issues.filter(issue => issue.type === 'placeholder');

  if (missing.length > 0) {
    log('\n❌ Missing Variables:', 'red');
    missing.forEach((issue, index) => {
      log(`  ${index + 1}. ${issue.variable}`, 'bold');
      log(`     Description: ${issue.description}`, 'cyan');
      log(`     Example: ${issue.example}`, 'magenta');
    });
  }

  if (placeholders.length > 0) {
    log('\n⚠️  Placeholder Values Found:', 'yellow');
    placeholders.forEach((issue, index) => {
      log(`  ${index + 1}. ${issue.variable}`, 'bold');
      log(`     Current: ${issue.currentValue}`, 'red');
      log(`     Example: ${issue.example}`, 'magenta');
    });
  }

  log('\n🔧 Next Steps:', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('1. Open .env file in your editor');
  log('2. Replace placeholder values with your actual AWS configuration');
  log('3. Save the file and restart your development server');
  log('4. Run this script again to validate: node setup-config.js');

  log('\n📚 Documentation:', 'cyan');
  log('• AWS Setup: See AWS_SETUP_GUIDE.md');
  log('• Environment Config: See ENVIRONMENT_CONFIGURATION_GUIDE.md');
  log('• Troubleshooting: See TROUBLESHOOTING_PREPRODUCTION.md');

  log('\n💡 Quick Test:', 'green');
  log('After configuration, test with:');
  log('  npm run dev');
  log('  Open browser console for validation messages');
}

function main() {
  log('🔧 Magazine Project Configuration Setup', 'bold');
  log('═══════════════════════════════════════════════════════════════', 'cyan');

  // Check if .env exists
  if (!checkFileExists(ENV_PATH)) {
    log(`📋 ${ENV_PATH} not found`, 'yellow');
    
    if (checkFileExists(ENV_EXAMPLE_PATH)) {
      log('Creating .env from template...', 'blue');
      if (!copyEnvExample()) {
        return false;
      }
    } else {
      log(`❌ Neither ${ENV_PATH} nor ${ENV_EXAMPLE_PATH} found`, 'red');
      log('Please ensure you are in the project root directory', 'yellow');
      return false;
    }
  } else {
    log(`✅ Found ${ENV_PATH}`, 'green');
  }

  // Validate configuration
  log('\n🔍 Validating configuration...', 'blue');
  const config = validateEnvFile();
  
  if (!config) {
    log('❌ Could not read or parse .env file', 'red');
    return false;
  }

  const issues = checkRequiredVariables(config);
  printSetupInstructions(issues);

  // Exit with appropriate code
  if (issues.length > 0) {
    // Configuration issues found
    return false;
  } else {
    log('\n✨ Your configuration is ready!', 'green');
    log('You can now start the development server with: npm run dev', 'cyan');
    return true;
  }
}

// Simple check if running as main script
try {
  main();
} catch (error) {
  console.error('Setup failed:', error.message);
}

export { checkRequiredVariables, validateEnvFile };