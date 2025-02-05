import { Node } from './types';

// Дефолтные настройки для всех параметров графа
export const DEFAULT_LINK_SETTINGS: LinkSettings = {
  // Настройки связей
  type: {
    enabled: false,
    strength: 0.1,
    distance: 100
  },
  author: {
    enabled: true,
    strength: 0.2,
    distance: 40
  },
  issue: {
    enabled: true,
    strength: 1.0,
    distance: 20
  },
  // Визуальные настройки
  visual: {
    width: 0.1,
    opacity: 0.0,
    color: '#D7D7D7'
  },
  // Физические параметры
  physics: {
    repulsion: {
      strength: -400,
      maxDistance: 220
    },
    collision: {
      radius: 1,
      strength: 0.6
    },
    centerForce: true
  }
};

// Параметры физики графа
export const GRAPH_PHYSICS_PARAMS = {
  REPULSION: {
    STRENGTH: DEFAULT_LINK_SETTINGS.physics.repulsion.strength,
    MAX_DISTANCE: DEFAULT_LINK_SETTINGS.physics.repulsion.maxDistance
  },
  COLLISION: {
    RADIUS: DEFAULT_LINK_SETTINGS.physics.collision.radius,
    STRENGTH: DEFAULT_LINK_SETTINGS.physics.collision.strength
  },
  CENTER_FORCE: DEFAULT_LINK_SETTINGS.physics.centerForce
};

// Тип для настроек связей
export interface LinkSettings {
  type: { enabled: boolean; strength: number; distance: number };
  author: { enabled: boolean; strength: number; distance: number };
  issue: { enabled: boolean; strength: number; distance: number };
  visual: { width: number; opacity: number; color: string };
  physics: {
    repulsion: { strength: number; maxDistance: number };
    collision: { radius: number; strength: number };
    centerForce: boolean;
  };
}

// Функция для получения параметров связей на основе настроек
export const getLinkTypes = (settings: LinkSettings = DEFAULT_LINK_SETTINGS) => ({
  TYPE: {
    STRENGTH: settings.type.enabled ? settings.type.strength : 0,     
    DISTANCE: settings.type.distance      
  },
  AUTHOR: {
    STRENGTH: settings.author.enabled ? settings.author.strength : 0,     
    DISTANCE: settings.author.distance       
  },
  ISSUE: {
    STRENGTH: settings.issue.enabled ? settings.issue.strength : 0,     
    DISTANCE: settings.issue.distance      
  }
});

// Функция для создания связей между узлами
export const generateLinks = (nodes: Node[], settings: LinkSettings = DEFAULT_LINK_SETTINGS) => {
  const links = [];
  const linkTypes = getLinkTypes(settings);

  // Группируем узлы по типу контента
  const nodesByType: { [key: string]: Node[] } = {};
  nodes.forEach(node => {
    if (!nodesByType[node.type]) {
      nodesByType[node.type] = [];
    }
    nodesByType[node.type].push(node);
  });

  // Создаем связи между узлами одного типа
  if (settings.type.enabled) {
    Object.entries(nodesByType).forEach(([type, typeNodes]) => {
      for (let i = 0; i < typeNodes.length; i++) {
        for (let j = i + 1; j < typeNodes.length; j++) {
          links.push({
            source: typeNodes[i].id,
            target: typeNodes[j].id,
            type: 'type-link',
            linkType: type
          });
        }
      }
    });
  }

  // Группируем узлы по автору
  const nodesByAuthor: { [key: string]: Node[] } = {};
  nodes.forEach(node => {
    if (node.author) {  // Проверяем наличие автора
      if (!nodesByAuthor[node.author]) {
        nodesByAuthor[node.author] = [];
      }
      nodesByAuthor[node.author].push(node);
    }
  });

  // Создаем связи между узлами одного автора
  if (settings.author.enabled) {
    Object.entries(nodesByAuthor).forEach(([author, authorNodes]) => {
      for (let i = 0; i < authorNodes.length; i++) {
        for (let j = i + 1; j < authorNodes.length; j++) {
          links.push({
            source: authorNodes[i].id,
            target: authorNodes[j].id,
            type: 'author-link',
            authorGroup: author
          });
        }
      }
    });
  }

  // Группируем узлы по выпуску
  const nodesByIssue: { [key: string]: Node[] } = {};
  nodes.forEach(node => {
    if (node.issue) {  // Проверяем наличие выпуска
      if (!nodesByIssue[node.issue]) {
        nodesByIssue[node.issue] = [];
      }
      nodesByIssue[node.issue].push(node);
    }
  });

  // Создаем связи между узлами одного выпуска
  if (settings.issue.enabled) {
    Object.entries(nodesByIssue).forEach(([issue, issueNodes]) => {
      for (let i = 0; i < issueNodes.length; i++) {
        for (let j = i + 1; j < issueNodes.length; j++) {
          links.push({
            source: issueNodes[i].id,
            target: issueNodes[j].id,
            type: 'issue-link',
            issueGroup: issue
          });
        }
      }
    });
  }

  return links;
}; 