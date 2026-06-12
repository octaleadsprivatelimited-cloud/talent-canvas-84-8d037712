// Unsplash photo IDs curated per service. Served via Unsplash's image CDN
// with responsive width parameters so each device only downloads what it needs.
const PHOTO_IDS: Record<string, string> = {
  "permanent-staffing": "photo-1521737711867-e3b97375f902", // team collaboration
  "contract-staffing": "photo-1556761175-5973dc0f32e7", // contract handshake
  "executive-search": "photo-1573496359142-b8d87734a5a2", // executive boardroom
  "it-recruitment": "photo-1517048676732-d65bc937f952", // engineers coding
  "non-it-recruitment": "photo-1497366216548-37526070297c", // modern office
  rpo: "photo-1521791136064-7986c2920216", // ops floor
  "rpo-workforce-solutions": "photo-1521791136064-7986c2920216", // ops floor
  "workforce-planning": "photo-1454165804606-c3d57bc86b40", // data planning
  "business-consulting": "photo-1551836022-deb4988cc6c0", // strategy meeting
  "consulting-training": "photo-1551836022-deb4988cc6c0", // strategy meeting / training
  training: "photo-1524178232363-1fb2b075b655", // training classroom
  "workforce-development": "photo-1552581234-26160f608093", // workshop
};

const FALLBACK = "photo-1521737711867-e3b97375f902";

function build(id: string, w: number) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
}

const LOCAL_ILLUSTRATIONS: Record<string, string> = {
  "contract-staffing": "/contract_staffing_illustration.png",
  "executive-search": "/executive_search_simple.png",
  "it-recruitment": "/it_recruitment_simple.png",
  "rpo-workforce-solutions": "/rpo_simple.png",
  "rpo": "/rpo_simple.png",
  "consulting-training": "/consulting_training_simple.png",
  "training": "/training_illustration.png",
};

export function getServiceImage(slug: string | null | undefined) {
  if (slug && LOCAL_ILLUSTRATIONS[slug]) {
    return {
      src: LOCAL_ILLUSTRATIONS[slug],
      srcSet: undefined,
    };
  }
  const id = (slug && PHOTO_IDS[slug]) || FALLBACK;
  return {
    src: build(id, 1200),
    srcSet: [400, 640, 960, 1200, 1600].map((w) => `${build(id, w)} ${w}w`).join(", "),
  };
}
