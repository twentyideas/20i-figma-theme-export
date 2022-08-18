import { EventHandler } from "@create-figma-plugin/utilities"

export interface CreateStylesHandler extends EventHandler {
  name: "CREATE_STYLES"
  handler: () => void
}

export interface GeneratedStylesHandler extends EventHandler {
  name: "GENERATED_STYLES"
  handler: (styles: string) => void
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE"
  handler: () => void
}

export interface MuiTextStyle {
  fontFamily: string
  fontSize: number
  lineHeight: string
  letterSpacing: string
  fontWeight: number
}
