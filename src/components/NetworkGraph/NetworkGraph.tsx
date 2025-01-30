import { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { sampleData } from './sampleData';
import InfoPanel from './InfoPanel';
import GraphControls from './GraphControls';
import { Node } from './types';
import * as THREE from 'three';

const NetworkGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the 3D force graph
    const Graph = new ForceGraph3D()(containerRef.current)
      .graphData(sampleData)
      .nodeLabel('title')
      .nodeColor((node: any) => {
        switch (node.type) {
          case 'article': return '#4A90E2';
          case 'author': return '#50C878';
          case 'topic': return '#FF6B6B';
          case 'meme': return '#FFB347';
          default: return '#999';
        }
      })
      .nodeThreeObject((node: any) => {
        // Create sprite material with node image
        const imgTexture = new THREE.TextureLoader().load(node.imageUrl);
        const material = new THREE.SpriteMaterial({ map: imgTexture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(16, 16, 1);

        // Create container for sprite and text
        const group = new THREE.Group();
        group.add(sprite);

        // Add text label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          context.font = '12px Arial';
          context.fillStyle = 'white';
          context.fillText(node.title, 0, 24);
          const texture = new THREE.CanvasTexture(canvas);
          const labelSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({ map: texture })
          );
          labelSprite.position.y = -10;
          labelSprite.scale.set(30, 15, 1);
          group.add(labelSprite);
        }

        return group;
      })
      .linkWidth(1)
      .linkOpacity(0.5)
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
      });

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
    <div className="relative w-full h-screen bg-gray-900">
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