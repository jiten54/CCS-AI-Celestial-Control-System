import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SystemNode from './SystemNode';
import DataFlow from './DataFlow';

interface Props {
  state: {
    nodes: any[];
    connections: any[];
    stability: number;
  };
}

export default function CelestialScene({ state }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation of the entire system
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {state.nodes.map((node) => (
        <SystemNode key={node.id} node={node} />
      ))}
      {state.connections.map((conn, idx) => {
        const fromNode = state.nodes.find(n => n.id === conn.from);
        const toNode = state.nodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return null;
        
        return (
          <DataFlow 
            key={`${conn.from}-${conn.to}-${idx}`} 
            start={fromNode.position} 
            end={toNode.position} 
            status={fromNode.status}
          />
        );
      })}
    </group>
  );
}
