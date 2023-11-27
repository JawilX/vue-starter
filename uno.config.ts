import {
  defineConfig,
  // presetAttributify,
  presetIcons,
  presetUno,
  // presetWebFonts,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    // ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none'],
  ],
  presets: [
    presetUno(),
    // presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    // presetWebFonts({
    //   fonts: {
    //     sans: 'DM Sans',
    //     serif: 'DM Serif Display',
    //     mono: 'DM Mono',
    //   },
    // }),
  ],
  theme: {
    colors: {
      blue: {
        1: '#AFC3FB',
        100: '#AFC3FB',
        2: '#87A6FA',
        200: '#87A6FA',
        3: '#5F88F8',
        300: '#5F88F8',
        4: '#376AF6',
        400: '#376AF6',
        5: '#2456E1',
        500: '#2456E1',
      },
      green: {
        1: '#9AECC6',
        100: '#9AECC6',
        2: '#68E3AA',
        200: '#68E3AA',
        3: '#35DA8E',
        300: '#35DA8E',
        4: '#03D071',
        400: '#03D071',
        5: '#02C169',
        500: '#02C169',
      },
      yellow: {
        1: '#FDD8A3',
        100: '#FDD8A3',
        2: '#FCC574',
        200: '#FCC574',
        3: '#FBB146',
        300: '#FBB146',
        4: '#FA9E18',
        400: '#FA9E18',
        5: '#EB910F',
        500: '#EB910F',
      },
      red: {
        1: '#FDB5BA',
        100: '#FDB5BA',
        2: '#FC9198',
        200: '#FC9198',
        3: '#FB6C76',
        300: '#FB6C76',
        4: '#FA4753',
        400: '#FA4753',
        5: '#ED323F',
        500: '#ED323F',
      },
    },
  },
})
