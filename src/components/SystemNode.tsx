import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import socket from '../lib/socket';

interface Props {
  node: any;
}

export default function SystemNode({ node }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    if (node.status === 'CRITICAL') return '#ff3131';
    if (node.status === 'WARNING') return '#ffd700';
    return '#00f5ff';
  }, [node.status]);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.y += 0.01;
      
      // Pulsing for Warning/Critical
      if (node.status !== 'NORMAL') {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }

      // Distortion effect for Critical
      if (node.status === 'CRITICAL') {
        meshRef.current.position.x = node.position[0] + (Math.random() - 0.5) * 0.1;
        meshRef.current.position.y = node.position[1] + (Math.random() - 0.5) * 0.1;
      } else {
        meshRef.current.position.set(node.position[0], node.position[1], node.position[2]);
      }
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
  });

  return (
    <group position={node.position}>
      {/* Core Node */}
      <mesh 
        ref={meshRef} 
        onClick={() => socket.emit('inject_anomaly', node.id)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={node.status === 'CRITICAL' ? 5 : 1}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>

      {/* Prediction Halo */}
      {node.prediction && node.prediction.status !== 'NORMAL' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.05, 16, 100]} />
          <meshBasicMaterial 
            color={node.prediction.status === 'CRITICAL' ? '#ff3131' : '#ffd700'} 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}

      {/* Labels */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.name}
      </Text>

      <Text
        position={[0, -2.5, 0]}
        fontSize={0.6}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(node.telemetry.load)}%
      </Text>

      {/* Anomaly Indicator */}
      {node.isAnomaly && (
        <Html distanceFactor={15}>
          <div className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full animate-bounce font-bold border border-white">
            ANOMALY DETECTED
          </div>
        </Html>
      )}
    </group>
  );
}
