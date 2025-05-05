/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enables class-based dark mode (standard Shadcn)
  content: [
    "./index.html", // Keep existing
    "./src/**/*.{js,ts,jsx,tsx}", // Keep existing
    // Add other paths if needed, e.g., for pages/components folders if separate
    // './pages/**/*.{ts,tsx,js,jsx}',
    // './components/**/*.{ts,tsx,js,jsx}',
    // './app/**/*.{ts,tsx,js,jsx}',
  ],
  prefix: "", // No prefix is standard
  theme: {
    container: { // Optional but common with Shadcn
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: { // <-- This is where the Shadcn magic happens
      colors: {
        border: "hsl(var(--border))", // Tells Tailwind: color 'border' uses CSS var --border
        input: "hsl(var(--input))",   // Tells Tailwind: color 'input' uses CSS var --input
        ring: "hsl(var(--ring))",     // Tells Tailwind: color 'ring' uses CSS var --ring
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
      borderRadius: { // Maps border radius names to the CSS variable
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: { // Standard Shadcn animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: { // Standard Shadcn animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Add the animation plugin
}