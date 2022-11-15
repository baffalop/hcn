# Encountering Survival

An audio player for Holocaust Centre North, Huddersfield.

## Installation

Requires `git lfs`.

```
pnpm i
```

## Netlify configuration

### Build script

`npm run build`

(Though the site is built with `pnpm`, Netlify doesn't support it. Using a workaround in `netlify.toml`  )

### Publish directory

`dist`

### Env variables

To enable git lfs:

```
GIT_LFS_ENABLED = true
GIT_LFS_FETCH_INCLUDE = *.mp3,*.mp4,*.webp,*.jpg,*.png,*.jpeg,*.svg,*.gif,*.pdf
```

## Scripts

### Start a development server

`pnpm start`

### Build the application

`pnpm build`

Will output to the `dist` folder.

### Preview the build

`pnpm preview`
