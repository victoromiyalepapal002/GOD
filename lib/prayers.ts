// Written prayers for visitors to read and pray along with. These are original, plain-language
// prayers, except the Lord's Prayer, which is Matthew 6:9-13 in the King James Version.
export type Prayer = { id: string; title: string; when: string; text: string };

export const LORDS_PRAYER =
  "Our Father which art in heaven, Hallowed be thy name. Thy kingdom come, Thy will be done in earth, as it is in heaven. Give us this day our daily bread. And forgive us our debts, as we forgive our debtors. And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.";

export const PRAYERS: Prayer[] = [
  {
    id: "lords",
    title: "The Lord's Prayer",
    when: "The prayer Jesus taught (Matthew 6:9-13)",
    text: LORDS_PRAYER,
  },
  {
    id: "morning",
    title: "A morning prayer",
    when: "To begin the day",
    text: "Father, thank you for this new day and for the breath in my lungs. Go before me. Guide my words, my choices and my steps. Help me to love the people I meet and to do my work well. Keep my heart close to you from morning until night. In Jesus' name, amen.",
  },
  {
    id: "evening",
    title: "An evening prayer",
    when: "To close the day",
    text: "Lord, thank you for carrying me through this day. Forgive me where I fell short, and help me forgive anyone who hurt me. I place my family, my worries and my tomorrow in your hands. Give me rest tonight and wake me with peace. In Jesus' name, amen.",
  },
  {
    id: "thanks",
    title: "A prayer of thanks",
    when: "When your heart is full",
    text: "Father, you are good, and your mercy never runs out. Thank you for life, for family, for friends, for food on the table and for every answered prayer, big and small. Teach me to notice your kindness every day and never to take it for granted. In Jesus' name, amen.",
  },
  {
    id: "forgive",
    title: "A prayer for forgiveness",
    when: "When you need a fresh start",
    text: "Lord Jesus, I come to you honestly. I have sinned in what I have done and in what I have left undone. I am sorry. Thank you that you died for me and that you forgive everyone who comes to you. Wash me clean, heal my conscience and help me walk in a new way. In your name, amen.",
  },
  {
    id: "strength",
    title: "A prayer for strength",
    when: "When life feels heavy",
    text: "God, I am tired and I cannot carry this alone. You promised to be near to the brokenhearted. Hold me up today. Give me strength for the next step, wisdom for the next choice and people who will stand with me. I trust you even when I cannot see the way. In Jesus' name, amen.",
  },
  {
    id: "healing",
    title: "A prayer for healing",
    when: "For yourself or someone you love",
    text: "Lord, you are the God who cares for the sick and the hurting. I bring before you the one who is unwell. Touch their body, calm their fear and give them patience while they heal. Be with the doctors and nurses who care for them. Whatever happens, let your peace be with us. In Jesus' name, amen.",
  },
  {
    id: "family",
    title: "A prayer for family",
    when: "For the people closest to you",
    text: "Father, bless my family. Protect each one and draw them close to you. Where there is quarrelling, bring peace. Where there is distance, bring us back together. Teach us to speak kindly, to forgive quickly and to love like you love. In Jesus' name, amen.",
  },
  {
    id: "wisdom",
    title: "A prayer for direction",
    when: "Before a big decision",
    text: "Lord, I need wisdom. You said that if we ask, you give generously. Show me what to do. Close the doors that should be closed and open the ones that should be open. Quiet my fears and help me to trust you more than my own understanding. In Jesus' name, amen.",
  },
  {
    id: "peace",
    title: "A prayer for peace",
    when: "When your mind is racing",
    text: "Prince of Peace, quiet my thoughts. I give you every worry that keeps me awake. You are bigger than all of them. Help me to breathe, to pray instead of panic, and to rest in your care. Let your peace guard my heart and my mind. In Jesus' name, amen.",
  },
];
