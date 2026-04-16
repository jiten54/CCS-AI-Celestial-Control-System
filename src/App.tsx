import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import socket from './lib/socket';
import CelestialScene from './components/CelestialScene';
import HUD from './components/HUD';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const [systemState, setSystemState] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    socket.on('system_state', (state) => {
      setSystemState(state);
    });

    socket.on('event', (event) => {
      setEvents(prev => [event, ...prev].slice(0, 50));
    });

    return () => {
      socket.off('system_state');
      socket.off('event');
    };
  }, []);

  if (!systemState) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center text-blue-400 font-mono animate-pulse">
        INITIALIZING CCS-AI CORE...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#050505] overflow-hidden flex font-sans text-slate-200">
      {/* 3D Visualization Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows={true}>
          <PerspectiveCamera makeDefault position={[0, 20, 50]} fov={60} />
          <color attach="background" args={['#020205']} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <CelestialScene state={systemState} />
          
          <OrbitControls enableDamping dampingFactor={0.05} />
          
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* HUD Layer */}
      <HUD state={systemState} />

      {/* Control Layer */}
      <div className="absolute right-0 top-0 h-full w-80 z-10 p-4 pointer-events-none">
        <ControlPanel state={systemState} events={events} />
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 opacity-20" />
    </div>
  );
}
