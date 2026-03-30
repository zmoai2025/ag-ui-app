'use client'

import { CopilotKit } from '@copilotkit/react-core/v2'
import './globals.css'
import '@copilotkit/react-core/v2/styles.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={'antialiased'}>
        <CopilotKit runtimeUrl="/api/copilotkit" agent="starterAgent">
          {children}
        </CopilotKit>
      </body>
    </html>
  )
}
