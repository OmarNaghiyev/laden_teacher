type SiteConfigShape = {
  photo: string | null;
  contacts: { phone: string; telegram: string; whatsapp: string; email: string };
  prices: {
    individual: string;
    group: string;
    lessonDuration: string;
    lessonsPerWeek: string;
    paymentPeriodWeeks: string;
  };
  trial: { durationMinutes: string; isFree: boolean; price: string };
};

export const siteConfig: SiteConfigShape = {
  photo: "/laden.jpg",

  contacts: {
    phone: "+994 70 819 73 76",
    telegram: "uroki_istorii_az",
    whatsapp: "994708197376", // только цифры: идёт в ссылку wa.me
    email: "ladensalmanova16@gmail.com",
  },

  prices: {
    individual: "220 AZN",
    group: "120 AZN",
    lessonDuration: "90",
    lessonsPerWeek: "3",
    paymentPeriodWeeks: "4",
  },

  trial: {
    durationMinutes: "30",
    isFree: true,
    price: "XX AZN", // показывается только при isFree: false
  },
};

export type SiteConfig = SiteConfigShape;
