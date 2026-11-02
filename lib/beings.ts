// Biblical angels and fallen powers shown on the Heaven and Hell pages.
// Safe to import in client components. Every description is kept to what Scripture says,
// and notes mark where a detail is tradition or a debated reading.
import type { Realm } from "@/lib/realms";

export type BeingId =
  | "michael" | "gabriel" | "seraphim" | "cherubim"
  | "satan" | "lucifer" | "abaddon" | "beelzebub";

export type Being = {
  id: BeingId;
  realm: Realm;
  name: string;
  meaning: string;
  role: string;
  summary: string;
  refs: string;
  note?: string;
  victory?: string; // hell only: how Scripture says Christ overcame this power
  tone: string; // r,g,b used for glow colors
  question: string;
};

export const BEINGS: Being[] = [
  {
    id: "michael",
    realm: "heaven",
    name: "Michael",
    meaning: "Who is like God?",
    role: "Archangel and protector of God's people",
    summary:
      "Daniel calls him a chief prince who stands guard over Israel. Jude calls him the archangel, and Revelation shows him leading God's angels in battle against the dragon.",
    refs: "Daniel 10:13, 12:1 · Jude 1:9 · Revelation 12:7",
    tone: "232,200,120",
    question:
      "Tell me about the archangel Michael in the Bible. Separate what Scripture says from later tradition.",
  },
  {
    id: "gabriel",
    realm: "heaven",
    name: "Gabriel",
    meaning: "God is my strength",
    role: "Messenger of God",
    summary:
      "He explains Daniel's visions, announces the birth of John the Baptist to Zechariah, and brings Mary the news that she will bear Jesus.",
    refs: "Daniel 8:16, 9:21 · Luke 1:11-20, 1:26-38",
    note: "The horn is a later tradition. Scripture does not describe Gabriel with a trumpet.",
    tone: "120,190,240",
    question:
      "Tell me about the angel Gabriel in the Bible. Separate what Scripture says from later tradition.",
  },
  {
    id: "seraphim",
    realm: "heaven",
    name: "Seraphim",
    meaning: "The burning ones",
    role: "Attendants around God's throne",
    summary:
      "Isaiah saw them above the throne, each with six wings, calling “Holy, holy, holy is the Lord of hosts.” One touched his lips with a burning coal to cleanse him.",
    refs: "Isaiah 6:1-7",
    note: "Scripture names the seraphim as a group, not as individuals.",
    tone: "255,170,80",
    question:
      "Who are the seraphim in the Bible, and what did Isaiah see in Isaiah 6? Separate what Scripture says from later tradition.",
  },
  {
    id: "cherubim",
    realm: "heaven",
    name: "Cherubim",
    meaning: "Guardians of God's holiness",
    role: "Guardians of the holy places",
    summary:
      "They guard the way back to Eden with a flaming sword, are woven into the tabernacle, and in Ezekiel's vision carry God's glory, with wheels within wheels and eyes all around.",
    refs: "Genesis 3:24 · Exodus 25:18-22 · Ezekiel 1:4-28, 10:1-22",
    note: "Cherubim are named as a group. The Bible's cherubim are not the chubby babies of later art.",
    tone: "150,130,240",
    question:
      "Who are the cherubim in the Bible? Explain Genesis 3:24, the ark of the covenant and Ezekiel's vision, separating Scripture from later tradition.",
  },
  {
    id: "satan",
    realm: "hell",
    name: "Satan",
    meaning: "The adversary",
    role: "Accuser and tempter",
    summary:
      "He accuses Job before God, tempts Jesus in the wilderness, and is called the great dragon and the ancient serpent. The Bible warns that he prowls, and it is just as clear that his end is certain.",
    refs: "Job 1:6-12 · Matthew 4:1-11 · 1 Peter 5:8 · Revelation 12:9, 20:10",
    victory:
      "Christ shared our humanity to break the power of the one who held the power of death (Hebrews 2:14) and disarmed the rulers and authorities (Colossians 2:15).",
    tone: "220,60,48",
    question:
      "What does the Bible teach about Satan? Cover who he is, his limits, and how Christ defeated him, separating Scripture from later tradition.",
  },
  {
    id: "lucifer",
    realm: "hell",
    name: "Lucifer",
    meaning: "Morning star, shining one",
    role: "A name from Isaiah 14:12",
    summary:
      "Isaiah's taunt, “How you have fallen from heaven, O shining one, son of the dawn,” is spoken against the king of Babylon. Many Christians also read it as a picture of Satan's fall, and churches differ on that reading.",
    refs: "Isaiah 14:12-15 · Luke 10:18",
    victory: "Jesus said, “I saw Satan fall like lightning from heaven” (Luke 10:18).",
    tone: "255,205,120",
    question:
      "Who is Lucifer in the Bible? Explain Isaiah 14:12 in context and the different ways Christians read it.",
  },
  {
    id: "abaddon",
    realm: "hell",
    name: "Abaddon",
    meaning: "Destruction, the destroyer",
    role: "Angel of the bottomless pit",
    summary:
      "Revelation names him as king over the locusts that rise from the abyss: Abaddon in Hebrew, Apollyon in Greek. In the Old Testament, Abaddon is also a word for a place of destruction.",
    refs: "Revelation 9:1-11 · Job 26:6 · Proverbs 15:11",
    victory: "Christ says, “I hold the keys of Death and Hades” (Revelation 1:18).",
    tone: "170,110,255",
    question:
      "Who is Abaddon (Apollyon) in the Bible? Explain Revelation 9 and the Old Testament uses of the word, separating Scripture from later tradition.",
  },
  {
    id: "beelzebub",
    realm: "hell",
    name: "Beelzebub",
    meaning: "Lord of the flies (the exact meaning is debated)",
    role: "Called the prince of demons",
    summary:
      "The Pharisees accused Jesus of casting out demons by Beelzebub, the prince of demons. Jesus answered that a divided kingdom cannot stand. The name echoes Baal-zebub, the god of Ekron.",
    refs: "Matthew 12:22-29 · Mark 3:22-27 · Luke 11:15-20 · 2 Kings 1:2-3",
    victory:
      "“If it is by the Spirit of God that I cast out demons, then the kingdom of God has come upon you” (Matthew 12:28).",
    tone: "160,200,70",
    question:
      "Who is Beelzebub in the Bible? Explain Matthew 12 and the origin of the name, separating Scripture from later tradition.",
  },
];

export const SECTION: Record<Realm, { title: string; blurb: string; footnote: string }> = {
  heaven: {
    title: "Messengers and guardians",
    blurb: "Four names from the heavenly host, drawn from Scripture. Choose one to hear what the Bible says.",
    footnote: "Angels are servants of God, not to be worshipped (Hebrews 1:14, Revelation 22:8-9).",
  },
  hell: {
    title: "The fallen, and their defeat",
    blurb: "Names Scripture gives to the powers opposed to God. They are shown here to teach, not to honour.",
    footnote: "The Bible warns against seeking contact with spirits (Deuteronomy 18:10-12). Our hope is in Christ's victory.",
  },
};
