//import 'normalize.css/normalize.css'
import '@/styles/globals.css'

import SSidebarLayout from '@/components/SSidebarLayout'
import ToastProvider from '@/components/ToastProvider'


// export const metadata = {
//   title: 'Next.js',
//   description: 'Generated by Next.js',
// }
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&display=swap"
          />
      </head>
        <body  suppressHydrationWarning={true} className='bg-gray-50'  >
          <ToastProvider />
          <SSidebarLayout>
            {children}
          </SSidebarLayout>
        </body>
        
      
    </html>
  )
}