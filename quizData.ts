export interface Question {
  id: string;
  category: "time" | "days" | "gender" | "numbers";
  questionArm: string;
  options: string[];
  correctAnswer: string;
  explanationArm: string;
  spanishAudioText: string; // The phrase to speak via TTS
}

export interface VocabularyWord {
  spanish: string;
  armenian: string;
  pronunciation: string;
  category: string;
  notes?: string;
}

export const QUIZ_CATEGORIES = [
  { id: "time", name: "Ժամանակ (Hora)", icon: "Clock", color: "from-blue-400 to-indigo-600" },
  { id: "days", name: "Շաբաթվա օրեր (Días)", icon: "Calendar", color: "from-emerald-400 to-teal-600" },
  { id: "gender", name: "Գոյականների սեռ (Género)", icon: "Sparkles", color: "from-amber-400 to-rose-600" },
  { id: "numbers", name: "Թվեր (Números)", icon: "Hash", color: "from-purple-400 to-violet-600" }
];

export const vocabularyList: VocabularyWord[] = [
  // Time
  { spanish: "¿Qué hora es?", armenian: "Ժամը քանիսն՞ է", pronunciation: "Կե օրա էս", category: "time", notes: "Հարցնելու հիմնական տարբերակը" },
  { spanish: "Es la una", armenian: "Ժամը մեկն է", pronunciation: "Էս լա ունա", category: "time", notes: "Օգտագործվում է միայն ժամը մեկի համար" },
  { spanish: "Son las tres", armenian: "Ժամը երեքն է", pronunciation: "Սոն լաս տրես", category: "time", notes: "Հոգնակի ժամերի համար (2-12) օգտագործում ենք Son las" },
  { spanish: "En punto", armenian: "Ուղիղ / Ճիշտ ժամանակին", pronunciation: "Էն պունտո", category: "time" },
  { spanish: "Y media", armenian: "Անց կես", pronunciation: "Ի մեդիա", category: "time", notes: "Օրինակ՝ Son las dos y media (երկուսն անց կես)" },
  { spanish: "Menos cuarto", armenian: "Քառորդ պակաս (տասնհինգ պակաս)", pronunciation: "Մենոս կուարտո", category: "time" },
  { spanish: "Mediodía", armenian: "Կեսօր", pronunciation: "Մեդիոդիա", category: "time" },
  { spanish: "Medianoche", armenian: "Կեսգիշեր", pronunciation: "Մեդիանոչե", category: "time" },

  // Days
  { spanish: "Lunes", armenian: "Երկուշաբթի", pronunciation: "Լունես", category: "days" },
  { spanish: "Martes", armenian: "Երեքշաբթի", pronunciation: "Մարտես", category: "days" },
  { spanish: "Miércoles", armenian: "Չորեքշաբթի", pronunciation: "Միեռկոլես", category: "days" },
  { spanish: "Jueves", armenian: "Հինգշաբթի", pronunciation: "Խուեվես", category: "days" },
  { spanish: "Viernes", armenian: "Ուրբաթ", pronunciation: "Վիեռնես", category: "days" },
  { spanish: "Sábado", armenian: "Շաբաթ", pronunciation: "Սաբադո", category: "days" },
  { spanish: "Domingo", armenian: "Կիրակի", pronunciation: "Դոմինգո", category: "days" },
  { spanish: "Fin de semana", armenian: "Շաբաթ-Կիրակի (ուիքենդ)", pronunciation: "Ֆին դե սեմանա", category: "days" },
  { spanish: "Hoy", armenian: "Այսօր", pronunciation: "Օյ", category: "days" },
  { spanish: "Mañana", armenian: "Վաղը / Առավոտ", pronunciation: "Մանյանա", category: "days" },

  // Gender
  { spanish: "El libro", armenian: "Գիրքը (արական)", pronunciation: "Էլ լիբրո", category: "gender", notes: "-o-ով ավարտվող գոյականների մեծ մասը արական է" },
  { spanish: "La casa", armenian: "Տունը (իգական)", pronunciation: "Լա կասա", category: "gender", notes: "-a-ով ավարտվող գոյականների մեծ մասը իգական է" },
  { spanish: "El sol", armenian: "Արևը (արական)", pronunciation: "Էլ սոլ", category: "gender" },
  { spanish: "La flor", armenian: "Ծաղիկը (իգական)", pronunciation: "Լա ֆլոր", category: "gender" },
  { spanish: "El agua", armenian: "Ջուրը (արական արտիկլով)", pronunciation: "Էլ ագուա", category: "gender", notes: "Բացառություն է. իգական բառ է, բայց հնչյունական պատճառով ստանում է El" },
  { spanish: "La mano", armenian: "Ձեռքը (իգական)", pronunciation: "Լա մանո", category: "gender", notes: "Բացառություն է. չնայած ավարտվում է -o-ով, իգական է" },
  { spanish: "El día", armenian: "Օրը (արական)", pronunciation: "Էլ դիա", category: "gender", notes: "Բացառություն է. չնայած ավարտվում է -a-ով, արական է" },

  // Numbers
  { spanish: "Uno", armenian: "Մեկ (1)", pronunciation: "Ունո", category: "numbers" },
  { spanish: "Cinco", armenian: "Հինգ (5)", pronunciation: "Սինկո", category: "numbers" },
  { spanish: "Diez", armenian: "Տասը (10)", pronunciation: "Դիես", category: "numbers" },
  { spanish: "Doce", armenian: "Տասներկու (12)", pronunciation: "Դոսե", category: "numbers" },
  { spanish: "Quince", armenian: "Տասնհինգ (15)", pronunciation: "Կինսե", category: "numbers" },
  { spanish: "Veinte", armenian: "Քսան (20)", pronunciation: "Վեյնտե", category: "numbers" },
  { spanish: "Cincuenta", armenian: "Հիսուն (50)", pronunciation: "Սինկուենտա", category: "numbers" },
  { spanish: "Cien", armenian: "Հարյուր (100)", pronunciation: "Սիեն", category: "numbers" },
  { spanish: "Mil", armenian: "Հազար (1000)", pronunciation: "Միլ", category: "numbers" }
];

export const questionsList: Question[] = [
  // --- TIME (Ժամանակ) ---
  {
    id: "t1",
    category: "time",
    questionArm: "Ինչպե՞ս կասեք «Ժամը մեկն է» իսպաներեն։",
    options: ["Es la una", "Son las dos", "Son las una", "Es las una"],
    correctAnswer: "Es la una",
    explanationArm: "Իսպաներենում ժամը մեկը նշելու համար օգտագործվում է եզակի ձևը՝ «Es la una», քանի որ «una»-ն (մեկ ժամը) եզակի է։",
    spanishAudioText: "Es la una"
  },
  {
    id: "t2",
    category: "time",
    questionArm: "Ինչպե՞ս է հայերեն թարգմանվում «Son las tres» արտահայտությունը։",
    options: ["Ժամը երեքն է", "Ժամը երկուսն է", "Ժամը չորսն է", "Ժամը երեքն անց կես"],
    correctAnswer: "Ժամը երեքն է",
    explanationArm: "«Tres» նշանակում է երեք։ Հոգնակի ժամերի համար (2-ից 12) օգտագործվում է «Son las»։",
    spanishAudioText: "Son las tres"
  },
  {
    id: "t3",
    category: "time",
    questionArm: "Ինչպե՞ս կլինի «կեսօր» իսպաներեն։",
    options: ["Mediodía", "Medianoche", "Tarde", "Mañana"],
    correctAnswer: "Mediodía",
    explanationArm: "«Mediodía» (medio + día) բառացի նշանակում է կես օր, այսինքն՝ կեսօր։",
    spanishAudioText: "Mediodía"
  },
  {
    id: "t4",
    category: "time",
    questionArm: "Ինչպե՞ս կասեք «Ժամը հինգն անց կես է»։",
    options: ["Son las cinco y media", "Son las cinco y cuarto", "Es la cinco y media", "Son las seis menos cuarto"],
    correctAnswer: "Son las cinco y media",
    explanationArm: "Իսպաներենում կես ժամը նշվում է «y media» (և կես) արտահայտությամբ. Son las cinco y media (հինգն անց կես)։",
    spanishAudioText: "Son las cinco y media"
  },
  {
    id: "t5",
    category: "time",
    questionArm: "Ի՞նչ է նշանակում «Son las ocho menos cuarto»։",
    options: ["Ժամը ութից տասնհինգ է պակաս (7:45)", "Ժամը ութն անց տասնհինգ է (8:15)", "Ժամը ութն է", "Ժամը իննից տասնհինգ է պակաս"],
    correctAnswer: "Ժամը ութից տասնհինգ է պակաս (7:45)",
    explanationArm: "«Menos cuarto» նշանակում է «մինուս քառորդ» (քառորդ պակաս)։ Այսինքն՝ 8-ից քառորդ պակաս, կամ 7:45։",
    spanishAudioText: "Son las ocho menos cuarto"
  },
  {
    id: "t6",
    category: "time",
    questionArm: "Ինչպե՞ս կլինի «ուղիղ ժամը տասն է»։",
    options: ["Son las diez en punto", "Son las diez de la mañana", "Es las diez en punto", "Son las diez y cuarto"],
    correctAnswer: "Son las diez en punto",
    explanationArm: "«En punto» նշանակում է «ճիշտ / ուղիղ» (բառացի՝ կետի վրա)։",
    spanishAudioText: "Son las diez en punto"
  },

  // --- DAYS (Շաբաթվա օրեր) ---
  {
    id: "d1",
    category: "days",
    questionArm: "Ինչպե՞ս կլինի «Երկուշաբթի» իսպաներեն։",
    options: ["Lunes", "Martes", "Miércoles", "Sábado"],
    correctAnswer: "Lunes",
    explanationArm: "Իսպաներենում շաբաթվա օրերը սկսվում են Lunes-ով (լուսնի օր)։",
    spanishAudioText: "Lunes"
  },
  {
    id: "d2",
    category: "days",
    questionArm: "Շաբաթվա ո՞ր օրն է «Miércoles»-ը։",
    options: ["Չորեքշաբթի", "Երեքշաբթի", "Հինգշաբթի", "Ուրբաթ"],
    correctAnswer: "Չորեքշաբթի",
    explanationArm: "«Miércoles» նշանակում է չորեքշաբթի (կապված է Մերկուրի մոլորակի հետ՝ Mercurio)։",
    spanishAudioText: "Miércoles"
  },
  {
    id: "d3",
    category: "days",
    questionArm: "Ինչպե՞ս կլինի «Ուրբաթ և Կիրակի» իսպաներեն։",
    options: ["Viernes y Domingo", "Viernes y Sábado", "Jueves y Domingo", "Lunes y Domingo"],
    correctAnswer: "Viernes y Domingo",
    explanationArm: "Ուրբաթը «Viernes» է, իսկ Կիրակին՝ «Domingo»։",
    spanishAudioText: "Viernes y Domingo"
  },
  {
    id: "d4",
    category: "days",
    questionArm: "Շաբաթվա ո՞ր օրն է «Sábado»-ն։",
    options: ["Շաբաթ", "Կիրակի", "Հինգշաբթի", "Երկուշաբթի"],
    correctAnswer: "Շաբաթ",
    explanationArm: "«Sábado» նշանակում է Շաբաթ օր։",
    spanishAudioText: "Sábado"
  },
  {
    id: "d5",
    category: "days",
    questionArm: "Ինչպե՞ս կլինի «Հինգշաբթի» իսպաներեն։",
    options: ["Jueves", "Martes", "Viernes", "Lunes"],
    correctAnswer: "Jueves",
    explanationArm: "Jueves-ը հինգշաբթին է (Յուպիտերի օրը՝ Jove/Júpiter)։",
    spanishAudioText: "Jueves"
  },
  {
    id: "d6",
    category: "days",
    questionArm: "Ի՞նչ են նշանակում «hoy» և «mañana» բառերը համապատասխանաբար։",
    options: ["Այսօր և վաղը", "Երեկ և այսօր", "Վաղը և մյուս օրը", "Առավոտ և երեկո"],
    correctAnswer: "Այսօր և վաղը",
    explanationArm: "«Hoy» նշանակում է այսօր, իսկ «mañana» նշանակում է վաղը (կամ առավոտ, կախված կոնտեքստից)։",
    spanishAudioText: "Hoy y mañana"
  },

  // --- GENDER (Գոյականների սեռ) ---
  {
    id: "g1",
    category: "gender",
    questionArm: "Ո՞րն է «casa» (տուն) բառի ճիշտ որոշյալ արտիկլը։",
    options: ["La", "El", "Lo", "Las"],
    correctAnswer: "La",
    explanationArm: "«casa» բառը իգական սեռի է, ավարտվում է «-a»-ով, ուստի ստանում է եզակի որոշյալ «la» արտիկլը։",
    spanishAudioText: "La casa"
  },
  {
    id: "g2",
    category: "gender",
    questionArm: "Ո՞րն է «libro» (գիրք) բառի ճիշտ որոշյալ արտիկլը։",
    options: ["El", "La", "Los", "Unas"],
    correctAnswer: "El",
    explanationArm: "«libro»-ն արական սեռի է, ավարտվում է «-o»-ով, ուստի ստանում է եզակի որոշյալ «el» արտիկլը։",
    spanishAudioText: "El libro"
  },
  {
    id: "g3",
    category: "gender",
    questionArm: "Ի՞նչ սեռի են «sol» (արև) և «flor» (ծաղիկ) բառերը իսպաներենում։",
    options: [
      "Sol-ը արական է, Flor-ը՝ իգական",
      "Երկուսն էլ արական են",
      "Երկուսն էլ իգական են",
      "Sol-ը իգական է, Flor-ը՝ արական"
    ],
    correctAnswer: "Sol-ը արական է, Flor-ը՝ իգական",
    explanationArm: "«El sol» արական է, իսկ «La flor» իգական է։",
    spanishAudioText: "El sol y la flor"
  },
  {
    id: "g4",
    category: "gender",
    questionArm: "Իսպաներենում «agua» (ջուր) բառը եզակի թվով ո՞ր արտիկլն է ստանում (ուշադրություն՝ բացառություն է)։",
    options: ["El", "La", "Lo", "Las"],
    correctAnswer: "El",
    explanationArm: "«Agua» բառը իգական է, բայց քանի որ այն սկսվում է շեշտված «a»-ով, հնչյունական բախումից խուսափելու համար եզակի թվով ստանում է «El» արտիկլը (El agua), թեև նրան վերագրվող ածականները մնում են իգական սեռի (օրինակ՝ El agua fría)։",
    spanishAudioText: "El agua"
  },
  {
    id: "g5",
    category: "gender",
    questionArm: "Ի՞նչ արտիկլ է ստանում «mano» (ձեռք) բառը (բացառություն է)։",
    options: ["La (La mano)", "El (El mano)", "Un (Un mano)", "Lo (Lo mano)"],
    correctAnswer: "La (La mano)",
    explanationArm: "Սա հայտնի բացառություն է։ Թեև ավարտվում է «-o»-ով, այն իգական սեռի է՝ «La mano» (ձեռքը)։",
    spanishAudioText: "La mano"
  },
  {
    id: "g6",
    category: "gender",
    questionArm: "Ի՞նչ արտիկլ է ստանում «día» (օր) բառը (բացառություն է)։",
    options: ["El (El día)", "La (La día)", "Unas (Unas día)", "Lo (Lo día)"],
    correctAnswer: "El (El día)",
    explanationArm: "«Día» բառը, թեև ավարտվում է «-a»-ով, արական սեռի հունական ծագման բացառություն է՝ «El día»։",
    spanishAudioText: "El día"
  },

  // --- NUMBERS (Թվեր) ---
  {
    id: "n1",
    category: "numbers",
    questionArm: "Ո՞ր թիվն է «cinco»-ն իսպաներեն։",
    options: ["5", "15", "50", "2"],
    correctAnswer: "5",
    explanationArm: "«Cinco» նշանակում է հինգ (5)։",
    spanishAudioText: "Cinco"
  },
  {
    id: "n2",
    category: "numbers",
    questionArm: "Ինչպե՞ս կլինի «Տասնհինգ» (15) իսպաներեն։",
    options: ["Quince", "Diez y cinco", "Cinco", "Cincuenta"],
    correctAnswer: "Quince",
    explanationArm: "11-ից 15 թվերը իսպաներենում ունեն յուրօրինակ անուններ։ 15-ը «Quince» է։",
    spanishAudioText: "Quince"
  },
  {
    id: "n3",
    category: "numbers",
    questionArm: "Ո՞ր թիվն է «veinte»-ն իսպաներեն։",
    options: ["20", "30", "12", "8"],
    correctAnswer: "20",
    explanationArm: "«Veinte» նշանակում է քսան (20):",
    spanishAudioText: "Veinte"
  },
  {
    id: "n4",
    category: "numbers",
    questionArm: "Ինչպե՞ս կասեք «Հարյուր» (100) իսպաներեն։",
    options: ["Cien", "Mil", "Diez", "Cincuenta"],
    correctAnswer: "Cien",
    explanationArm: "«Cien» նշանակում է 100։ Երբ դրան հաջորդում է այլ թիվ (օրինակ՝ 105), այն դառնում է «ciento» (օր.՝ ciento cinco)։",
    spanishAudioText: "Cien"
  },
  {
    id: "n5",
    category: "numbers",
    questionArm: "Ո՞ր թվերն են «doce»-ն և «trece»-ն համապատասխանաբար։",
    options: ["12 և 13", "2 և 3", "10 և 13", "12 և 20"],
    correctAnswer: "12 և 13",
    explanationArm: "«Doce» նշանակում է 12, իսկ «trece»՝ 13։",
    spanishAudioText: "Doce y trece"
  },
  {
    id: "n6",
    category: "numbers",
    questionArm: "Ո՞ր թիվն է «cero»-ն իսպաներեն։",
    options: ["0", "100", "10", "4"],
    correctAnswer: "0",
    explanationArm: "«Cero» նշանակում է զրո (0)։",
    spanishAudioText: "Cero"
  }
];
