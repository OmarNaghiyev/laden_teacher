/**
 * ============================================================================
 *  ⚠️  ЗАПОЛНИТЬ РЕАЛЬНЫМИ ДАННЫМИ / REAL DATA GOES HERE
 * ============================================================================
 *  Это единственный файл, который нужно отредактировать, чтобы указать
 *  контакты и цены. Все значения ниже — плейсхолдеры.
 *
 *  Bu fayl əlaqə məlumatları və qiymətlər üçündür. Aşağıdaki dəyərlər
 *  müvəqqətidir (placeholder).
 * ============================================================================
 */

type SiteConfigShape = {
  photo: string | null;
  contacts: { phone: string; telegram: string; whatsapp: string; email: string };
  prices: {
    individual: string;
    group: string;
    lessonDuration: string;
    lessonsPerWeek: string;
  };
  trial: { durationMinutes: string; isFree: boolean; price: string };
};

export const siteConfig: SiteConfigShape = {
  /**
   * Фото учителя. Положите файл в папку /public (например public/laden.jpg)
   * и укажите здесь путь: "/laden.jpg". Пока значение null — вместо фото
   * показывается заглушка с первой буквой имени.
   */
  photo: null,

  contacts: {
    /** TODO: реальный номер, например "+994 50 123 45 67" */
    phone: "+994 70 819 73 76",
    /** TODO: username без @, например "laden_history" */
    telegram: "uroki_istorii_az",
    /** TODO: номер в международном формате без пробелов и "+", например "994501234567" */
    whatsapp: "994708197376",
    /** TODO: реальный email */
    email: "ladensalmanova16@gmail.com",
  },

  prices: {
    /** TODO: цена индивидуального занятия */
    individual: "220 AZN",
    /** TODO: цена занятия в группе (за человека) */
    group: "120 AZN",
    /** Длительность обычного занятия */
    lessonDuration: "90",
    /** Максимум занятий в неделю */
    lessonsPerWeek: "3",
  },

  trial: {
    /** Длительность пробного занятия, минут */
    durationMinutes: "30",
    /**
     * TODO: уточнить у Ладен.
     * true  — пробное занятие бесплатное
     * false — платное, тогда заполните trial.price
     */
    isFree: true,
    /** Используется только если isFree === false */
    price: "XX AZN",
  },
};

export type SiteConfig = SiteConfigShape;
