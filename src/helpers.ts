import { MuiTextStyle } from "./types"

export const toUnitString = (value: LetterSpacing | LineHeight) => {
  if (value.unit === "PIXELS") {
    return `${value.value.toFixed(2)}px`
  }
  throw new Error(`Unsupported unit: ${value.unit}`)
}

export const toFontWeight = (fontWeight: string) => {
  switch (fontWeight.toLowerCase()) {
    case "regular":
      return 400
    case "semibold":
      return 600
    case "bold":
      return 700
    default:
      throw new Error(`Unsupported font weight: ${fontWeight}`)
  }
}

export const cleanName = (name: string) => {
  return (
    name
      // remove spaces, /, -, and Regular (case insensitive)
      .replace(/\s|\/|-|(?:Regular)/gi, "")
      // lowercase first letter
      .replace(/^./, name[0].toLowerCase())
  )
}

export const createTypography = () =>
  figma
    .getLocalTextStyles()
    .reduce<Record<string, MuiTextStyle>>((all, curr) => {
      const cleanedName = cleanName(curr.name)
      all[cleanedName] = {
        fontFamily: curr.fontName.family,
        fontSize: curr.fontSize,
        letterSpacing: toUnitString(curr.letterSpacing),
        lineHeight: toUnitString(curr.lineHeight),
        fontWeight: toFontWeight(curr.fontName.style),
      }
      return all
    }, {})

const toRGBValue = (colorValue: number) => Math.round(colorValue * 255)

const toRGBA = (paint: SolidPaint) =>
  `rgba(${toRGBValue(paint.color.r)}, ${toRGBValue(
    paint.color.g
  )}, ${toRGBValue(paint.color.b)}, ${paint.opacity ?? 1})`

export const createPalette = () =>
  figma.getLocalPaintStyles().reduce<Record<string, string>>((all, curr) => {
    const cleanedName = cleanName(curr.name)
    const paint = curr.paints[0]
    if (paint.type === "SOLID") {
      all[cleanedName] = toRGBA(paint)
    }
    return all
  }, {})
