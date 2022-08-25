import { emit, once, showUI } from "@create-figma-plugin/utilities"
import { createPalette, createTypography } from "./helpers"
import {
  CloseHandler,
  CreateStylesHandler,
  GeneratedStylesHandler,
} from "./types"

export default function () {
  once<CreateStylesHandler>("CREATE_STYLES", () => {
    const textStyles = createTypography()
    const colorPalette = createPalette()

    const textTypes = `\n
    declare module "@mui/material/styles" {
      interface TypographyVariants {
        ${Object.keys(textStyles)
          .map((key) => `${key}: React.CSSProperties`)
          .join("\n")}
      }
      interface TypographyVariantOptions {
        ${Object.keys(textStyles)
          .map((key) => `${key}: React.CSSProperties`)
          .join("\n")}
      }
    }

    declare module "@mui/material/Typography" {
      interface TypographyPropsVariantOverrides {
        ${Object.keys(textStyles)
          .map((key) => `${key}: true`)
          .join("\n")}
      }
    }
    `

    const textObj = `\n
    const figmaTypography = ${JSON.stringify(textStyles, null, 2)} as const
    `
    const colorObj = `\n
    const figmaPalette = ${JSON.stringify(colorPalette, null, 2)} as const\n
    `

    emit<GeneratedStylesHandler>(
      "GENERATED_STYLES",
      textTypes + colorObj + textObj
    )
  })
  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin()
  })
  showUI({
    width: 700,
    height: 800,
  })
}
