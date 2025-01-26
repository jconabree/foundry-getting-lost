![](https://img.shields.io/badge/Foundry-v12-informational)
![Latest Release Download Count](https://img.shields.io/github/downloads/jconabree/foundry-getting-lost/module.zip)


# FoundryVTT Module - Getting Lost Helper

This module provides a tool to help with "Getting Lost" narratives. This is particularly useful when you have a regional map already and the party is trying to find their way to a destination. If they become lost, you can trigger them to roll a set amount of dice. Based on the outcomes, this module will narrow down quadrant by quadrant where they have wound up.

## Installation
In Foundry VTT's Insall Module interface, paste the following URL into the "Manifest URL" field at the bottom and click "Install"

```
https://github.com/jconabree/foundry-getting-lost/releases/latest/download/module.zip
```

If you would like a specific version of this package, be sure to change `latest` to `tag/[VERSION]` instead.

## Usage

### Managing Lost Maps

Lost maps are a variant of Journal Pages

### Creating Lost Map
1. Create a new Journal. Recommended to create a new folder for your maps and create a Journal for each lost map.
2. Add a new page to the journal with the "Lost Map" page type.
3. Edit the page with your values

Options:
- Name
- Set map Image
- Set how many divisions there are (default 3, minimum 1, maximum 6)
- Flavor text

### Using the Lost Map
Once your map is configured, you can click the "Run Map" button. This will:
- Request dice rolls based on the number of divisions
- Create a new page in the journal with the results

### Settings
- "Show divisions in results"
  - Display the divisions by default in result pages. When unchecked, you can still click the "Show divisions" inside of the result page to show them.

## Development

### Installation
```
npm install
# Build
npm run build:all
# Or Watch
npm run watch:all
```