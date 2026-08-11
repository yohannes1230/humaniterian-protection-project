export type Language = "en" | "am";

const dictionaries = {
  en: {
    appName: "HPIS",
    dashboard: "Dashboard",
    cases: "Cases",
    familyLinks: "Family Link",
    referrals: "Referrals",
    services: "Services",
    analytics: "Analytics",
    dataQuality: "Data Quality",
    security: "Security",
    audit: "Audit Logs",
    privacy: "Privacy",
    offline: "Offline",
    ai: "AI Assistant",
    users: "Users",
    settings: "Settings",
    demo: "Demo",
    synthetic: "DEMO ENVIRONMENT - all people, cases, locations and records are fictional.",
    independent:
      "Independent portfolio project. HPIS is not affiliated with, endorsed by, or connected to the ICRC.",
    humanReview: "System suggestion only - authorized human verification required.",
    emergencyPrivacy: "Emergency Privacy Mode"
  },
  am: {
    appName: "HPIS",
    dashboard: "ዳሽቦርድ",
    cases: "የጉዳይ አስተዳደር",
    familyLinks: "የቤተሰብ ግንኙነት",
    referrals: "ሪፈራሎች",
    services: "አገልግሎቶች",
    analytics: "ትንታኔ",
    dataQuality: "የውሂብ ጥራት",
    security: "ደህንነት",
    audit: "የኦዲት መዝገቦች",
    privacy: "ግላዊነት",
    offline: "ከመስመር ውጭ",
    ai: "AI ረዳት",
    users: "ተጠቃሚዎች",
    settings: "ቅንብሮች",
    demo: "ዲሞ",
    synthetic: "የሙከራ አካባቢ - ሁሉም ሰዎች፣ ጉዳዮች እና መዝገቦች ምናባዊ ናቸው።",
    independent: "HPIS ከ ICRC ጋር የተያያዘ፣ የተደገፈ ወይም የተፈቀደ ስርዓት አይደለም።",
    humanReview: "የስርዓት ጥቆማ ብቻ - የተፈቀደ የሰው ማረጋገጫ ያስፈልጋል።",
    emergencyPrivacy: "የአስቸኳይ ግላዊነት ሁኔታ"
  }
};

export function translate(language: Language, key: keyof typeof dictionaries.en) {
  return dictionaries[language][key] ?? dictionaries.en[key];
}
