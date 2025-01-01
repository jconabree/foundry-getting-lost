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

Click the "Lost Maps" button under the Roll Tables section.

Here you'll be able to see and manage existing lost maps and create new ones.

### Creating Lost Map
Click "Create New" in the Lost Maps window. Here you'll enter the map's information
**[TODO Add image walkthrough]**

- Name
- Set map Image
- Set how many divisions there are (default 3, minimum 1, maximum 6)
- Adjust roll table
  - Evenly disperse odds or adjust ranges

### Using the Lost Map
There are three ways you can trigger getting lost.
1. In the Manage Lost Maps area there's a "Run" button
2. Through the chat by entering **[TODO add command details]**
3. The lost map can be added to the hotbar **[TODO details how]**

These will all output the map into the chat for everyone to see. The output map will also be added to a new handout for future reference

## Development
```
npm install
npm run build:all
```

## Release
[Create a new release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release) in Github