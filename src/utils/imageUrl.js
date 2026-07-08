import aloeImage     from "../images/aloe_vera_gel.png";
import bambooImage   from "../images/bamboo_toothbrush.png";
import lavenderImage from "../images/lavender_oil.png";

const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || "http://gregoryisaac.alwaysdata.net";
const FALLBACK_IMAGE = "/images/bottle.png";
const LOCAL_PRODUCT_IMAGES = [
  aloeImage,
  "/images/matcha.png",
  "/images/scrub.png",
  FALLBACK_IMAGE,
  lavenderImage,
  bambooImage,
  `${API_ORIGIN}/static/Images/Carrot%20wash.png`,
  `${API_ORIGIN}/static/Images/Wellness_icon.png`,
  `${API_ORIGIN}/static/vitamin%20e.png`,
];

function getStableLocalImage(value = "") {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash + value.charCodeAt(index) * (index + 1)) % LOCAL_PRODUCT_IMAGES.length;
  }

  return LOCAL_PRODUCT_IMAGES[hash];
}

export function getImageFallback(product, index = 0) {
  const seed = [
    product?.id,
    product?.name,
    product?.category,
    product?.image,
    index,
  ].filter(Boolean).join("-");

  return getStableLocalImage(seed);
}

export function handleImageFallback(product, index = 0) {
  return (event) => {
    if (event.currentTarget.dataset.fallbackApplied === "true") {
      return;
    }

    const fallback = getImageFallback(product, index);

    event.currentTarget.dataset.fallbackApplied = "true";
    event.currentTarget.src = fallback;
  };
}

export function getImageUrl(image) {
  if (!image) {
    return FALLBACK_IMAGE;
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  if (image.startsWith("/")) {
    return image;
  }

  const normalizedPath = image.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_ORIGIN}/${normalizedPath}`;
}
