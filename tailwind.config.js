const colors = require("tailwindcss/colors")

module.exports = {
  mode: "jit",
  darkMode: "class",
  purge: [
    "./pages/**/*.tsx",
    "./pages/**/*.js",
    "./components/**/*.tsx",
    "./components/**/*.js",
    "./components/**/*.css",
    "./components/**/*.scss",
    "./styles/**/*.scss",
    "./utils/**/*.ts",
    "./lib/**/*.ts",
    "./lib/**/*.tsx",
    "./styles/jit-hack.txt"
  ],

  theme: {
    nightwind: {
      colorClasses: ["gradient", "placeholder"],
      typography: {
        strong: {
          color: colors.white
        }
      },
      colors: {
        white: "#0F1115",
        black: "gray.50",
        sky: {
          50: "#001928"
        }
      }
    },
    extend: {
      screens: {
        xs: "560px"
      },
      colors: {
        gray: colors.gray,
        sky: colors.sky,
        cyan: colors.cyan,
        yellow: colors.yellow,
        slate: {
          400: "#000000",
          500: "#000000",
          800: "#e4e4e4",
          900: "#a4a4a4"
        },
        random1: {
          300: "var(--color1)",
          600: "var(--darkColor1)"
        },
        random2: {
          300: "var(--color2)",
          600: "var(--darkColor2)"
        }
      },
      zIndex: {
        "-10": "-10",
        100: "100"
      },
      rotate: {
        "-20": "-20deg"
      },
      animation: {
        "spin-slow": "spin 30s linear infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.black"),
            a: {
              textDecorationColor: "var(--darkColor2)",
              textDecorationThickness: "2px",
              textUnderlineOffset: "1px"
            },
            h1: {
              color: theme("colors.black"),
              fontWeight: "900"
            },
            h2: {
              color: theme("colors.black"),
              fontWeight: "900"
            },
            h3: {
              color: theme("colors.black"),
              fontSize: "1.12em"
            },
            blockquote: {
              borderLeftColor: theme("colors.random2.600")
            },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
            strong: {
              fontWeight: "900"
            },
            img: {
              borderRadius: "0.75rem"
            }
          }
        },
        sm: {
          css: {
            color: theme("colors.black"),
            a: {
              textDecorationColor: "var(--darkColor2)",
              textDecorationThickness: "2px",
              textUnderlineOffset: "1px"
            },
            h1: {
              color: theme("colors.black"),
              fontWeight: "900"
            },
            h2: {
              color: theme("colors.black"),
              fontWeight: "900"
            },
            h3: {
              color: theme("colors.black"),
              fontSize: "1.12em"
            },
            blockquote: {
              borderLeftColor: theme("colors.random2.600")
            },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
            strong: {
              fontWeight: "900"
            },
            img: {
              borderRadius: "0.75rem"
            }
          }
        }
      })
    }
  },
  variants: {
    nightwind: ["group-hover", "focus", "disabled"]
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("nightwind")
  ]
}
