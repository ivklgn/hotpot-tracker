import { createSystem, defaultConfig, defineConfig, defineRecipe } from '@chakra-ui/react';

/**
 * Custom button recipe with teal as the default color palette
 */
const buttonRecipe = defineRecipe({
  base: {
    colorPalette: 'teal',
  },
  variants: {
    variant: {
      solid: {
        bg: 'colorPalette.600',
        color: 'white',
        _hover: {
          bg: 'colorPalette.700',
        },
        _active: {
          bg: 'colorPalette.800',
        },
      },
      subtle: {
        bg: 'colorPalette.100',
        color: 'colorPalette.800',
        _hover: {
          bg: 'colorPalette.200',
        },
        _dark: {
          bg: 'colorPalette.900',
          color: 'colorPalette.200',
          _hover: {
            bg: 'colorPalette.800',
          },
        },
      },
      outline: {
        borderColor: 'colorPalette.600',
        color: 'colorPalette.600',
        _hover: {
          bg: 'colorPalette.50',
        },
        _dark: {
          borderColor: 'colorPalette.400',
          color: 'colorPalette.400',
          _hover: {
            bg: 'colorPalette.950',
          },
        },
      },
      ghost: {
        color: 'colorPalette.600',
        _hover: {
          bg: 'colorPalette.50',
        },
        _dark: {
          color: 'colorPalette.400',
          _hover: {
            bg: 'colorPalette.950',
          },
        },
      },
    },
  },
});

/**
 * Custom theme configuration for Hotpot Tracker
 *
 * Design goals:
 * - Softer, warmer feel than default Chakra
 * - Slightly larger border radius for friendlier look
 * - Refined shadows with less harshness
 * - Better typography with Inter font
 */

const customConfig = defineConfig({
  globalCss: {
    'html, body': {
      fontFamily: 'body',
      fontFeatureSettings: '"cv11", "ss01"', // Enable stylistic alternates for Inter
    },
    // Improved focus ring for accessibility
    '*:focus-visible': {
      outline: '2px solid',
      outlineColor: 'teal.400',
      outlineOffset: '2px',
    },
    // Smoother selection
    '::selection': {
      bg: 'teal.100',
      color: 'gray.900',
    },
  },

  theme: {
    tokens: {
      // Typography - Inter font for modern look
      fonts: {
        heading: {
          value:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        },
        body: {
          value:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        },
        mono: {
          value: '"JetBrains Mono", "Fira Code", SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        },
      },

      // Softer border radius - more approachable
      radii: {
        none: { value: '0' },
        xs: { value: '0.125rem' },
        sm: { value: '0.25rem' },
        md: { value: '0.5rem' },
        lg: { value: '0.75rem' },
        xl: { value: '1rem' },
        '2xl': { value: '1.25rem' },
        '3xl': { value: '1.5rem' },
        full: { value: '9999px' },
      },

      // Refined shadows - softer, more layered for depth
      shadows: {
        xs: { value: '0 1px 2px 0 rgb(0 0 0 / 0.04)' },
        sm: { value: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)' },
        md: { value: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)' },
        lg: { value: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.08)' },
        xl: { value: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.08)' },
        '2xl': { value: '0 25px 50px -12px rgb(0 0 0 / 0.2)' },
        inner: { value: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.04)' },
      },

      // Warmer gray scale (zinc-based)
      colors: {
        gray: {
          50: { value: '#fafafa' },
          100: { value: '#f4f4f5' },
          200: { value: '#e4e4e7' },
          300: { value: '#d4d4d8' },
          400: { value: '#a1a1aa' },
          500: { value: '#71717a' },
          600: { value: '#52525b' },
          700: { value: '#3f3f46' },
          800: { value: '#27272a' },
          900: { value: '#18181b' },
          950: { value: '#09090b' },
        },
      },
    },

    recipes: {
      button: buttonRecipe,
    },

    semanticTokens: {
      colors: {
        // Override default background tokens
        'bg.canvas': {
          value: { _light: '{colors.gray.50}', _dark: '{colors.gray.950}' },
        },
        'bg.subtle': {
          value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
        'bg.muted': {
          value: { _light: '{colors.gray.200}', _dark: '{colors.gray.700}' },
        },
        // Override border tokens
        'border.subtle': {
          value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
      },
      shadows: {
        // Card/panel shadow
        card: {
          value: {
            _light: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
            _dark: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
          },
        },
        // Elevated shadow for dropdowns, modals
        elevated: {
          value: {
            _light: '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
            _dark: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
