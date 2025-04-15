
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FuturisticBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true // Add antialiasing for smoother particles
    });
    renderer.setPixelRatio(window.devicePixelRatio); // Better resolution
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles with ultra-subtle blue tint
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800; // Even fewer particles
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount); // Individual particle sizes

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8; // Even more concentrated spread
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 8;

      // Ultra-subtle movement
      velocities[i] = (Math.random() - 0.5) * 0.003;
      velocities[i + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i + 2] = (Math.random() - 0.5) * 0.003;

      // Ultra-subtle blue tint with slight variation
      colors[i] = Math.random() * 0.01;      // Minimal red
      colors[i + 1] = Math.random() * 0.03;  // Minimal green
      colors[i + 2] = Math.random() * 0.2 + 0.1;  // Very subtle blue

      // Varying particle sizes
      sizes[i/3] = Math.random() * 0.008 + 0.002;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for better particle rendering
    const particlesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          vec3 finalColor = vColor;
          gl_FragColor = vec4(finalColor, smoothstep(0.5, 0.0, r) * 0.3);
        }
      `,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Create gradient background with more subtle transition
    const gradientGeometry = new THREE.PlaneGeometry(40, 40);
    const gradientMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        color1: { value: new THREE.Color('#030712') }, // Very dark blue
        color2: { value: new THREE.Color('#0a1426') }, // Slightly lighter dark blue
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
          vec3 color = mix(color1, color2, pow(vUv.y, 1.5)); // More subtle gradient transition
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const gradientPlane = new THREE.Mesh(gradientGeometry, gradientMaterial);
    gradientPlane.position.z = -10;
    scene.add(gradientPlane);

    camera.position.z = 5;

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.001;

      // Update particle positions with smooth velocities
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] * Math.sin(time * 0.5);
        positions[i + 1] += velocities[i + 1] * Math.cos(time * 0.5);
        positions[i + 2] += velocities[i + 2];

        // Very tight boundaries
        if (Math.abs(positions[i]) > 4) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 4) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 4) velocities[i + 2] *= -1;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Extremely slow rotation
      particles.rotation.x += 0.00002;
      particles.rotation.y += 0.00001;

      (particlesMaterial.uniforms.time as { value: number }).value = time;
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      gradientGeometry.dispose();
      gradientMaterial.dispose();
      particlesMaterial.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div 
        ref={containerRef} 
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ 
          pointerEvents: 'none',
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          overflow: 'hidden'
        }}
      />
      <div 
        className="fixed top-0 left-0 w-full h-full -z-9 bg-gradient-to-b from-background/5 to-background/95 pointer-events-none"
        style={{
          backdropFilter: 'blur(0.15px)'
        }}
      />
    </>
  );
};
