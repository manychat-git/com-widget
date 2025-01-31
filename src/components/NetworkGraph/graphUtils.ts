import { Node } from './types';

// Общие визуальные параметры для связей (будут использоваться как дефолтные)
export const LINK_VISUAL = {
  WIDTH: 0.1,
  OPACITY: 0.4,
  COLOR: '#D7D7D7'
};

// Дефолтные настройки связей
export const DEFAULT_LINK_SETTINGS = {
  type: {
    enabled: true,
    strength: 0.1,
    distance: 100
  },
  author: {
    enabled: true,
    strength: 0.1,
    distance: 200
  },
  issue: {
    enabled: true,
    strength: 1,
    distance: 30
  },
  visual: {
    width: LINK_VISUAL.WIDTH,
    opacity: LINK_VISUAL.OPACITY,
    color: LINK_VISUAL.COLOR
  },
  physics: {
    repulsion: {
      strength: -500,
      maxDistance: 200
    },
    collision: {
      radius: 1,
      strength: 0.7
    },
    centerForce: true
  }
} as const;

// Параметры физики графа
export const GRAPH_PHYSICS_PARAMS = {
  REPULSION: {
    STRENGTH: -500,    // Сила отталкивания узлов
    MAX_DISTANCE: 200  // Максимальная дистанция действия отталкивания
  },
  COLLISION: {
    RADIUS: 1,       // Радиус коллизии узлов
    STRENGTH: 0.7     // Сила коллизии
  },
  CENTER_FORCE: true  // Включить центральную силу (гравитацию к центру)
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
            strength: linkTypes.TYPE.STRENGTH,
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
    if (!nodesByAuthor[node.author]) {
      nodesByAuthor[node.author] = [];
    }
    nodesByAuthor[node.author].push(node);
  });

  // Создаем связи между узлами одного автора
  if (settings.author.enabled) {
    Object.entries(nodesByAuthor).forEach(([author, authorNodes]) => {
      for (let i = 0; i < authorNodes.length; i++) {
        for (let j = i + 1; j < authorNodes.length; j++) {
          links.push({
            source: authorNodes[i].id,
            target: authorNodes[j].id,
            strength: linkTypes.AUTHOR.STRENGTH,
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
    if (!nodesByIssue[node.issue]) {
      nodesByIssue[node.issue] = [];
    }
    nodesByIssue[node.issue].push(node);
  });

  // Создаем связи между узлами одного выпуска
  if (settings.issue.enabled) {
    Object.entries(nodesByIssue).forEach(([issue, issueNodes]) => {
      for (let i = 0; i < issueNodes.length; i++) {
        for (let j = i + 1; j < issueNodes.length; j++) {
          links.push({
            source: issueNodes[i].id,
            target: issueNodes[j].id,
            strength: linkTypes.ISSUE.STRENGTH,
            type: 'issue-link',
            issueGroup: issue
          });
        }
      }
    });
  }

  return links;
}; 