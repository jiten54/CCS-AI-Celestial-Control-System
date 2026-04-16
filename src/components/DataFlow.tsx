import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  start: [number, number, number];
  end: [number, number, number];
  status: string;
}

export default function DataFlow({ start, end, status }: Props) {
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const curve = new THREE.CatmullRomCurve3([
      startVec,
      new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5).add(new THREE.Vector3(0, 5, 0)),
      endVec
    ]);
    return curve.getPoints(50);
  }, [start, end]);

  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const color = useMemo(() => {
    if (status === 'CRITICAL') return '#ff3131';
    if (status === 'WARNING') return '#ffd700';
    return '#00f5ff';
  }, [status]);

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color, 
    transparent: true, 
    opacity: 0.2,
    linewidth: 1
  }), [color]);

  const lineObject = useMemo(() => new THREE.Line(lineGeometry, lineMaterial), [lineGeometry, lineMaterial]);

  // Particles
  const particleCount = 3;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map(() => ({
      offset: Math.random(),
      speed: 0.1 + Math.random() * 0.2
    }));
  }, []);

  const particleRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    particleRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const p = particles[i];
        const t = (p.offset + time * p.speed) % 1;
        
        // Get position along curve
        const startVec = new THREE.Vector3(...start);
        const endVec = new THREE.Vector3(...end);
        const pos = new THREE.Vector3().lerpVectors(startVec, endVec, t);
        
        // Add some arc
        const arc = Math.sin(t * Math.PI) * 5;
        pos.y += arc;
        
        mesh.position.copy(pos);
        mesh.scale.setScalar(0.2 + Math.sin(t * Math.PI) * 0.3);
      }
    });
  });

  return (
    <group>
      <primitive object={lineObject} />
      {particles.map((_, i) => (
        <mesh key={i} ref={(el) => (particleRefs.current[i] = el!)}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}
