export const LANGS = ["ru", "az"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "ru";

export function isLang(value: string | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}

// Без `as const`: иначе литеральные типы не дадут описать az тем же типом.
const ru = {
  meta: {
    title: "Ладен - репетитор по истории",
    description:
      "Индивидуальные и групповые занятия по всеобщей истории и истории Азербайджана. Онлайн и офлайн. Школьники, студенты, взрослые.",
    langName: "Русский",
    otherLangName: "Azərbaycanca",
  },

  teacherName: "Ладен Салман",

  nav: {
    about: "О преподавателе",
    formats: "Форматы и цены",
    schedule: "Свободное время",
    apply: "Записаться",
    contacts: "Контакты",
    switchLang: "Перейти на азербайджанскую версию",
  },

  hero: {
    role: "Репетитор по истории",
    subjects: "Всеобщая история и история Азербайджана",
    intro:
      "Готовлю школьников, студентов и взрослых: от школьной программы до подготовки к экзаменам. Занятия строю на понимании логики событий, а не на заучивании дат - так материал остаётся в голове надолго.",
    intro2:
      "Работаю индивидуально и в небольших группах, онлайн и очно. Начинаем с короткого пробного занятия, чтобы определить уровень и составить план.",
    cta: "Оставить заявку",
    ctaSecondary: "Посмотреть свободное время",
  },

  formats: {
    title: "Форматы и цены",
    lead: "Занятия проходят до {lessonsPerWeek} раз в неделю, продолжительность одного занятия - {lessonDuration} минут. Расписание согласовываем индивидуально, оплата раз в {paymentPeriodLessons} уроков.",
    individual: {
      title: "Индивидуально",
      description:
        "Программа и темп полностью под ученика. Максимум внимания, разбор ошибок и домашних заданий на каждом занятии.",
      priceLabel: "Цена за занятие",
    },
    group: {
      title: "В группе",
      description:
        "Небольшие группы близкого уровня. Обсуждения, работа в парах и совместный разбор сложных тем.",
      priceLabel: "Цена за занятие с человека",
    },
    modes: {
      title: "Онлайн или очно",
      description:
        "Онлайн - по видеосвязи с материалами на экране. Очно - место и условия обсуждаем отдельно.",
    },
    trial: {
      badge: "Первое занятие",
      title: "Пробное занятие - {minutes} минут",
      free: "Бесплатно",
      paid: "Стоимость - {price}",
      description:
        "Знакомимся, проверяем текущий уровень знаний и определяем цель. По итогам я предлагаю план занятий и формат. Никаких обязательств продолжать.",
    },
  },

  schedule: {
    title: "Свободное время",
    lead: "Это ориентировочные интервалы, в которые я обычно свободна.Точное время мы согласуем в переписке.",
    empty: "Расписание пока не заполнено. Оставьте заявку, и мы согласуем время в переписке.",
    freeLabel: "Свободно",
    noTime: "—",
    modes: {
      online: "онлайн",
      offline: "очно",
      both: "онлайн / очно",
    },
    weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    weekdaysLong: [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ],
  },

  form: {
    title: "Заявка на занятия",
    lead: "Заполните форму - я свяжусь с вами, чтобы обсудить детали и назначить пробное занятие. Регистрация не нужна.",
    required: "обязательное поле",
    optional: "необязательно",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    successTitle: "Заявка отправлена",
    successText:
      "Спасибо! Я получила вашу заявку и свяжусь с вами по указанному контакту.",
    successAgain: "Отправить ещё одну заявку",
    errorTitle: "Не удалось отправить заявку",
    errorGeneric:
      "Что-то пошло не так. Попробуйте ещё раз или напишите мне напрямую - контакты ниже.",
    fields: {
      name: {
        label: "Имя",
        placeholder: "Как к вам обращаться",
      },
      contact: {
        label: "Контакт для связи",
        hint: "Телефон, Telegram или WhatsApp - как вам удобнее",
        placeholder: "+994 XX XXX XX XX или @username",
      },
      status: {
        label: "Кто будет учиться",
        options: {
          pupil: "Школьник",
          student: "Студент",
          adult: "Взрослый",
          other: "Другое",
        },
      },
      grade: {
        label: "Класс",
        placeholder: "Выберите класс",
        suffix: "класс",
      },
      studiedBefore: {
        label: "Занимались историей раньше?",
        yes: "Да",
        no: "Нет",
      },
      studiedDetails: {
        label: "Что проходили, какой уровень",
        placeholder: "Например: школьный курс до 9 класса, готовились к экзамену",
      },
      level: {
        label: "Уровень знаний",
        placeholder: "Выберите уровень",
        options: {
          beginner: "Начальный",
          intermediate: "Средний",
          advanced: "Продвинутый",
        },
      },
      goal: {
        label: "Цель обучения",
        placeholder: "Выберите цель",
        options: {
          school: "Школьная программа",
          exam: "Подготовка к экзамену / абитуриент",
          self: "Для себя, общее развитие",
          other: "Другое",
        },
      },
      goalOther: {
        label: "Опишите цель",
        placeholder: "Ваша цель занятий",
      },
      format: {
        label: "Формат занятий",
        placeholder: "Выберите формат",
        options: {
          individual_offline: "Индивидуально, очно",
          individual_online: "Индивидуально, онлайн",
          group_offline: "В группе, очно",
          group_online: "В группе, онлайн",
        },
      },
      preferredTime: {
        label: "Удобное время и дни",
        hint: "Ориентируйтесь на блок «Свободное время» выше",
        placeholder: "Например: вторник и четверг после 17:00",
      },
      comment: {
        label: "Комментарий",
        placeholder: "Всё, что важно знать заранее",
      },
    },
    errors: {
      name: "Укажите имя",
      contact: "Укажите контакт для связи",
      status: "Выберите, кто будет учиться",
      grade: "Укажите класс",
      level: "Выберите уровень знаний",
      goal: "Выберите цель обучения",
      goalOther: "Опишите цель обучения",
      format: "Выберите формат занятий",
      studiedDetails: "Коротко напишите, что проходили",
      tooLong: "Слишком длинный текст",
    },
  },

  contacts: {
    title: "Контакты",
    lead: "Можно написать напрямую - отвечаю в течение дня.",
    phone: "Телефон",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    email: "Email",
    write: "Написать",
    call: "Позвонить",
  },

  footer: {
    rights: "Ладен · Репетитор по истории",
    adminLink: "Вход для преподавателя",
  },

  admin: {
    loginTitle: "Вход в панель",
    loginLead: "Введите пароль преподавателя.",
    password: "Пароль",
    login: "Войти",
    loggingIn: "Проверяем…",
    wrongPassword: "Неверный пароль",
    notConfigured:
      "ADMIN_PASSWORD не настроен на сервере. Задайте переменную окружения.",
    logout: "Выйти",
    tabs: {
      applications: "Заявки",
      availability: "Свободное время",
    },
    applications: {
      title: "Заявки",
      empty: "Заявок пока нет.",
      total: "Всего заявок: {count}",
      pendingCount: "В ожидании: {count}",
      filterAll: "Все",
      filterPending: "В ожидании",
      filterProcessed: "Обработанные",
      columns: {
        date: "Дата",
        name: "Имя",
        contact: "Контакт",
        who: "Кто учится",
        level: "Уровень",
        goal: "Цель",
        format: "Формат",
        time: "Удобное время",
        comment: "Комментарий",
        experience: "Опыт",
        status: "Статус",
      },
      statusPending: "В ожидании",
      statusProcessed: "Обработана",
      markProcessed: "Отметить обработанной",
      markPending: "Вернуть в ожидание",
      saving: "Сохраняем…",
      saveError: "Не удалось сохранить. Попробуйте ещё раз.",
      studiedYes: "Занимался(-ась) раньше",
      studiedNo: "Раньше не занимался(-ась)",
      details: "Подробнее",
    },
    availability: {
      title: "Свободное время",
      lead: "Отметьте дни недели и интервалы, когда вы в целом свободны. Это отображается в публичном календаре как ориентир для учеников.",
      addTitle: "Добавить интервал",
      weekday: "День недели",
      from: "С",
      to: "До",
      mode: "Формат",
      note: "Заметка",
      notePlaceholder: "Необязательно, например «только 9-11 класс»",
      add: "Добавить",
      adding: "Добавляем…",
      remove: "Удалить",
      removing: "Удаляем…",
      empty: "Интервалов пока нет.",
      errorRange: "Время «до» должно быть позже времени «с».",
      errorGeneric: "Не удалось сохранить. Попробуйте ещё раз.",
      modes: {
        online: "Онлайн",
        offline: "Очно",
        both: "Онлайн / очно",
      },
    },
  },
};

const az: typeof ru = {
  meta: {
    title: "Laden Salman - tarix müəllimi",
    description:
      "Ümumi tarix və Azərbaycan tarixi üzrə fərdi və qrup dərsləri. Onlayn və əyani. Şagirdlər, tələbələr, böyüklər.",
    langName: "Azərbaycanca",
    otherLangName: "Русский",
  },

  teacherName: "Laden Salman",

  nav: {
    about: "Müəllim haqqında",
    formats: "Format və qiymətlər",
    schedule: "Boş vaxtlar",
    apply: "Müraciət et",
    contacts: "Əlaqə",
    switchLang: "Rus versiyasına keç",
  },

  hero: {
    role: "Tarix üzrə repetitor",
    subjects: "Ümumi tarix və Azərbaycan tarixi",
    intro:
      "Şagirdləri, tələbələri və böyükləri hazırlayıram: məktəb proqramından imtahan hazırlığına qədər. Dərsləri tarixləri əzbərləmək üzərində deyil, hadisələrin məntiqini anlamaq üzərində qururam - belə olanda material uzun müddət yadda qalır.",
    intro2:
      "Fərdi və kiçik qruplarda, onlayn və əyani işləyirəm. Səviyyəni müəyyən etmək və plan qurmaq üçün qısa sınaq dərsindən başlayırıq.",
    cta: "Müraciət göndər",
    ctaSecondary: "Boş vaxtlara bax",
  },

  formats: {
    title: "Format və qiymətlər",
    lead: "Dərslər həftədə {lessonsPerWeek} dəfəyə qədər keçirilir, bir dərsin müddəti {lessonDuration} dəqiqədir. Cədvəli fərdi olaraq razılaşdırırıq, ödəniş hər {paymentPeriodLessons} dərsdən bir edilir.",
    individual: {
      title: "Fərdi",
      description:
        "Proqram və temp tamamilə şagirdə uyğunlaşdırılır. Maksimum diqqət, hər dərsdə səhvlərin və ev tapşırığının təhlili.",
      priceLabel: "Bir dərsin qiyməti",
    },
    group: {
      title: "Qrupda",
      description:
        "Səviyyəsi yaxın olan kiçik qruplar. Müzakirələr, cütlükdə iş və mürəkkəb mövzuların birlikdə təhlili.",
      priceLabel: "Bir nəfər üçün dərsin qiyməti",
    },
    modes: {
      title: "Onlayn və ya əyani",
      description:
        "Onlayn - video əlaqə ilə, materiallar ekranda. Əyani - yer və şərtləri ayrıca müzakirə edirik.",
    },
    trial: {
      badge: "İlk dərs",
      title: "Sınaq dərsi - {minutes} dəqiqə",
      free: "Ödənişsiz",
      paid: "Qiyməti - {price}",
      description:
        "Tanış oluruq, mövcud bilik səviyyəsini yoxlayırıq və məqsədi müəyyənləşdiririk. Nəticəyə görə dərs planı və format təklif edirəm. Davam etmək üçün heç bir öhdəlik yoxdur.",
    },
  },

  schedule: {
    title: "Boş vaxtlar",
    lead: "Bunlar adətən boş olduğum təxmini intervallardır. Bu rezervasiya deyil: uyğun vaxtı seçib müraciətdə qeyd edin - dəqiq vaxtı yazışmada razılaşdıracağıq.",
    empty: "Cədvəl hələ doldurulmayıb. Müraciət göndərin, vaxtı yazışmada razılaşdıraq.",
    freeLabel: "Boşdur",
    noTime: "—",
    modes: {
      online: "onlayn",
      offline: "əyani",
      both: "onlayn / əyani",
    },
    weekdaysShort: ["B.e", "Ç.a", "Ç", "C.a", "C", "Ş", "B"],
    weekdaysLong: [
      "Bazar ertəsi",
      "Çərşənbə axşamı",
      "Çərşənbə",
      "Cümə axşamı",
      "Cümə",
      "Şənbə",
      "Bazar",
    ],
  },

  form: {
    title: "Dərslər üçün müraciət",
    lead: "Formanı doldurun - detalları müzakirə etmək və sınaq dərsi təyin etmək üçün sizinlə əlaqə saxlayacağam. Qeydiyyat tələb olunmur.",
    required: "vacib xana",
    optional: "istəyə bağlı",
    submit: "Müraciəti göndər",
    submitting: "Göndərilir…",
    successTitle: "Müraciət göndərildi",
    successText:
      "Təşəkkür edirəm! Müraciətinizi aldım və göstərdiyiniz əlaqə vasitəsilə sizinlə əlaqə saxlayacağam.",
    successAgain: "Yenə müraciət göndər",
    errorTitle: "Müraciəti göndərmək alınmadı",
    errorGeneric:
      "Nəsə səhv getdi. Yenidən cəhd edin və ya mənə birbaşa yazın - əlaqə məlumatları aşağıdadır.",
    fields: {
      name: {
        label: "Ad",
        placeholder: "Sizə necə müraciət edim",
      },
      contact: {
        label: "Əlaqə vasitəsi",
        hint: "Telefon, Telegram və ya WhatsApp - sizə hansı rahatdır",
        placeholder: "+994 XX XXX XX XX və ya @username",
      },
      status: {
        label: "Kim oxuyacaq",
        options: {
          pupil: "Şagird",
          student: "Tələbə",
          adult: "Böyük",
          other: "Digər",
        },
      },
      grade: {
        label: "Sinif",
        placeholder: "Sinfi seçin",
        suffix: "sinif",
      },
      studiedBefore: {
        label: "Əvvəl tarixlə məşğul olmusunuz?",
        yes: "Bəli",
        no: "Xeyr",
      },
      studiedDetails: {
        label: "Nə keçmisiniz, hansı səviyyə",
        placeholder: "Məsələn: 9-cu sinfə qədər məktəb kursu, imtahana hazırlaşırdım",
      },
      level: {
        label: "Bilik səviyyəsi",
        placeholder: "Səviyyəni seçin",
        options: {
          beginner: "Başlanğıc",
          intermediate: "Orta",
          advanced: "Yüksək",
        },
      },
      goal: {
        label: "Öyrənmə məqsədi",
        placeholder: "Məqsədi seçin",
        options: {
          school: "Məktəb proqramı",
          exam: "İmtahana hazırlıq / abituriyent",
          self: "Özüm üçün, ümumi inkişaf",
          other: "Digər",
        },
      },
      goalOther: {
        label: "Məqsədi yazın",
        placeholder: "Dərslərdən məqsədiniz",
      },
      format: {
        label: "Dərs formatı",
        placeholder: "Formatı seçin",
        options: {
          individual_offline: "Fərdi, əyani",
          individual_online: "Fərdi, onlayn",
          group_offline: "Qrupda, əyani",
          group_online: "Qrupda, onlayn",
        },
      },
      preferredTime: {
        label: "Rahat vaxt və günlər",
        hint: "Yuxarıdaki «Boş vaxtlar» bölməsinə baxın",
        placeholder: "Məsələn: çərşənbə axşamı və cümə axşamı 17:00-dan sonra",
      },
      comment: {
        label: "Qeyd",
        placeholder: "Əvvəlcədən bilməyim vacib olan hər şey",
      },
    },
    errors: {
      name: "Adı yazın",
      contact: "Əlaqə vasitəsini yazın",
      status: "Kimin oxuyacağını seçin",
      grade: "Sinfi seçin",
      level: "Bilik səviyyəsini seçin",
      goal: "Öyrənmə məqsədini seçin",
      goalOther: "Öyrənmə məqsədini yazın",
      format: "Dərs formatını seçin",
      studiedDetails: "Qısaca nə keçdiyinizi yazın",
      tooLong: "Mətn çox uzundur",
    },
  },

  contacts: {
    title: "Əlaqə",
    lead: "Birbaşa yaza bilərsiniz - gün ərzində cavab verirəm.",
    phone: "Telefon",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    email: "Email",
    write: "Yaz",
    call: "Zəng et",
  },

  footer: {
    rights: "Laden Salman · Tarix üzrə repetitor",
    adminLink: "Müəllim üçün giriş",
  },

  admin: {
    loginTitle: "Panelə giriş",
    loginLead: "Müəllim parolunu daxil edin.",
    password: "Parol",
    login: "Daxil ol",
    loggingIn: "Yoxlanılır…",
    wrongPassword: "Parol yanlışdır",
    notConfigured:
      "Serverdə ADMIN_PASSWORD təyin edilməyib. Mühit dəyişənini əlavə edin.",
    logout: "Çıxış",
    tabs: {
      applications: "Müraciətlər",
      availability: "Boş vaxtlar",
    },
    applications: {
      title: "Müraciətlər",
      empty: "Hələ müraciət yoxdur.",
      total: "Ümumi müraciət: {count}",
      pendingCount: "Gözləyən: {count}",
      filterAll: "Hamısı",
      filterPending: "Gözləyən",
      filterProcessed: "İşlənmiş",
      columns: {
        date: "Tarix",
        name: "Ad",
        contact: "Əlaqə",
        who: "Kim oxuyur",
        level: "Səviyyə",
        goal: "Məqsəd",
        format: "Format",
        time: "Rahat vaxt",
        comment: "Qeyd",
        experience: "Təcrübə",
        status: "Status",
      },
      statusPending: "Gözləyir",
      statusProcessed: "İşlənmişdir",
      markProcessed: "İşlənmiş kimi qeyd et",
      markPending: "Gözləyənə qaytar",
      saving: "Yadda saxlanılır…",
      saveError: "Yadda saxlamaq alınmadı. Yenidən cəhd edin.",
      studiedYes: "Əvvəl məşğul olub",
      studiedNo: "Əvvəl məşğul olmayıb",
      details: "Ətraflı",
    },
    availability: {
      title: "Boş vaxtlar",
      lead: "Ümumiyyətlə boş olduğunuz həftə günlərini və intervalları qeyd edin. Bu, şagirdlər üçün istiqamət kimi ictimai təqvimdə görünür.",
      addTitle: "İnterval əlavə et",
      weekday: "Həftənin günü",
      from: "-dan",
      to: "-dək",
      mode: "Format",
      note: "Qeyd",
      notePlaceholder: "İstəyə bağlı, məsələn «yalnız 9-11-ci sinif»",
      add: "Əlavə et",
      adding: "Əlavə edilir…",
      remove: "Sil",
      removing: "Silinir…",
      empty: "Hələ interval yoxdur.",
      errorRange: "«-dək» vaxtı «-dan» vaxtından sonra olmalıdır.",
      errorGeneric: "Yadda saxlamaq alınmadı. Yenidən cəhd edin.",
      modes: {
        online: "Onlayn",
        offline: "Əyani",
        both: "Onlayn / əyani",
      },
    },
  },
};

const dictionaries = { ru, az } as const;

export type Dict = typeof ru;

export function getDict(lang: Lang): Dict {
  return dictionaries[lang];
}

/** Подстановка {placeholder}. */
export function t(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function otherLang(lang: Lang): Lang {
  return lang === "ru" ? "az" : "ru";
}
