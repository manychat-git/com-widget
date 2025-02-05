import { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { newData } from './newData';
import GraphControls from './GraphControls';
import { Node } from './types';
import * as THREE from 'three';
import * as d3 from 'd3';
import { GRAPH_PHYSICS_PARAMS, DEFAULT_LINK_SETTINGS, LinkSettings, getLinkTypes, generateLinks } from './graphUtils';

const NetworkGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [settings, setSettings] = useState<LinkSettings>(DEFAULT_LINK_SETTINGS);

  const handleSettingsChange = (newSettings: LinkSettings) => {
    setSettings(newSettings);
    
    if (graphRef.current) {
      // Пересоздаем связи с новыми настройками
      const newLinks = generateLinks(newData.nodes, newSettings);
      graphRef.current.graphData({ nodes: newData.nodes, links: newLinks });

      // Обновляем визуальные параметры
      graphRef.current
        .linkColor(() => newSettings.visual.color)
        .linkWidth(() => newSettings.visual.width)
        .linkOpacity(newSettings.visual.opacity);

      // Обновляем параметры физики
      const linkForce = graphRef.current.d3Force('link');
      if (linkForce) {
        linkForce
          .distance((link: any) => {
            switch(link.type) {
              case 'type-link': return newSettings.type.distance;
              case 'author-link': return newSettings.author.distance;
              case 'issue-link': return newSettings.issue.distance;
              default: return 80;
            }
          })
          .strength((link: any) => {
            switch(link.type) {
              case 'type-link': return newSettings.type.enabled ? newSettings.type.strength : 0;
              case 'author-link': return newSettings.author.enabled ? newSettings.author.strength : 0;
              case 'issue-link': return newSettings.issue.enabled ? newSettings.issue.strength : 0;
              default: return 0;
            }
          });
      }

      // Обновляем остальные силы
      graphRef.current
        .d3Force('charge', d3.forceManyBody()
          .strength(newSettings.physics.repulsion.strength)
          .distanceMax(newSettings.physics.repulsion.maxDistance)
        )
        .d3Force('collision', d3.forceCollide()
          .radius(newSettings.physics.collision.radius)
          .strength(newSettings.physics.collision.strength)
        );

      // Обновляем Center Gravity
      if (newSettings.physics.centerForce) {
        graphRef.current.d3Force('center', d3.forceCenter());
      } else {
        graphRef.current.d3Force('center', null);
        // Сбрасываем позиции к текущим, чтобы предотвратить резкое движение
        const nodes = graphRef.current.graphData().nodes;
        nodes.forEach(node => {
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
        });
        setTimeout(() => {
          nodes.forEach(node => {
            node.fx = undefined;
            node.fy = undefined;
            node.fz = undefined;
          });
        }, 100);
      }

      // Перезапускаем симуляцию
      graphRef.current
        .d3AlphaDecay(0.0228)
        .d3VelocityDecay(0.4)
        .d3AlphaTarget(0)
        .resetCountdown()
        .numDimensions(3);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    const linkTypes = getLinkTypes(settings);

    // Initialize the 3D force graph
    const Graph = ForceGraph3D()(containerRef.current)
      .backgroundColor('rgba(0,0,0,0)')
      .graphData(newData)
      .nodeLabel(null)
      .nodeColor((node: any) => {
        switch (node.type) {
          case 'article': return '#0057FF';
          case 'youtube_video': return '#FD00FD';
          case 'special_project': return '#FF4B00';
          default: return '#999';
        }
      })
      // Физика графа
      .d3Force('link', d3.forceLink()
        .id((d: any) => d.id)
        .distance((link: any) => {
          switch(link.type) {
            case 'type-link': return linkTypes.TYPE.DISTANCE;
            case 'author-link': return linkTypes.AUTHOR.DISTANCE;
            case 'issue-link': return linkTypes.ISSUE.DISTANCE;
            default: return 80;
          }
        })
        .strength((link: any) => {
          switch(link.type) {
            case 'type-link': return linkTypes.TYPE.STRENGTH;
            case 'author-link': return linkTypes.AUTHOR.STRENGTH;
            case 'issue-link': return linkTypes.ISSUE.STRENGTH;
            default: return 0.6;
          }
        })
      )
      // Визуализация связей
      .linkColor(() => settings.visual.color)
      .linkWidth(() => settings.visual.width)
      .linkOpacity(settings.visual.opacity)
      // Отталкивание узлов
      .d3Force('charge', d3.forceManyBody()
        .strength(settings.physics.repulsion.strength)
        .distanceMax(settings.physics.repulsion.maxDistance)
      )
      // Сила коллизий
      .d3Force('collision', d3.forceCollide()
        .radius(settings.physics.collision.radius)
        .strength(settings.physics.collision.strength)
      )
      // Центральная сила (гравитация к центру)
      .d3Force('center', settings.physics.centerForce ? d3.forceCenter() : null)
      // Визуальные параметры
      .nodeRelSize(6) // Базовый размер узлов
      .nodeThreeObject((node: any) => {
        // Create a canvas for preprocessing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Set canvas size for high quality
        canvas.width = 1024;
        canvas.height = Math.round(1024 * (9/16));
        
        // Calculate corner radius (3% of width)
        const cornerRadiusPercent = 0.1;
        const cornerRadius = Math.round(canvas.width * cornerRadiusPercent);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        
        // Create material with the texture
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: true,
          sizeAttenuation: true
        });
        
        // Create sprite with initial size
        const sprite = new THREE.Sprite(material);
        const width = 24;
        const height = width * (9/16);
        sprite.scale.set(width, height, 1);
        
        // Load and process image
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          if (ctx) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Enable high-quality smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw rounded rectangle
            ctx.beginPath();
            ctx.roundRect(0, 0, canvas.width, canvas.height, cornerRadius);
            ctx.clip();
            
            // Draw image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Update texture
            texture.needsUpdate = true;
          }
        };
        img.src = node.imageUrl;
        
        return sprite;
      })
      .onNodeClick((node: any) => {
        setSelectedNode(node);
        
        // Find popup elements
        const popup = document.querySelector('[data-w-popup]');
        const image = document.querySelector('[data-w-image]');
        const author = document.querySelector('[data-w-author]');
        const title = document.querySelector('[data-w-title]');
        const description = document.querySelector('[data-w-description]');
        const closeBtn = document.querySelector('[data-w-close]');
        
        // Fill popup with data
        if (image) (image as HTMLImageElement).src = node.imageUrl;
        if (author) author.textContent = node.author ? node.author.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
        if (title) title.textContent = node.title;
        if (description) description.textContent = node.descriptor || '';
        
        // Show popup
        if (popup) popup.style.display = 'flex';
        
        // Add close handler
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            if (popup) popup.style.display = 'none';
            setSelectedNode(null);
          });
        }

        // Aim at node from outside
        const distance = 40;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        graphRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
          node,
          3000
        );
      })
      .onNodeHover((node: any) => {
        if (tooltipRef.current) {
          if (node) {
            const screenPos = Graph.graph2ScreenCoords(node.x, node.y, node.z);
            tooltipRef.current.style.display = 'block';
            tooltipRef.current.style.left = `${screenPos.x}px`;
            tooltipRef.current.style.top = `${screenPos.y - 10}px`;
            tooltipRef.current.textContent = node.title.toUpperCase();
            
            // Set background color based on node type
            switch (node.type) {
              case 'article':
                tooltipRef.current.style.backgroundColor = '#0057FF';
                break;
              case 'youtube_video':
                tooltipRef.current.style.backgroundColor = '#FD00FD';
                break;
              case 'special_project':
                tooltipRef.current.style.backgroundColor = '#FF4B00';
                break;
              default:
                tooltipRef.current.style.backgroundColor = '#999';
            }
            tooltipRef.current.style.color = '#FFFFFF';
            tooltipRef.current.style.padding = '2px 6px';
            tooltipRef.current.style.borderRadius = '4px';
            tooltipRef.current.style.fontSize = '14px';
            tooltipRef.current.style.fontWeight = '500';
            tooltipRef.current.style.whiteSpace = 'nowrap';
            tooltipRef.current.style.zIndex = '1000';
            tooltipRef.current.style.transition = 'all 0.2s ease';
          } else {
            tooltipRef.current.style.display = 'none';
          }
        }
      });

    // Configure renderer
    const renderer = Graph.renderer();
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.alpha = true;
    
    // Add camera controls
    Graph.controls().enableDamping = true;
    Graph.controls().dampingFactor = 0.1;
    Graph.controls().rotateSpeed = 0.8;

    // Save graph reference
    graphRef.current = Graph;

    // Handle window resize
    const handleResize = () => {
      Graph.width(containerRef.current?.clientWidth ?? window.innerWidth);
      Graph.height(containerRef.current?.clientHeight ?? window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
      }
      Graph._destructor();
    };
  }, []); // Эффект запускается только при монтировании

  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentDistance = graphRef.current.camera().position.z;
      graphRef.current.cameraPosition({ z: currentDistance * 0.8 });
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentDistance = graphRef.current.camera().position.z;
      graphRef.current.cameraPosition({ z: currentDistance * 1.2 });
    }
  };

  const handleReset = () => {
    if (graphRef.current) {
      graphRef.current.cameraPosition({ x: 0, y: 0, z: 200 }, { x: 0, y: 0, z: 0 }, 1000);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
};

export default NetworkGraph;