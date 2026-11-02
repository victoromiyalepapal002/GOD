// Public config for the Heaven and Hell pages (safe to import in client components).
export type Realm = "heaven" | "hell";

export const REALMS: Record<
  Realm,
  { title: string; tagline: string; placeholder: string; greeting: string; topics: string[] }
> = {
  heaven: {
    title: "Heaven",
    tagline: "What the Bible says about the place God is preparing, and the hope that goes with it.",
    placeholder: "Ask anything about heaven…",
    greeting: "Choose a question below, or ask your own.",
    topics: [
      "Take me on a guided walk through heaven",
      "What does the Bible say about heaven?",
      "What is the New Jerusalem like?",
      "Will I recognise my loved ones in heaven?",
      "What will we do in heaven?",
      "Is heaven in the sky, or a new earth?",
      "Who are the angels in the Bible?",
    ],
  },
  hell: {
    title: "Hell",
    tagline: "A sober, honest look at what the Bible teaches about judgment, and the mercy that meets it.",
    placeholder: "Ask anything about hell…",
    greeting: "Choose a question below, or ask your own.",
    topics: [
      "What does the Bible say about hell?",
      "What did Jesus teach about hell?",
      "Do Christians agree about hell? Compare the main views",
      "Why would a loving God allow hell?",
      "How does grace save us from judgment?",
      "Who are the demons in the Bible?",
      "I am afraid I am not saved. Help me.",
    ],
  },
};
