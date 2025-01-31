import { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { newData } from './newData';
import InfoPanel from './InfoPanel';
import GraphControls from './GraphControls';
import { Node } from './types';
import * as THREE from 'three';
import * as d3 from 'd3';
import { LINK_STRENGTHS, LINK_DISTANCES, LINK_PARAMS } from './graphUtils';

const NetworkGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    // Initialize the 3D force graph
    const Graph = new ForceGraph3D()(containerRef.current)
      .backgroundColor('rgba(0,0,0,0)')
      .graphData(newData)
      .nodeLabel(null) // Отключаем встроенный тултип
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
          // Расстояние в зависимости от типа связи
          switch(link.type) {
            case 'type-link': return LINK_DISTANCES.TYPE;
            case 'author-link': return LINK_DISTANCES.AUTHOR;
            case 'issue-link': return LINK_DISTANCES.ISSUE;
            default: return 80;
          }
        })
        .strength((link: any) => {
          // Сила связи в зависимости от типа
          switch(link.type) {
            case 'type-link': return LINK_STRENGTHS.TYPE;
            case 'author-link': return LINK_STRENGTHS.AUTHOR;
            case 'issue-link': return LINK_STRENGTHS.ISSUE;
            default: return 0.6;
          }
        })
      )
      // Визуализация связей
      .linkColor(() => LINK_PARAMS.COLOR)
      .linkWidth(LINK_PARAMS.WIDTH)
      .linkOpacity(LINK_PARAMS.OPACITY)
      // Отталкивание узлов
      .d3Force('charge', d3.forceManyBody()
        .strength(-100)
        .distanceMax(200)
      )
      // Сила коллизий
      .d3Force('collision', d3.forceCollide()
        .radius(20)
        .strength(0.7)
      )
      // Центральная сила (гравитация к центру)
      .d3Force('center', d3.forceCenter())
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
        const cornerRadiusPercent = 0.1; // 3% от ширины
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
  }, []);

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
      <InfoPanel
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
};

export default NetworkGraph;