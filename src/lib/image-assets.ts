// Centralized image sources so we don't rely on missing local asset files.
// These are curated, realistic photographs (consistent crop + tone).

export const logoDataUri =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A//www.w3.org/2000/svg'%20width%3D'256'%20height%3D'256'%20viewBox%3D'0%200%20256%20256'%3E%3Cdefs%3E%3CradialGradient%20id%3D'g'%20cx%3D'30%25'%20cy%3D'30%25'%20r%3D'80%25'%3E%3Cstop%20offset%3D'0%25'%20stop-color%3D'%23ff4fd8'/%3E%3Cstop%20offset%3D'55%25'%20stop-color%3D'%238a5cff'/%3E%3Cstop%20offset%3D'100%25'%20stop-color%3D'%2327d2ff'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect%20x%3D'12'%20y%3D'12'%20width%3D'232'%20height%3D'232'%20rx%3D'56'%20fill%3D'url(%23g)'/%3E%3Cpath%20d%3D'M92%20170V86c0-6.6%205.4-12%2012-12h48c6.6%200%2012%205.4%2012%2012v84c0%206.6-5.4%2012-12%2012h-48c-6.6%200-12-5.4-12-12zm24-64c0%2013.3%2010.7%2024%2024%2024s24-10.7%2024-24-10.7-24-24-24-24%2010.7-24%2024z'%20fill%3D'white'%20fill-opacity%3D'.92'/%3E%3C/svg%3E";

// Album/cover style photos: real photography, minimal “AI gloss”, square-friendly.
export const coverUrls = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&h=800&q=80",
];

// Artist portraits: natural skin tones, shallow depth-of-field.
export const artistUrls = [
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=800&h=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&h=800&q=80",
];

// Small, stable demo audio (used when a reel doesn't provide an audio URL yet).
export const demoAudioUrl = "https://www.kozco.com/tech/piano2-CoolEdit.mp3";

