# justfile for queries project

# Install dependencies and initialize Claude configuration
setup:
    npm run setup

# Run the test suite
test:
    npm run test

# Execute the SDK script via tsx
sdk:
    npm run sdk
