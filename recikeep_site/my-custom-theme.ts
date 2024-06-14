
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "0 0 0",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #34e37d 
		"--color-primary-50": "225 251 236", // #e1fbec
		"--color-primary-100": "214 249 229", // #d6f9e5
		"--color-primary-200": "204 248 223", // #ccf8df
		"--color-primary-300": "174 244 203", // #aef4cb
		"--color-primary-400": "113 235 164", // #71eba4
		"--color-primary-500": "52 227 125", // #34e37d
		"--color-primary-600": "47 204 113", // #2fcc71
		"--color-primary-700": "39 170 94", // #27aa5e
		"--color-primary-800": "31 136 75", // #1f884b
		"--color-primary-900": "25 111 61", // #196f3d
		// secondary | #c8d0df 
		"--color-secondary-50": "247 248 250", // #f7f8fa
		"--color-secondary-100": "244 246 249", // #f4f6f9
		"--color-secondary-200": "241 243 247", // #f1f3f7
		"--color-secondary-300": "233 236 242", // #e9ecf2
		"--color-secondary-400": "217 222 233", // #d9dee9
		"--color-secondary-500": "200 208 223", // #c8d0df
		"--color-secondary-600": "180 187 201", // #b4bbc9
		"--color-secondary-700": "150 156 167", // #969ca7
		"--color-secondary-800": "120 125 134", // #787d86
		"--color-secondary-900": "98 102 109", // #62666d
		// tertiary | #4bb141 
		"--color-tertiary-50": "228 243 227", // #e4f3e3
		"--color-tertiary-100": "219 239 217", // #dbefd9
		"--color-tertiary-200": "210 236 208", // #d2ecd0
		"--color-tertiary-300": "183 224 179", // #b7e0b3
		"--color-tertiary-400": "129 200 122", // #81c87a
		"--color-tertiary-500": "75 177 65", // #4bb141
		"--color-tertiary-600": "68 159 59", // #449f3b
		"--color-tertiary-700": "56 133 49", // #388531
		"--color-tertiary-800": "45 106 39", // #2d6a27
		"--color-tertiary-900": "37 87 32", // #255720
		// success | #9981e5 
		"--color-success-50": "240 236 251", // #f0ecfb
		"--color-success-100": "235 230 250", // #ebe6fa
		"--color-success-200": "230 224 249", // #e6e0f9
		"--color-success-300": "214 205 245", // #d6cdf5
		"--color-success-400": "184 167 237", // #b8a7ed
		"--color-success-500": "153 129 229", // #9981e5
		"--color-success-600": "138 116 206", // #8a74ce
		"--color-success-700": "115 97 172", // #7361ac
		"--color-success-800": "92 77 137", // #5c4d89
		"--color-success-900": "75 63 112", // #4b3f70
		// warning | #7aabce 
		"--color-warning-50": "235 242 248", // #ebf2f8
		"--color-warning-100": "228 238 245", // #e4eef5
		"--color-warning-200": "222 234 243", // #deeaf3
		"--color-warning-300": "202 221 235", // #caddeb
		"--color-warning-400": "162 196 221", // #a2c4dd
		"--color-warning-500": "122 171 206", // #7aabce
		"--color-warning-600": "110 154 185", // #6e9ab9
		"--color-warning-700": "92 128 155", // #5c809b
		"--color-warning-800": "73 103 124", // #49677c
		"--color-warning-900": "60 84 101", // #3c5465
		// error | #59cb9d 
		"--color-error-50": "230 247 240", // #e6f7f0
		"--color-error-100": "222 245 235", // #def5eb
		"--color-error-200": "214 242 231", // #d6f2e7
		"--color-error-300": "189 234 216", // #bdead8
		"--color-error-400": "139 219 186", // #8bdbba
		"--color-error-500": "89 203 157", // #59cb9d
		"--color-error-600": "80 183 141", // #50b78d
		"--color-error-700": "67 152 118", // #439876
		"--color-error-800": "53 122 94", // #357a5e
		"--color-error-900": "44 99 77", // #2c634d
		// surface | #361953 
		"--color-surface-50": "225 221 229", // #e1dde5
		"--color-surface-100": "215 209 221", // #d7d1dd
		"--color-surface-200": "205 198 212", // #cdc6d4
		"--color-surface-300": "175 163 186", // #afa3ba
		"--color-surface-400": "114 94 135", // #725e87
		"--color-surface-500": "54 25 83", // #361953
		"--color-surface-600": "49 23 75", // #31174b
		"--color-surface-700": "41 19 62", // #29133e
		"--color-surface-800": "32 15 50", // #200f32
		"--color-surface-900": "26 12 41", // #1a0c29
		
	}
}