export interface PromptFormData {
  appType?: string;
  audience?: string;
  goal?: string;
  features?: string[];
  designStyle?: string;
  techStack?: string;
  extraRequirements?: string;
}
export function compilePrompt(data: PromptFormData | null | undefined): string {
  if (!data) {
    return "Ожидание данных для генерации ТЗ...";
  }
  const {
    appType = "Веб-приложение",
    audience = "Общие пользователи",
    goal = "Обеспечение удобного цифрового опыта",
    features = [],
    designStyle = "Чистый, современный и профессиональный",
    techStack = "Modern Full-Stack",
    extraRequirements = "",
  } = data;
  const featuresList = Array.isArray(features) && features.length > 0
    ? features.map(f => `- ${f}`).join('\n')
    : "- Стандартные CRUD операции";
  return `Действуй как Senior Software Architect и Product Manager. Составь подробное Техническое Задание (PRD) для следующего приложения:
# ОБЗОР ПРОЕКТА
- **Тип приложения:** ${appType}
- **Целевая аудитория:** ${audience}
- **Основная цель:** ${goal}
# КЛЮЧЕВЫЕ ФУНКЦИИ
${featuresList}
# ТЕХНОЛОГИЧЕСКИЙ СТЕК
- **Основные технологии:** ${techStack}
# ТРЕБОВАНИЯ К ДИЗАЙНУ И UX
- **Стиль:** ${designStyle}
- **Подход:** Приоритет доступности, адаптивности и интуитивной навигации.
${extraRequirements ? `# ОСОБЫЕ ТРЕБОВАНИЯ\n${extraRequirements}\n` : ''}
# ИНСТРУКЦИИ ПО ФОРМАТУ ВЫВОДА
Пожалуйста, предоставь структурированный документ, включающий:
1. Краткое резюме
2. Пользовательские истории (User Stories)
3. Информационную архитектуру (Схема данных)
4. Разбиение на компоненты
5. API Endpoints / Потоки данных
6. Рекомендации по безопасности и производительности
Весь вывод должен быть исключительно на русском языке. Используй чистый Markdown для форматирования.`;
}