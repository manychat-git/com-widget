import React from 'react';
import { createRoot } from 'react-dom/client';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import './embed.css';

// Функция для проверки конфликтов стилей
function checkStyleConflicts() {
  const existingTailwind = document.querySelector('style[data-tailwind]');
  if (existingTailwind) {
    console.warn('Found existing Tailwind styles. Widget styles might conflict.');
  }

  const existingMUI = document.querySelector('style[data-mui]');
  if (existingMUI) {
    console.warn('Found existing MUI styles. Widget styles might conflict.');
  }
}

// Функция для инициализации стилей
function initializeStyles(container: HTMLElement) {
  // Добавляем namespace для изоляции стилей
  container.classList.add('com-widget-root');
  
  // Проверяем конфликты
  checkStyleConflicts();

  // Добавляем обработчик для очистки стилей
  return () => {
    container.classList.remove('com-widget-root');
  };
}

// Функция для безопасной инициализации виджета
function initializeWidget(containerId: string = 'root') {
  // Проверяем, не был ли виджет уже инициализирован
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }

  // Проверяем, не был ли виджет уже инициализирован в этом контейнере
  if (container.hasAttribute('data-widget-initialized')) {
    console.warn(`Widget already initialized in container "${containerId}"`);
    return;
  }

  try {
    // Инициализируем стили
    const cleanupStyles = initializeStyles(container);

    // Создаем корень React приложения
    const root = createRoot(container);
    
    // Рендерим граф со всеми компонентами
    root.render(
      <React.StrictMode>
        <NetworkGraph />
      </React.StrictMode>
    );

    // Помечаем контейнер как инициализированный
    container.setAttribute('data-widget-initialized', 'true');

    return {
      destroy: () => {
        root.unmount();
        cleanupStyles();
        container.removeAttribute('data-widget-initialized');
      }
    };
  } catch (error) {
    console.error('Failed to initialize widget:', error);
    return null;
  }
}

// Экспортируем функцию инициализации
(window as any).ComWidget = {
  init: initializeWidget
};

// Автоматическая инициализация, если найден контейнер по умолчанию
if (document.getElementById('root')) {
  initializeWidget();
} 