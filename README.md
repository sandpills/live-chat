# live-chat

Minimal live bullet-screen chat — Express + Socket.IO. Audience members submit messages and they fly across an overlay page (green-screen background for OBS chroma-keying).

## Pages

- `/` — audience chat (buttons + input)
- `/overlay` — bullet-screen display (green background, for OBS)

## Run locally

```sh
npm install
npm run dev      # with auto-reload (nodemon)
# or
npm start
```

Open http://localhost:3000 and http://localhost:3000/overlay in separate tabs.

## Deploy to Render

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com), sign in, **New → Blueprint**, and point it at the repo. Render reads `render.yaml` and creates a free Web Service.
3. Deploys happen automatically on each push to the default branch. First cold start after idle is ~30–60s.
