"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [queryClient]=React.useState(()=> new QueryClient({}))
  return(
    <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>
      {children}
      </NextThemesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  
  )
}
