![](https://img.shields.io/badge/Foundry-v12-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/{{GITHUB_FULLNAME}}/module.zip)


# FoundryVTT Module - {{MODULE_NAME}}

This module integrates Foundry VTT with WLED to control real-world LEDs.

## Installation
In Foundry VTT's Insall Module interface, paste the following URL into the "Manifest URL" field at the bottom and click "Install"

```
https://github.com/{{GITHUB_OWNER}}/{{GITHUB_NAME}}/releases/latest/download/module.zip
```

If you would like a specific version of this package, be sure to change `latest` to `tag/[VERSION]` instead.

## Development
```
npm install
npm run build:all
```

## Release
[Create a new release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) in Github