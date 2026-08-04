FROM node:22-bookworm-slim

# The Instagram import flow starts these executables directly.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg python3-pip \
    && pip3 install --no-cache-dir --break-system-packages --upgrade yt-dlp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
