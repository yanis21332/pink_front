import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import GlobalStyle from "../styles/GlobalStyle";
import StyledComponentsRegistry from "../lib/registry";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  fallback: ["serif"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  fallback: ["sans-serif"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-mono",
  fallback: ["monospace"],
});

export const metadata = {
  title: "Pink Studio — Agenda",
  description: "Application de gestion de rendez-vous",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
