/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6366f1',
                'primary-dark': '#4f46e5',
                secondary: '#8b5cf6',
                accent: '#06b6d4',
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
                'bg-primary': '#0f172a',
                'bg-secondary': '#1e293b',
                'bg-tertiary': '#334155',
                'text-primary': '#f1f5f9',
                'text-secondary': '#cbd5e1',
                'text-muted': '#94a3b8',
                border: '#334155',
                'border-light': '#475569',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
