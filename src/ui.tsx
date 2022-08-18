import "!prismjs/themes/prism.css"
import {
  Button,
  Columns,
  Container,
  render,
  Text,
  VerticalSpace,
} from "@create-figma-plugin/ui"
import { emit, once } from "@create-figma-plugin/utilities"
import { h } from "preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import prettier from "prettier"
import tsparser from "prettier/parser-typescript"
import { highlight, languages } from "prismjs"
import "prismjs/components/prism-clike.js"
import "prismjs/components/prism-typescript.js"
import Editor from "react-simple-code-editor"
import useCopy from "use-copy"
import styles from "./styles.css"
import {
  CloseHandler,
  CreateStylesHandler,
  GeneratedStylesHandler,
} from "./types"

const format = (tsString: string) =>
  prettier.format(tsString, {
    parser: "typescript",
    plugins: [tsparser],
    semi: false,
  })

function Plugin() {
  const [muiStyles, setStyles] = useState("")
  const [copied, copy, setCopied] = useCopy(muiStyles)

  const copyText = () => {
    copy()
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const handleCreateRectanglesButtonClick = useCallback(
    function () {
      if (muiStyles !== null) {
        emit<CreateStylesHandler>("CREATE_STYLES")
      }
    },
    [muiStyles]
  )

  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE")
  }, [])

  useEffect(() => {
    const unsub = once<GeneratedStylesHandler>(
      "GENERATED_STYLES",
      generatedStyles => {
        setStyles(format(generatedStyles))
      }
    )
    return () => {
      unsub()
    }
  }, [])

  return (
    <Container>
      <VerticalSpace space="large" />
      <Text muted>Styles</Text>
      <VerticalSpace space="small" />
      <div className={styles.container}>
        <Editor
          highlight={function (code: string) {
            return highlight(code, languages.ts, "typescript")
          }}
          onValueChange={str => setStyles(str)}
          preClassName={styles.editor}
          textareaClassName={styles.editor}
          value={muiStyles}
        />
      </div>
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleCreateRectanglesButtonClick}>
          Generate
        </Button>
        <Button fullWidth onClick={copyText} disabled={!muiStyles}>
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Close
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
