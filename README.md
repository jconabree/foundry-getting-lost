# Template Module for Foundry VTT

This package is a template for new Foundry VTT Modules.

## Installation

The installation flow is as follows:
1. Click "Use Template" in Github
2. Clone your new repository locally
3. Follow the installation instructions below
4. Commit and push changes
5. Happy coding 😄

### Requirements
Node v20+

### Installation Steps
Before running the setup, make sure you have committed any changes you've made. The installation will change file contents and remove files, so you'll want a clean git state in case you need to restore.

When you're ready, run the following commands

**Install Dependencies**
```bash
npm run install
```

**Run Setup CLI**
```bash
npm run template:setup
```
This will:
1. Request information from you
2. Replace placeholders in files based on your answers
3. Move the current readme to a TEMPLATE_README.md file and move the PACKAGE_README.md to the main readme

**Cleaning Template Files**
```bash
npm run template:clean
```
This will:
1. Remove the TEMPLATE_README.md file
2. Remove template commands from the package.json
3. Remove the template CLI tool files