// Verse of the day. The King James Version (public domain) text is built in, so this page
// never depends on an outside service. A different verse is chosen for each date.

export type DailyVerse = { ref: string; book: string; chapter: number; text: string; theme: string };

// [book, chapter, verses, text, theme]
const LIST: [string, number, string, string, string][] = [
  ["John", 3, "16", "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", "God's love"],
  ["Psalms", 23, "1-3", "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.", "Trust"],
  ["Philippians", 4, "13", "I can do all things through Christ which strengtheneth me.", "Strength"],
  ["Jeremiah", 29, "11", "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", "Hope"],
  ["Proverbs", 3, "5-6", "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.", "Guidance"],
  ["Isaiah", 41, "10", "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", "Courage"],
  ["Romans", 8, "28", "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", "Purpose"],
  ["Matthew", 11, "28", "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", "Rest"],
  ["Joshua", 1, "9", "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.", "Courage"],
  ["Psalms", 46, "1", "God is our refuge and strength, a very present help in trouble.", "Protection"],
  ["Psalms", 27, "1", "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?", "Light"],
  ["Psalms", 121, "1-2", "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth.", "Help"],
  ["Isaiah", 40, "31", "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", "Renewal"],
  ["Romans", 12, "2", "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.", "Transformation"],
  ["Galatians", 2, "20", "I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.", "New life"],
  ["2 Timothy", 1, "7", "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.", "Courage"],
  ["1 Corinthians", 13, "4-7", "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.", "Love"],
  ["Hebrews", 11, "1", "Now faith is the substance of things hoped for, the evidence of things not seen.", "Faith"],
  ["Hebrews", 13, "8", "Jesus Christ the same yesterday, and to day, and for ever.", "Faithfulness"],
  ["James", 1, "5", "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.", "Wisdom"],
  ["1 Peter", 5, "7", "Casting all your care upon him; for he careth for you.", "Comfort"],
  ["Matthew", 6, "33", "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", "Priorities"],
  ["Matthew", 5, "16", "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.", "Light"],
  ["Lamentations", 3, "22-23", "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.", "Mercy"],
  ["Psalms", 34, "8", "O taste and see that the LORD is good: blessed is the man that trusteth in him.", "Goodness"],
  ["Psalms", 119, "105", "Thy word is a lamp unto my feet, and a light unto my path.", "God's Word"],
  ["Proverbs", 16, "3", "Commit thy works unto the LORD, and thy thoughts shall be established.", "Work"],
  ["Micah", 6, "8", "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?", "Justice"],
  ["Deuteronomy", 31, "6", "Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.", "God with us"],
  ["Romans", 5, "8", "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", "Salvation"],
  ["Ephesians", 2, "8-9", "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.", "Grace"],
  ["John", 14, "6", "Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", "Jesus"],
  ["John", 14, "27", "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.", "Peace"],
  ["John", 15, "5", "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.", "Abiding"],
  ["2 Corinthians", 5, "17", "Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.", "New life"],
  ["2 Corinthians", 12, "9", "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.", "Grace"],
  ["Philippians", 4, "6-7", "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", "Peace"],
  ["Colossians", 3, "23", "And whatsoever ye do, do it heartily, as to the Lord, and not unto men;", "Work"],
  ["1 Thessalonians", 5, "16-18", "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.", "Thanksgiving"],
  ["Psalms", 37, "4-5", "Delight thyself also in the LORD; and he shall give thee the desires of thine heart. Commit thy way unto the LORD; trust also in him; and he shall bring it to pass.", "Trust"],
  ["Psalms", 91, "1-2", "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.", "Protection"],
  ["Psalms", 139, "14", "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.", "Identity"],
  ["Romans", 15, "13", "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost.", "Hope"],
  ["1 John", 4, "19", "We love him, because he first loved us.", "Love"],
  ["1 John", 1, "9", "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.", "Forgiveness"],
  ["Revelation", 21, "4", "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.", "Hope"],
  ["Psalms", 51, "10", "Create in me a clean heart, O God; and renew a right spirit within me.", "Renewal"],
  ["Isaiah", 26, "3", "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.", "Peace"],
  ["Nahum", 1, "7", "The LORD is good, a strong hold in the day of trouble; and he knoweth them that trust in him.", "Protection"],
  ["Matthew", 28, "20", "Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.", "God with us"],
  ["Mark", 11, "24", "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.", "Prayer"],
  ["Luke", 1, "37", "For with God nothing shall be impossible.", "Faith"],
  ["John", 8, "12", "Then spake Jesus again unto them, saying, I am the light of the world: he that followeth me shall not walk in darkness, but shall have the light of life.", "Light"],
  ["John", 10, "10", "The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.", "Life"],
  ["Acts", 1, "8", "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.", "Purpose"],
  ["Romans", 10, "9", "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.", "Salvation"],
  ["Galatians", 6, "9", "And let us not be weary in well doing: for in due season we shall reap, if we faint not.", "Perseverance"],
  ["Ephesians", 6, "10", "Finally, my brethren, be strong in the Lord, and in the power of his might.", "Strength"],
  ["James", 4, "8", "Draw nigh to God, and he will draw nigh to you. Cleanse your hands, ye sinners; and purify your hearts, ye double minded.", "Closeness to God"],
  ["Psalms", 30, "5", "For his anger endureth but a moment; in his favour is life: weeping may endure for a night, but joy cometh in the morning.", "Joy"],
  ["Psalms", 100, "4-5", "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name. For the LORD is good; his mercy is everlasting; and his truth endureth to all generations.", "Praise"],
  ["Proverbs", 18, "10", "The name of the LORD is a strong tower: the righteous runneth into it, and is safe.", "Protection"],
  ["Zephaniah", 3, "17", "The LORD thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest thee in his love, he will joy over thee with singing.", "God's delight"],
  ["Psalms", 19, "14", "Let the words of my mouth, and the meditation of my heart, be acceptable in thy sight, O LORD, my strength, and my redeemer.", "Prayer"],
];

export const VERSE_COUNT = LIST.length;

// date is "YYYY-MM-DD". The same date always gives the same verse.
export function verseForDate(date: string): DailyVerse {
  const [y, m, d] = date.split("-").map(Number);
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  const [book, chapter, range, text, theme] = LIST[((day % LIST.length) + LIST.length) % LIST.length];
  const shown = book === "Psalms" ? "Psalm" : book;
  return { ref: `${shown} ${chapter}:${range}`, book, chapter, text, theme };
}
