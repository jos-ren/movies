const inter = Inter({ subsets: ['latin'] })
import './globals.css'
import { Inter } from 'next/font/google'

export const metadata = {
  title: 'Muvi',
  description: 'Josren 2023',
}

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
          <div>{children}</div>
      </body>
    </html>
  )
}
