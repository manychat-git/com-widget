import { Node } from './types';

// Параметры силы связей
export const LINK_STRENGTHS = {
  TYPE: 0.9,    // Сильная связь для одного типа контента
  AUTHOR: 0.5,  // Средняя связь для одного автора
  ISSUE: 0.7    // Умеренная связь для одного выпуска
};

// Параметры расстояний
export const LINK_DISTANCES = {
  TYPE: 50,    // Ближе друг к другу
  AUTHOR: 70,  // Среднее расстояние
  ISSUE: 90    // Дальше друг от друга
};

// Параметры линков
export const LINK_PARAMS = {
  WIDTH: 0.1,     
  OPACITY: 0.3,   
  COLOR: '#D7D7D7'
};

// Функция для создания связей между узлами
export const generateLinks = (nodes: Node[]) => {
  const links = [];

  // Группируем узлы по типу контента
  const nodesByType: { [key: string]: Node[] } = {};
  nodes.forEach(node => {
    if (!nodesByType[node.type]) {
      nodesByType[node.type] = [];
    }
    nodesByType[node.type].push(node);
  });

  // Создаем связи между узлами одного типа
  Object.entries(nodesByType).forEach(([type, typeNodes]) => {
    for (let i = 0; i < typeNodes.length; i++) {
      for (let j = i + 1; j < typeNodes.length; j++) {
        links.push({
          source: typeNodes[i].id,
          target: typeNodes[j].id,
          strength: LINK_STRENGTHS.TYPE,
          type: 'type-link',
          linkType: type
        });
      }
    }
  });

  // Группируем узлы по автору
  const nodesByAuthor: { [key: string]: Node[] } = {};
  nodes.forEach(node => {
    if (!nodesByAuthor[node.author]) {
      nodesByAuthor[node.author] = [];
    }
    nodesByAuthor[node.author].push(node);
  });

  // Создаем связи между узлами одного автора
  Object.entries(nodesByAuthor).forEach(([author, authorNodes]) => {
    for (let i = 0; i < authorNodes.length; i++) {
      for (let j = i + 1; j < authorNodes.length; j++) {
        links.push({
          source: authorNodes[i].id,
          target: authorNodes[j].id,
          strength: LINK_STRENGTHS.AUTHOR,
          type: 'author-link',
          authorGroup: author
        });
      }
    }
  });

  // Группируем узлы по выпуску
  const nodesByIssue: { [key: string]: Node[] } = {};
  nodes.forEach(node => {
    if (!nodesByIssue[node.issue]) {
      nodesByIssue[node.issue] = [];
    }
    nodesByIssue[node.issue].push(node);
  });

  // Создаем связи между узлами одного выпуска
  Object.entries(nodesByIssue).forEach(([issue, issueNodes]) => {
    for (let i = 0; i < issueNodes.length; i++) {
      for (let j = i + 1; j < issueNodes.length; j++) {
        links.push({
          source: issueNodes[i].id,
          target: issueNodes[j].id,
          strength: LINK_STRENGTHS.ISSUE,
          type: 'issue-link',
          issueGroup: issue
        });
      }
    }
  });

  return links;
}; 