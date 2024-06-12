
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "0 0 0",
		"--on-warning": "255 255 255",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #668cf7 
		"--color-primary-50": "232 238 254", // #e8eefe
		"--color-primary-100": "224 232 253", // #e0e8fd
		"--color-primary-200": "217 226 253", // #d9e2fd
		"--color-primary-300": "194 209 252", // #c2d1fc
		"--color-primary-400": "148 175 249", // #94aff9
		"--color-primary-500": "102 140 247", // #668cf7
		"--color-primary-600": "92 126 222", // #5c7ede
		"--color-primary-700": "77 105 185", // #4d69b9
		"--color-primary-800": "61 84 148", // #3d5494
		"--color-primary-900": "50 69 121", // #324579
		// secondary | #396904 
		"--color-secondary-50": "225 233 217", // #e1e9d9
		"--color-secondary-100": "215 225 205", // #d7e1cd
		"--color-secondary-200": "206 218 192", // #cedac0
		"--color-secondary-300": "176 195 155", // #b0c39b
		"--color-secondary-400": "116 150 79", // #74964f
		"--color-secondary-500": "57 105 4", // #396904
		"--color-secondary-600": "51 95 4", // #335f04
		"--color-secondary-700": "43 79 3", // #2b4f03
		"--color-secondary-800": "34 63 2", // #223f02
		"--color-secondary-900": "28 51 2", // #1c3302
		// tertiary | #7811dd 
		"--color-tertiary-50": "235 219 250", // #ebdbfa
		"--color-tertiary-100": "228 207 248", // #e4cff8
		"--color-tertiary-200": "221 196 247", // #ddc4f7
		"--color-tertiary-300": "201 160 241", // #c9a0f1
		"--color-tertiary-400": "161 88 231", // #a158e7
		"--color-tertiary-500": "120 17 221", // #7811dd
		"--color-tertiary-600": "108 15 199", // #6c0fc7
		"--color-tertiary-700": "90 13 166", // #5a0da6
		"--color-tertiary-800": "72 10 133", // #480a85
		"--color-tertiary-900": "59 8 108", // #3b086c
		// success | #c76430 
		"--color-success-50": "247 232 224", // #f7e8e0
		"--color-success-100": "244 224 214", // #f4e0d6
		"--color-success-200": "241 216 203", // #f1d8cb
		"--color-success-300": "233 193 172", // #e9c1ac
		"--color-success-400": "216 147 110", // #d8936e
		"--color-success-500": "199 100 48", // #c76430
		"--color-success-600": "179 90 43", // #b35a2b
		"--color-success-700": "149 75 36", // #954b24
		"--color-success-800": "119 60 29", // #773c1d
		"--color-success-900": "98 49 24", // #623118
		// warning | #31288c 
		"--color-warning-50": "224 223 238", // #e0dfee
		"--color-warning-100": "214 212 232", // #d6d4e8
		"--color-warning-200": "204 201 226", // #ccc9e2
		"--color-warning-300": "173 169 209", // #ada9d1
		"--color-warning-400": "111 105 175", // #6f69af
		"--color-warning-500": "49 40 140", // #31288c
		"--color-warning-600": "44 36 126", // #2c247e
		"--color-warning-700": "37 30 105", // #251e69
		"--color-warning-800": "29 24 84", // #1d1854
		"--color-warning-900": "24 20 69", // #181445
		// error | #97376e 
		"--color-error-50": "239 225 233", // #efe1e9
		"--color-error-100": "234 215 226", // #ead7e2
		"--color-error-200": "229 205 219", // #e5cddb
		"--color-error-300": "213 175 197", // #d5afc5
		"--color-error-400": "182 115 154", // #b6739a
		"--color-error-500": "151 55 110", // #97376e
		"--color-error-600": "136 50 99", // #883263
		"--color-error-700": "113 41 83", // #712953
		"--color-error-800": "91 33 66", // #5b2142
		"--color-error-900": "74 27 54", // #4a1b36
		// surface | #ad1673 
		"--color-surface-50": "243 220 234", // #f3dcea
		"--color-surface-100": "239 208 227", // #efd0e3
		"--color-surface-200": "235 197 220", // #ebc5dc
		"--color-surface-300": "222 162 199", // #dea2c7
		"--color-surface-400": "198 92 157", // #c65c9d
		"--color-surface-500": "173 22 115", // #ad1673
		"--color-surface-600": "156 20 104", // #9c1468
		"--color-surface-700": "130 17 86", // #821156
		"--color-surface-800": "104 13 69", // #680d45
		"--color-surface-900": "85 11 56", // #550b38
		
	}
}