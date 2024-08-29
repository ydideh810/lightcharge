import { Box, BoxProps, styled } from '@chakra-ui/react'
import { ThemeProvider } from '@remirror/react-components'
import { AllStyledComponent } from '@remirror/styles/emotion'
import { captureException } from '@sentry/react'
import { useEffect, useMemo } from 'react'
import { RemirrorThemeType } from 'remirror'

import { ID } from '../../../shared/constants'
import { useCustomTheme } from '../../../utils'
import { tableCellStyles } from './typeMaps'

const Container = styled(Box, {
  baseStyle: {
    '& p, & iframe, & h1, & h2, & h3, & h4, & h5': {
      mt: 4,
    },
    '& table': {
      '& p': {
        margin: '0px',
      },
      ...tableCellStyles,
    },
    '& iframe': {
      minHeight: '28em',
    },
    '& div.remirror-iframe-custom': {
      width: '100% !important',
      height: 'auto !important',
      marginBottom: '20px',
    },
    '& div.ql-container': {
      border: 'none !important',
    },
    '& a': {
      textDecoration: 'underline',
    },
    width: '100%',
  },
})

export const StyleProvider = ({ children, flex, display, ...rest }: { flex?: boolean } & Omit<BoxProps, 'flex'>) => {
  const { colors } = useCustomTheme()

  const remirrorTheme: RemirrorThemeType = useMemo(
    () => ({
      color: {
        text: colors.utils.text,
        background: colors.neutral[0],
        foreground: colors.utils.text,
        primary: colors.primary1[9],
        primaryText: colors.utils.text,
        hover: {
          background: colors.neutral1[3],
          primary: colors.primary1[9],
        },
        secondary: colors.primary1[9],
        secondaryText: colors.utils.text,
        border: colors.neutral1[6],
        outline: colors.primary1[9],
      },
    }),
    [colors],
  )

  useEffect(() => {
    try {
      twttr.widgets.load(document.getElementById(ID.project.story.markdown.container))
    } catch (e) {
      captureException(e, {
        tags: { area: 'twitter-widgets' },
      })
    }
  }, [])

  return (
    <Container
      id={ID.project.story.markdown.container}
      paddingBottom="0px !important"
      sx={
        flex
          ? {
              display: display || 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              '& div.remirror-editor-wrapper': {
                px: 1,
                pt: '2px',
                m: 0,
              },
              '& div.remirror-theme': {
                pt: 0,
                m: 0,
              },
              '& div.remirror-editor-wrapper, & div.remirror-editor, & div.remirror-theme': {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                '& :focus': {
                  boxShadow: `${colors.primary1[8]} 0px 0px 0px 1px !important`,
                },
              },
              '& div.tableWrapper': {
                padding: '10px',
                paddingBottom: '20px',
                '& th, & td': {
                  paddingX: '5px',
                },
              },
            }
          : {}
      }
      {...rest}
    >
      <AllStyledComponent
        theme={remirrorTheme}
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <ThemeProvider theme={remirrorTheme}>{children}</ThemeProvider>
      </AllStyledComponent>
    </Container>
  )
}