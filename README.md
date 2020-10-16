# 20i Figma Theme Export Plugin

Run this plugin to generate a json theme to consume in a css-in-js like [Styled Components](https://styled-components.com/)

## TODO

-   [ ]: Generate Colors
    -   [x]: Working example
    -   [ ]: Stable naming convention
-   [ ]: Generate Typography
-   [ ]: Make config to more flexibly generate a theme object
-   [ ]: Fix tsconfig to use regular file structure, not this only `code.ts` business...

## Usage

1. Clone repo:

    ```
    git clone <REPO_URL>
    ```

1. Add to figma: `Plugins -> New Plugin -> Choose a manifest.json file`. Select the `manifest.json` in this directory
1. Right click any where in a figma file for a menu
1. `Plugins -> Development -> 20i-figma-theme-export`

## Development

This project uses [Yarn](https://yarnpkg.com/)

1. Install dependencies
    ```
    yarn
    ```
1. Run dev server to compile code
    ```
    yarn dev
    ```

---

### Figma ref.

Below are the steps to get your plugin running. You can also find instructions at:

https://www.figma.com/plugin-docs/setup/
