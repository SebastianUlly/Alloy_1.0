import colors from 'vuetify/es5/util/colors'
import TerserPlugin from 'terser-webpack-plugin'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Alloy',
    title: 'Alloy',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'quill/dist/quill.core.css',
		'quill/dist/quill.snow.css',
    'assets/scss/vuetify_overwrite.css'
    
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
      { src: '~plugins/vue-quill-editor', ssr: false },
      { src: '~plugins/vuelidate', ssr: false },
      { src: '~plugins/vue-json-pretty', ssr: false },
      { src: '~plugins/apollo-overrides', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
		dirs: [
			'./components/elements/image',
			'./components/elements/lib',
			'./components/elements/Text',
			'./components/elements/singleLineText',
			'./components/elements/relationships'
		]
	},

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
		'@nuxtjs/axios',
		'@nuxtjs/apollo'
	],
  
  apollo: {
		clientConfigs: {
			default: {
				httpEndpoint: 'https://graphql.everglow-skincare.com/'
				// httpEndpoint: 'https://johannes.graphql.bocos.gmbh/'
			}
		}
	},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					parallel: false
				})
			]
		},
		loaders: {
			sass: {
				implementation: require('sass')
			},
			scss: {
				implementation: require('sass')
			}
		}
	},
}
