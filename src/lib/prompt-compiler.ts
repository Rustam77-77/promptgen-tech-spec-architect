export interface PromptFormData {
  appType: string;
  audience: string;
  goal: string;
  features: string[];
  designStyle: string;
  techStack: string;
  extraRequirements: string;
}
export function compilePrompt(data: PromptFormData): string {
  const {
    appType,
    audience,
    goal,
    features,
    designStyle,
    techStack,
    extraRequirements,
  } = data;
  const featuresList = features.length > 0
    ? features.map(f => `- ${f}`).join('\n')
    : "- Стандартные CRUD операции";
  return `Действуй как Senior Software Architect и Product Manager. Составь подробное Техническое Задание (PRD) для следующего приложения:
# ОБЗОР ПРОЕКТА
- **Тип приложения:** ${appType || 'Веб-приложение'}
- **Целевая аудитория:** ${audience || 'Общие пользователи'}
- **Основная цель:** ${goal || 'Обеспечение удобного цифрового опыта'}
# КЛЮЧЕВЫЕ ФУНКЦИИ
${featuresList}
# ТЕХНОЛОГИЧЕСКИЙ СТЕК
- **Основные технологии:** ${techStack || 'Modern Full-Stack'}
# ТРЕБОВАНИЯ К ДИЗАЙНУ И UX
- **Стиль:** ${designStyle || 'Чистый, современный и профессиональный'}
- **Подход:** Приоритет доступности, адаптивности и интуитивной навигации.
${extraRequirements ? `# ОСОБЫЕ ТРЕБОВАНИЯ\n${extraRequirements}` : ''}
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