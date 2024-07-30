import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'jotai'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import { client } from './config/apollo-client'
import { Head } from './config/Head'
import { configMatomo } from './config/matomo'
import { AuthProvider, ChakraThemeProvider, NavProvider, ServiceWorkerProvider } from './context'
import { BtcProvider } from './context/btc'

const App = () => {
  useEffect(() => {
    configMatomo()
  }, [])

  return (
    <Provider>
      <ScrollRestoration />
      <ChakraProvider>
        <ChakraThemeProvider>
          <ServiceWorkerProvider>
            <ApolloProvider client={client}>
              <AuthProvider>
                <NavProvider>
                  <BtcProvider>
                    <Head />
                    <Outlet />
                  </BtcProvider>
                </NavProvider>
              </AuthProvider>
            </ApolloProvider>
          </ServiceWorkerProvider>
        </ChakraThemeProvider>
      </ChakraProvider>
    </Provider>
  )
}

export default App
