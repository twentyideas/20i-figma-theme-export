// This plugin will open a window to prompt the user generate styles for a 20i styled components theme

// import { getColorsAndType } from "./src/getColorAndType"
// import { getTypographyCSS } from "./src/getTypography"

// import { Color, ColorMap } from "./types"
interface Color {
  main: { [opacity: number]: string }
  dark: { [opacity: number]: string }
  light: { [opacity: number]: string }
  contrast: { [opacity: number]: string }
}
interface ColorMap {
  primary: Partial<Color>
  secondary: Partial<Color>
  accent: Partial<Color>
  neutral: Partial<Color>
}

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  height: 600,
  width: 800,
})

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === `styles`) {
    const colorAndType = getColorsAndType()
    const textStyles = getTypographyCSS()
    console.log(textStyles)

    // post results to the Figma UI to copy/paste from
    figma.ui.postMessage(colorAndType + textStyles)
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  if (msg.type === "cancel") {
    figma.closePlugin()
  }
}

const getColorsAndType = () => {
  const paintStyles = figma.getLocalPaintStyles() // "Primary 1 / 100"
  const flatList = paintStyles.reduce((all: { [x: string]: string }, val) => {
    const name = val.name
      .split(/\s/)
      .map((w, i) => {
        let word = w.toLowerCase()
        if (i !== 0) {
          word = word.substr(0, 1).toUpperCase() + word.substr(1)
        } else {
          word = word
        }
        return word
      })
      .join("")
    // const name = val.name.split("/ ").join("").split(" ").join("-").toLowerCase() // converting names from "Primary 1 / 100" => "primary-1-100"
    const paint = val.paints[0] // only ever one paint for some reason :shrug:

    // only accounts for solid colors as opposed to gradients, etc
    if (paint.type === "SOLID") {
      const { r, g, b } = paint.color
      const newColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(paint.opacity)})`
      all[name] = newColor
      return all
    }
  }, {})

  // typescript type template
  const types = `
interface ThemeColors {
\t${Object.keys(flatList)
    .map((key) => key + ": string")
    .join("\n\t")}
}

${JSON.stringify(flatList, null, 2)}
        `
  return types
}

interface Typography {
  fontFamily: string
  fontWeight: string
  fontSizeMax: number
  fontSizeMin: number
  lineHeightMax?: number
  lineHeightMin?: number
  elementType: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "button"
}
interface TypographyData {
  [x: string]: Typography
}
const getTypographyCSS = () => {
  const textStyles = figma.getLocalTextStyles() // name: "Tablet / Header 2"
  const data = textStyles.reduce((all: TypographyData, curr) => {
    let name = curr.name.split("/")[1].replaceAll(" ", "")
    let elementType
    if (name.includes("Header")) {
      const headingNum = name.slice(-1)[0]
      elementType = "h" + headingNum
    } else if (name.includes("Button")) {
      name = name + "Typography"
      elementType = "button"
    } else {
      elementType = "p"
    }
    console.log({ name, elementType })
    if (!all[name]) {
      all[name] = {
        elementType,
        fontFamily: curr.fontName.family,
        fontWeight: curr.fontName.style === "Bd" ? "bold" : "normal",
        fontSizeMax: curr.fontSize,
        fontSizeMin: curr.fontSize,
        ...(curr.lineHeight.unit === "PIXELS" && {
          lineHeightMax: Number(curr.lineHeight.value),
          lineHeightMin: Number(curr.lineHeight.value),
        }),
      }
    } else {
      all[name].fontSizeMax = Math.max(all[name].fontSizeMax, curr.fontSize)
      all[name].fontSizeMin = Math.min(all[name].fontSizeMin, curr.fontSize)
      if (curr.lineHeight.unit === "PIXELS") {
        console.log(curr.lineHeight.value, all[name].lineHeightMax, all[name].lineHeightMin)
        all[name].lineHeightMax = Math.max(all[name].lineHeightMax, curr.lineHeight.value)
        all[name].lineHeightMin = Math.min(all[name].lineHeightMin, curr.lineHeight.value)
      }
    }

    return all
  }, {})
  const breakpoints = {
    min: 640,
    max: 1440,
  }
  const convertToRem = (pxVar: string) => `calc(var(${pxVar}) / 16 * 1rem)`
  const makeMagicNumber = (elementType: string, type: "FontSize" | "LineHeight") => {
    const fontDiff = `var(--${elementType}${type}Max) - var(--${elementType}${type}Min)`
    const magicNumber = `var(--${elementType}${type}Min) / 16 * 1rem + (${fontDiff}) * ((100vw - var(--breakpoint-min) * 1px) / (var(--breakpoint-max) - var(--breakpoint-min)))`
    return magicNumber
  }

  const styledComponents = Object.entries(data)
    .map(([name, component]) => {
      const fontSizeMaxVar = `--${name}FontSizeMax`
      const fontSizeMinVar = `--${name}FontSizeMin`
      const lineHeightMinVar = `--${name}LineHeightMin`
      const lineHeightMaxVar = `--${name}LineHeightMax`
      const magicFontSize = makeMagicNumber(name, "FontSize")
      const magicLineHeight = makeMagicNumber(name, "LineHeight")
      return `export const ${name} = styled.${component.elementType}\`
                ${fontSizeMinVar}: ${component.fontSizeMin};
                ${fontSizeMaxVar}: ${component.fontSizeMax};
                ${lineHeightMinVar}: ${component.lineHeightMin};
                ${lineHeightMaxVar}: ${component.lineHeightMax};
                font-family: "${component.fontFamily}", Arial, Helvetica, sans-serif;
                font-weight: ${component.fontWeight};
                font-size: min(max(${convertToRem(fontSizeMinVar)}, ${magicFontSize}), ${convertToRem(fontSizeMaxVar)});
                line-height: min(max(${convertToRem(lineHeightMinVar)}, ${magicLineHeight}), ${convertToRem(lineHeightMaxVar)});
                \`
                `
    })
    .join("\n")

  const rootVars = `
  :root {
      --breakpoint-min: ${breakpoints.min};
      --breakpoint-max: ${breakpoints.max};
    }
    `
  const response = styledComponents.concat(rootVars)
  return response
}
