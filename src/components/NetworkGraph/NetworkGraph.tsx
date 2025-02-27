import { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { newData } from './newData';
import { Node } from './types';
import * as THREE from 'three';
import * as d3 from 'd3';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { GRAPH_PHYSICS_PARAMS, DEFAULT_LINK_SETTINGS, LinkSettings, getLinkTypes, generateLinks } from './graphUtils';

// Register GSAP plugins
gsap.registerPlugin(Draggable);

interface NetworkGraphProps {
  baseUrl: string;
}

const NetworkGraph = ({ baseUrl }: NetworkGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const rotationIntervalRef = useRef<NodeJS.Timer | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [settings, setSettings] = useState<LinkSettings>(DEFAULT_LINK_SETTINGS);

  // Функция для старта вращения
  const startRotation = () => {
    if (rotationIntervalRef.current) return;

    const controls = graphRef.current.controls();
    const target = controls.target; // Текущая точка фокуса
    const camera = graphRef.current.camera();
    const distance = Math.sqrt(
      Math.pow(camera.position.x - target.x, 2) +
      Math.pow(camera.position.z - target.z, 2)
    );

    let angle = Math.atan2(
      camera.position.z - target.z,
      camera.position.x - target.x
    );

    rotationIntervalRef.current = setInterval(() => {
      if (graphRef.current) {
        angle += 0.0005; // Очень медленное вращение
        graphRef.current.cameraPosition({
          x: target.x + distance * Math.cos(angle),
          y: camera.position.y,
          z: target.z + distance * Math.sin(angle)
        });
      }
    }, 10);
  };

  // Функция для остановки вращения
  const stopRotation = () => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
    }
  };

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
      .graphData({ nodes: newData.nodes, links: generateLinks(newData.nodes, settings) })
      .nodeLabel(null)
      .cameraPosition({ x: 0, y: 0, z: 200 })
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
        img.crossOrigin = "anonymous";
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
        img.onerror = () => {
          console.warn(`Failed to load node image: ${node.imageUrl}`);
          if (ctx) {
            // Draw fallback colored rectangle
            ctx.fillStyle = (() => {
              switch (node.type) {
                case 'article': return '#0057FF';
                case 'youtube_video': return '#FD00FD';
                case 'special_project': return '#FF4B00';
                default: return '#999';
              }
            })();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            texture.needsUpdate = true;
          }
        };
        img.src = node.imageUrl;
        
        return sprite;
      })
      .onNodeClick((node: any) => {
        setSelectedNode(node);
        stopRotation(); // Останавливаем вращение

        const distance = 90;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        const currentPos = graphRef.current.cameraPosition();
        
        // Сначала отодвигаем камеру назад для более плавного движения
        graphRef.current.cameraPosition(
          { 
            x: currentPos.x * 1.2,
            y: currentPos.y * 1.2,
            z: currentPos.z * 1.2
          },
          currentPos, // сохраняем текущую точку обзора
          800  // быстрое отдаление
        );

        // Затем делаем плавный облет к нужной позиции
        setTimeout(() => {
          graphRef.current.cameraPosition(
            { 
              x: node.x * distRatio, 
              y: node.y * distRatio, 
              z: node.z * distRatio 
            },
            node, // lookAt ({ x, y, z })
            2500  // увеличенное время для плавности
          );
        }, 800); // Запускаем после завершения первой анимации

        // Find popup elements
        const popup = document.querySelector('[data-w-popup]');
        const handle = document.querySelector('[data-w-handle]');
        const image = document.querySelector('[data-w-image]');
        const authorImage = document.querySelector('[data-w-author-image]');
        const authorSection = document.querySelector('[data-w-author-section]');
        const authorInfo = document.querySelector('[data-w-author-info]');
        const author = document.querySelector('[data-w-author]');
        const title = document.querySelector('[data-w-title]');
        const description = document.querySelector('[data-w-description]');
        const articlePhoto = document.querySelector('[data-w-article-photo]');
        const articleLink = document.querySelector('[data-w-article-link]');
        const issue = document.querySelector('[data-w-issue]');
        
        // Reset content styles for animation
        const contentElements = [
          image, 
          authorImage, 
          authorSection,
          authorInfo,
          author, 
          title, 
          description, 
          articlePhoto, 
          articleLink, 
          issue
        ].filter(Boolean);

        gsap.set(contentElements, {
          autoAlpha: 0,
          scale: 0.95,
          filter: 'blur(10px) brightness(1.5)'
        });
        
        // Fill popup with data
        if (image) {
          const mainImg = new Image();
          mainImg.crossOrigin = "anonymous";
          mainImg.onload = () => {
            (image as HTMLImageElement).src = mainImg.src;
          };
          mainImg.onerror = () => {
            console.warn(`Failed to load image: ${node.imageUrl}`);
            (image as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
          };
          mainImg.src = node.imageUrl || '';
        }
        if (authorImage) {
          const authorImg = new Image();
          authorImg.crossOrigin = "anonymous";
          authorImg.onload = () => {
            (authorImage as HTMLImageElement).src = authorImg.src;
          };
          authorImg.onerror = () => {
            console.warn(`Failed to load author image: ${node.authorImage}`);
            (authorImage as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
          };
          authorImg.src = node.authorImage;
        }
        if (author) author.textContent = node.author ? node.author.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
        if (title) title.textContent = node.title;
        if (description) description.textContent = node.descriptor || '';
        if (articlePhoto) {
          const articleImg = new Image();
          articleImg.crossOrigin = "anonymous";
          articleImg.onload = () => {
            (articlePhoto as HTMLImageElement).src = articleImg.src;
          };
          articleImg.onerror = () => {
            console.warn(`Failed to load article photo: ${node.articleUrl}`);
            (articlePhoto as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
          };
          articleImg.src = node.articleUrl;
        }
        if (articleLink) {
          (articleLink as HTMLAnchorElement).href = node.link.startsWith('http') ? node.link : `${baseUrl}/${node.link.replace(/^\//, '')}`;
        }
        if (issue) issue.textContent = node.issue;
        
        // Show and animate popup
        if (popup) {
          popup.style.display = 'flex';
          
          // Animate popup and content simultaneously
          gsap.to(popup, {
            y: '0%',
            duration: 0.5,
            ease: 'power3.out'
          });
          
          gsap.to(contentElements, {
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px) brightness(1)',
            duration: 0.3,
            ease: 'power2.out'
          });

          // Initialize draggable
          if (handle && !Draggable.get(popup)) {
            Draggable.create(popup, {
              type: 'y',
              trigger: handle,
              bounds: {
                minY: 0,
                maxY: window.innerHeight
              },
              inertia: true,
              onDragEnd: function() {
                // If dragged more than 20% down, close the popup
                if (this.y > popup.clientHeight * 0.2) {
                  gsap.to(popup, {
                    y: '100%',
                    duration: 0.4,
                    ease: 'power3.inOut',
                    onComplete: () => {
                      popup.style.display = 'none';
                      setSelectedNode(null);
                      // Удаляем всю логику с камерой при закрытии попапа
                    }
                  });
                } else {
                  // Return to top if not dragged enough
                  gsap.to(popup, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power3.out'
                  });
                }
              }
            });
          }
        }

        // Add reset button handler
        const resetButton = document.querySelector('[data-w-reset]');
        if (resetButton) {
          resetButton.addEventListener('click', () => {
            // Закрываем попап если он открыт
            const popup = document.querySelector('[data-w-popup]');
            if (popup && getComputedStyle(popup).display !== 'none') {
              gsap.to(popup, {
                y: '100%',
                duration: 0.4,
                ease: 'power3.inOut',
                onComplete: () => {
                  popup.style.display = 'none';
                  setSelectedNode(null);
                }
              });
            }

            // Останавливаем вращение и возвращаем камеру в начальное положение
            stopRotation();
            Graph.cameraPosition(
              { x: 0, y: 0, z: 200 }, // начальная позиция камеры
              { x: 0, y: 0, z: 0 },   // смотрим в центр
              1000                    // длительность анимации
            );

            // Запускаем вращение через 1 секунду (после завершения анимации камеры)
            setTimeout(startRotation, 1000);
          });
        }
      })
      .onNodeHover((node: any) => {
        if (tooltipRef.current) {
          if (node) {
            const screenPos = Graph.graph2ScreenCoords(node.x, node.y, node.z);
            tooltipRef.current.style.display = 'block';

            // Magnetic tooltip animation
            gsap.to(tooltipRef.current, {
              left: `${screenPos.x}px`,
              top: `${screenPos.y - 10}px`,
              duration: 0.4,
              ease: "power2.out"
            });

            tooltipRef.current.textContent = node.title.toUpperCase();
            tooltipRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            tooltipRef.current.style.backdropFilter = 'blur(8px)';
            tooltipRef.current.style.webkitBackdropFilter = 'blur(8px)';
            tooltipRef.current.style.color = '#FFFFFF';
            tooltipRef.current.style.padding = '2px 6px';
            tooltipRef.current.style.borderRadius = '4px';
            tooltipRef.current.style.fontSize = '12px';
            tooltipRef.current.style.fontWeight = '500';
            tooltipRef.current.style.whiteSpace = 'nowrap';
            tooltipRef.current.style.zIndex = '1000';

            // Scale effect for node
            if (node.__threeObj) {
              gsap.to(node.__threeObj.scale, {
                x: 28,
                y: 28 * (9/16),
                duration: 0.3,
                ease: "back.out(1.7)"
              });
            }
          } else {
            tooltipRef.current.style.display = 'none';
            
            // Reset scale of previous node if exists
            const nodes = Graph.graphData().nodes;
            nodes.forEach((n: any) => {
              if (n.__threeObj) {
                gsap.to(n.__threeObj.scale, {
                  x: 24,
                  y: 24 * (9/16),
                  duration: 0.3
                });
              }
            });
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
    const controls = Graph.controls();
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    
    // Stop rotation on any user interaction
    controls.addEventListener('start', stopRotation);

    // Save graph reference
    graphRef.current = Graph;

    // Handle window resize
    const handleResize = () => {
      Graph.width(containerRef.current?.clientWidth ?? window.innerWidth);
      Graph.height(containerRef.current?.clientHeight ?? window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Start rotation after a short delay
    setTimeout(startRotation, 1000);

    // Cleanup
    return () => {
      stopRotation();
      window.removeEventListener('resize', handleResize);
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
      }
      if (resetButton) {
        resetButton.removeEventListener('click', () => {
          Graph.cameraPosition({ x: 0, y: 0, z: 200 }, { x: 0, y: 0, z: 0 }, 1000);
        });
      }
      Graph._destructor();
    };
  }, []); // Эффект запускается только при монтировании

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default NetworkGraph;