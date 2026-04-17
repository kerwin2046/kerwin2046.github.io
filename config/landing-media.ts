/**
 * 首页配图：仅「首屏电影感」使用 Unsplash 风景；其余区块用本地 public资源。
 * 换首屏图：改 cinematic；换其余图：改对应 `/images/...` 或放入 public 后改路径。
 */
const u = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export const landingMedia = {
  cinematic: {
    center: u("photo-1506905925346-21bda4d32df4", 2000),
    sides: [
      u("photo-1517824806704-9040b037703b", 1200),
      u("photo-1510312305653-8ed496efae75", 1200),
      u("photo-1533873984035-25970ab07461", 1200),
      u("photo-1527004013197-933c4bb611b3", 1200),
    ],
  },
  philosophy: {
    left: "/images/02cdc426-dff4-4dff-b131-1b134c3699b5.png",
    right: "/images/product-forest.png",
  },
  featured: [
    "/images/d18fe616-5596-4559-90f5-a90f5397d0d8.png",
    "/images/e26fa9c3-966d-4966-94a4-954a1e511c1c.png",
    "/images/car.jpg",
    "/images/204cee22-9e85-49e8-9303-1d309af626b0.png",
    "/images/led-flashlight-bottle.png",
    "/images/heating-campfire.png",
  ],
  technologyBento: {
    center: "/images/704f6810-09a3-409a-80a1-140a13041c83.png",
    sides: [
      "/images/bottle-mountain.png",
      "/images/bottle-lake.png",
      "/images/bottle-canyon.png",
      "/images/bottle-fire.png",
    ],
  },
  gallery: [
    "/images/bottle-bike.png",
    "/images/bottle-lake.png",
    "/images/bottle-water.png",
    "/images/bottle-stream.png",
    "/images/bottle-fire.png",
    "/images/bottle-snow.png",
    "/images/bottle-mountain.png",
    "/images/bottle-canyon.png",
  ],
  collection: [
    "/images/accessory-charger.png",
    "/images/accessory-sleeve.png",
    "/images/accessory-bike-mount.png",
    "/images/accessory-strap.png",
    "/images/accessory-carabiner.png",
    "/images/accessory-speaker-base.png",
  ],
  editorialBanner: "/images/3d4046a0-b072-4b07-941f-9141ee3ed4a7.png",
  statement: "/images/cd3d11c6-4891-4489-ac94-56c90a28aebe.png",
} as const
