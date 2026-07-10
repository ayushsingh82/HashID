# AI-Powered Identity Verification on Hedera

This React application provides a user interface for AI-powered identity verification on the Hedera network, leveraging the ElizaOS Hedera plugin for enhanced privacy and security.

## Features

- Real-time identity verification using AI
- Secure storage of verification results on Hedera
- Integration with DApps requiring KYC processes
- Enhanced privacy through Hedera's secure infrastructure

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- ElizaOS with the Hedera plugin configured

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Integration with ElizaOS Hedera Plugin

This application is designed to work with the ElizaOS Hedera plugin. It communicates with the plugin through the ElizaOS API to perform Hedera blockchain operations.

### Configuration

To configure the application to work with your ElizaOS instance:

1. Update the `baseUrl` in `src/services/HederaService.js` to point to your ElizaOS API endpoint.
2. Ensure your ElizaOS instance has the Hedera plugin installed and configured with the appropriate credentials.

## Architecture

The application consists of:

1. **React Frontend**: Provides the user interface for identity verification.
2. **Verification Service**: Handles the AI-powered verification logic.
3. **Hedera Service**: Communicates with the ElizaOS Hedera plugin to store and retrieve verification results on the Hedera network.

## Workflow

1. User provides personal information, a selfie, and an ID document.
2. The application uses AI to verify the identity by:
   - Matching the selfie with the photo on the ID document
   - Verifying the authenticity of the ID document
   - Extracting and validating the information on the ID document
3. The verification result is stored on the Hedera network using the ElizaOS Hedera plugin.
4. The user receives a verification ID that can be used to retrieve the verification result.

## Security Considerations

- Sensitive data is not stored directly on the blockchain. Instead, hashes or encrypted versions are stored.
- The application uses secure connections to communicate with the ElizaOS API.
- Personal information is validated and sanitized before processing.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 