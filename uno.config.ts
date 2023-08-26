import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
    presetWebFonts({
      provider: 'google',
      fonts: { sans: 'Roboto', mono: 'Fira Code' },
    }),
    presetTypography(),
  ],
  transformers: [transformerVariantGroup()],
})
