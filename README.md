# Encountering Survival

An audio player for Holocaust Centre North, Huddersfield.

## Installation

Requires `git lfs`.

```
pnpm i
```

## Netlify configuration

### Publish directory

`dist`

### Env variables

To enable git lfs:

```
GIT_LFS_ENABLED = true
GIT_LFS_FETCH_INCLUDE = *.mp3,*.mp4,*.webp,*.jpg,*.png,*.jpeg,*.svg,*.gif,*.pdf
```

### Build script

This is specified in the `netlify.toml` and does not need to be manually set.

## Scripts

### Start a development server

`pnpm start`

### Build the application

`pnpm build`

Will output to the `dist` folder.

### Preview the build

`pnpm preview`
