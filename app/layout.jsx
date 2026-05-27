import './globals.css';

export const metadata = {
  title: 'Spyne Intelligence Hub · Westgate Honda',
  description: 'Dealer Principal command center. Time-to-Sell journey across 6 stages.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* General Sans (Fontshare) — editorial, premium sans */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=jetbrains-mono@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
