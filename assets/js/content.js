/* ==================================================================
   ملف المحتوى — ده الملف الوحيد اللي هتعدّل فيه.

   قواعد بسيطة عشان الموقع ميبوظش:
   - كل نص ليه نسختين: en (إنجليزي) و ar (عربي).
   - النص بيتكتب بين علامتين تنصيص "هنا".
   - متمسحش الفاصلة (,) اللي في آخر كل سطر أو قوس.
   - أي سطر بيبدأ بـ // ده شرح بس، الموقع بيتجاهله.
   ================================================================== */

window.SITE = {

  /* ---------------- بياناتك الأساسية ---------------- */

  name:     { en: "Mahmoud Reda", ar: "محمود رضا" },
  role:     { en: "Independent security researcher", ar: "باحث أمني مستقل" },
  location: { en: "Egypt", ar: "مصر" },

  // الجملة الصغيرة اللي تحت اسمك. لو عايز تشيلها اكتب:  status: null,
  status: { en: "Currently hunting on HackenProof", ar: "أصطاد حاليًا على HackenProof" },

  // التعريف اللي في أول الصفحة.
  intro: {
    en: "I look for the places where a web application lets someone do more than their role allows: broken access control, business logic flaws, race conditions and authentication gaps.",
    ar: "أبحث عن المواضع التي يسمح فيها تطبيق الويب لمستخدمٍ بأن يفعل أكثر مما يسمح به دوره: ثغرات التحكم في الوصول، وعيوب منطق الأعمال، وحالات السباق، وثغرات المصادقة."
  },

  // صورتك (اختياري): ارفع الصورة جوه فولدر assets/img واكتب اسمها هنا، مثلاً "assets/img/me.jpg"
  // لو سبتها فاضية "" مش هتظهر صورة.
  photo: "",


  /* ---------------- التواصل ---------------- */

  // إيميل التواصل العام (مش إيميل حساباتك). لو سبته فاضي "" زرار الإيميل مش هيظهر.
  email: "",

  // حساباتك. أول حساب في القايمة بيظهر كزرار أساسي.
  // تقدر تضيف HackerOne أو Bugcrowd أو X بنفس الشكل بالظبط.
  links: [
    { label: "HackenProof", url: "https://hackenproof.com/hackers/Mahmoud-Reda" },
    { label: "LinkedIn",    url: "https://www.linkedin.com/in/mahmoud-reda-sec" },
    { label: "GitHub",      url: "https://github.com/mahmoud-reda1" },
    // { label: "HackerOne", url: "https://hackerone.com/YOUR-NAME" },
  ],

  // مفتاح PGP العام بتاعك: صدّره من Kleopatra كملف، ارفعه في فولدر assets
  // واكتب اسمه هنا، مثلاً "assets/pgp.asc" — هيظهر زرار "PGP key" لوحده.
  pgp: "",


  /* ---------------- المجالات اللي بتختبرها ----------------
     icon: شكل الأيقونة — اختار واحد من: access أو logic أو race أو auth
  */
  focus: [
    {
      icon: "access",
      title: { en: "Access control", ar: "التحكم في الوصول" },
      text:  { en: "Whether every role, team and organization can reach only its own data and actions.",
               ar: "هل يصل كل دور وفريق ومنظمة إلى بياناته وإجراءاته فقط، ولا شيء غيرها؟" }
    },
    {
      icon: "logic",
      title: { en: "Business logic", ar: "منطق الأعمال" },
      text:  { en: "Payments, plans, limits and multi-step flows that can be used in ways the product never intended.",
               ar: "المدفوعات والخطط والحدود والعمليات متعددة الخطوات حين تُستخدم بطرق لم يقصدها المنتج." }
    },
    {
      icon: "race",
      title: { en: "Race conditions", ar: "حالات السباق" },
      text:  { en: "Checks that hold when requests arrive one at a time, and break when they arrive together.",
               ar: "تحققات تصمد حين تصل الطلبات واحدًا تلو الآخر، وتنكسر حين تصل معًا في اللحظة نفسها." }
    },
    {
      icon: "auth",
      title: { en: "Authentication", ar: "المصادقة" },
      text:  { en: "Sessions, tokens and account recovery, and how long access really lasts after it should end.",
               ar: "الجلسات والتوكنات واستعادة الحسابات، وكم يدوم الوصول فعلًا بعد أن كان يجب أن ينتهي." }
    },
  ],


  /* ---------------- منهجيتك (خطوات بالترتيب) ---------------- */
  method: [
    {
      title: { en: "Read the rules first", ar: "أقرأ القواعد أولًا" },
      text:  { en: "Scope, exclusions, and which program owns each host. A valid finding in the wrong place earns nothing.",
               ar: "النطاق والاستثناءات، وأي برنامج يملك كل نطاق. الثغرة الصحيحة في المكان الخطأ لا تساوي شيئًا." }
    },
    {
      title: { en: "Map every role", ar: "أرسم خريطة الأدوار" },
      text:  { en: "One account for each role, a second organization for isolation, and a list of every action the product offers.",
               ar: "حساب لكل دور، ومنظمة ثانية لاختبار العزل، وقائمة بكل إجراء يتيحه المنتج." }
    },
    {
      title: { en: "Fill the matrix", ar: "أملأ المصفوفة" },
      text:  { en: "Each role against each action, with the expected result written down before the first request.",
               ar: "كل دور أمام كل إجراء، مع كتابة النتيجة المتوقعة قبل إرسال أول طلب." }
    },
    {
      title: { en: "Prove it on the server", ar: "أثبتها على الخادم" },
      text:  { en: "A button in the interface proves nothing. A control test shows the check exists and exactly where it breaks.",
               ar: "زر في الواجهة لا يثبت شيئًا. اختبار المقارنة يُظهر أن التحقق موجود وأين ينكسر بالضبط." }
    },
    {
      title: { en: "Report what's real", ar: "أبلغ عن الحقيقي فقط" },
      text:  { en: "Short reproduction steps, impact from a realistic attacker's position, and the severity a skeptical triager would agree with.",
               ar: "خطوات قصيرة لإعادة الإنتاج، وأثر من موقع مهاجم واقعي، وخطورة يوافق عليها فاحص متشكك." }
    },
  ],


  /* ---------------- المقالات ----------------
     عشان تضيف مقال جديد:
     1) اكتب المقال في ملف .md جوه فولدر writeups (شوف الدليل)
     2) زوّد عنصر هنا بنفس الشكل، والـ slug لازم يبقى نفس اسم الملف من غير .md

     slug:        اسم الملف (حروف إنجليزي صغيرة وأرقام وشرطة - بس)
     lang:        لغة المقال: "en" أو "ar"
     date:        التاريخ بالشكل ده: "2026-10-09"
     translation: الـ slug بتاع نفس المقال باللغة التانية (لو مفيش اكتب null)
  */
  writeups: [
    {
      slug: "permission-matrix",
      lang: "en",
      date: "2026-10-09",
      translation: "permission-matrix-ar",
      title: "The permission matrix: how I test access control",
      summary: "A table of roles and actions turns access control testing from guessing into a checklist.",
      tags: ["Access control", "Methodology"]
    },
    {
      slug: "permission-matrix-ar",
      lang: "ar",
      date: "2026-10-09",
      translation: "permission-matrix",
      title: "مصفوفة الصلاحيات: كيف أختبر التحكم في الوصول",
      summary: "جدول بسيط من الأدوار والإجراءات يحوّل اختبار التحكم في الوصول من تخمين إلى قائمة تحقق.",
      tags: ["التحكم في الوصول", "منهجية"]
    },
  ],


  /* ---------------- الإنجازات ----------------
     القسم ده بيظهر لوحده أول ما تضيف أول إنجاز حقيقي.
     (قوائم الشرف، المكافآت، شكر من شركة، CVE...)
     امسح الـ // من أول السطر اللي تحت وعدّله.
  */
  recognition: [
    // { year: "2026", title: { en: "Hall of Fame — Company name", ar: "قائمة الشرف — اسم الشركة" }, url: "https://..." },
  ],

};
