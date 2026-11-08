export type AgeGroup = "5-8" | "9-12" | "13-17";

export interface Drawing {
  id: string;
  title: string;
  firstName: string;
  age: number;
  ageGroup: AgeGroup;
  school: string;
  issue: string;
  date: string;
  description: string;
  imageUrl: string;
  rating: number; // avg 1-5
  reviewCount: number;
  top30: boolean;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  type: "Poem" | "Short Story" | "Article" | "Other";
  excerpt: string;
  issue: string;
  rating: number;
  reviewCount: number;
  top30: boolean;
  isPdf?: boolean;
}

export interface TopContributor {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  school: string;
  rating: number;
  highlightImg: string;
}

const drawingImages = [
  "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=800",
  "https://images.unsplash.com/photo-1547333590-47fae5f58d21?w=800",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
  "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800",
  "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800",
  "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800",
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800",
  "https://images.unsplash.com/photo-1582561424557-058531e8d419?w=800",
  "https://images.unsplash.com/photo-1503602642458-232111445657?w=800",
  "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800",
  "https://images.unsplash.com/photo-1560421741-50d22a0b1c41?w=800",
  "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=800",
];

const names = ["Amaya", "Rashan", "Senuli", "Tharindu", "Niduli", "Kavindi", "Aarav", "Diya", "Sahan", "Pavithra", "Nethmi", "Yasith"];
const schools = ["Royal College", "Visakha Vidyalaya", "Hindu College", "Holy Family Convent", "Ananda College", "Trinity College"];
const issues = ["Issue 46", "Issue 45", "Issue 44"];
const titles = ["My Happy Garden", "The Brave Lion", "Rainy Day Friends", "Stars Over the Sea", "Mum's Kitchen", "Robot Pet", "Festival Night", "Butterfly Dance", "Spaceship Picnic", "Grandpa's Boat", "Rainbow Bridge", "Forest Tea Party"];

export const drawings: Drawing[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `d-${i + 1}`,
  title: titles[i],
  firstName: names[i],
  age: 6 + (i % 11),
  ageGroup: i % 3 === 0 ? "5-8" : i % 3 === 1 ? "9-12" : "13-17",
  school: schools[i % schools.length],
  issue: issues[i % issues.length],
  date: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  description: "A bright little world drawn from imagination — full of joy, colour and tiny stories tucked into every corner.",
  imageUrl: drawingImages[i],
  rating: 3.5 + ((i * 0.27) % 1.5),
  reviewCount: 3 + (i % 9),
  top30: i % 4 === 0,
}));

export const stories: Story[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `s-${i + 1}`,
  title: ["The Moon's Secret", "Why Cats Purr", "My Sister, the Pirate", "A Letter to the Sun", "The Tiny Inventor", "Songs of the Mango Tree", "Wishes & Whales", "The Lost Crayon"][i],
  author: names[i],
  type: (["Poem", "Short Story", "Article", "Other"] as const)[i % 4],
  excerpt: "Once upon a quiet evening, when the world was painted in honey-gold light, a little voice whispered...",
  issue: issues[i % issues.length],
  rating: 3.8 + ((i * 0.19) % 1.2),
  reviewCount: 2 + (i % 7),
  top30: i % 3 === 0,
}));

export const topContributors: TopContributor[] = [
  { id: "t1", name: "Senuli P.", ageGroup: "5-8", school: "Visakha Vidyalaya", rating: 4.9, highlightImg: drawingImages[2] },
  { id: "t2", name: "Tharindu R.", ageGroup: "9-12", school: "Royal College", rating: 4.8, highlightImg: drawingImages[5] },
  { id: "t3", name: "Pavithra S.", ageGroup: "13-17", school: "Trinity College", rating: 4.7, highlightImg: drawingImages[9] },
];

export const activeIssue = {
  name: "Issue 47",
  deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12 + 1000 * 60 * 60 * 5).toISOString(),
};
