# Ink Player for Obsidian

English | [中文](./README.zh-cn.md)

This is an open-source Obsidian plugin for playing interactive fiction powered by Inkle's [ink](https://www.inklestudios.com/ink/) engine, designed for web games.

You can find a guide to the basics of ink [here](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md).

Thanks to [Calico](https://elliotherriman.itch.io/calico), this plugin offers a wealth of new features, including custom tags, full mobile compatibility, game saving, and advanced parsing.

## Installation

1.  In Obsidian, navigate to `Settings` → `Community Plugins` → `Browse`.
2.  Search for `Ink Player` and select the Ink Player plugin.
3.  Click `Install`.
4.  Click `Enable`.

## Usage

1.  Open an Ink script file.
2.  Use the `Activate Ink Story` command (available via the command palette or the dedicated ribbon button).
3.  Enjoy your story!

## Contributing

This plugin is part of the [InkWeave](https://github.com/uglyboy-tl/InkWeave) monorepo. It depends on `@inkweave/core`, `@inkweave/react`, and `@inkweave/plugins`.

-   Clone the InkWeave repository.
-   Run `git submodule update --init` to pull the plugin source.
-   Run `bun install` to install dependencies.
-   Run `bun run build:obsidian` to build the plugin.
-   Run `bun check` for linting and type checking.
