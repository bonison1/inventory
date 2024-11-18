import './globals.css'; // Make sure this path matches your CSS location

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice Generator</title>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
