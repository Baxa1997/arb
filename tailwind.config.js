/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,jsx,mdx}',
    './src/app/**/*.{js,jsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Creamy background scale
        cream: {
          50:  "#FFFDF8",
          100: "#FBF8F1",
          200: "#F4ECD9",
          300: "#EADFC4",
          400: "#E0D2AE",
          500: "#D4C193",
          600: "#C2A96E",
          700: "#A88B4d",
          800: "#7d6535",
          900: "#574623",
        },
        // Brand green scale
        brand: {
          50:  "#EAF4EE",
          100: "#D2E8DA",
          200: "#A6D2B7",
          300: "#79BB93",
          400: "#4F9F6E",
          500: "#2E7D4F",
          600: "#1F6B40",
          700: "#1F3D2B",
          800: "#163322",
          900: "#0F2418",
        },
        islamic: {
          green: "#2E7D4F",
          navy: "#1a2a4a",
          gold: "#c9a84c",
          red: "#c0392b",
          blue: "#0055aa"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
