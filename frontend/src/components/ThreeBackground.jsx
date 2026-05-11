import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle sphere
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const radius = 15;

    // Generate evenly distributed points on sphere surface using Fibonacci sphere
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.sin(inclination) * Math.sin(azimuth);
      const z = radius * Math.cos(inclination);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Initialize colors (white)
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;

      // Initialize sizes
      sizes[i] = 1.0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Particle material with glow effect
    const material = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const particleSphere = new THREE.Points(geometry, material);
    scene.add(particleSphere);

    // Mouse tracking
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Smooth rotation around Y-axis
      particleSphere.rotation.y += 0.002;
      
      // Subtle X-axis rotation
      particleSphere.rotation.x += 0.0005;

      // Mouse interaction - split particles
      const positionsArray = geometry.attributes.position.array;
      const colorsArray = geometry.attributes.color.array;
      const sizesArray = geometry.attributes.size.array;
      const mouse3D = new THREE.Vector3(
        mouseRef.current.x * 20,
        mouseRef.current.y * 20,
        0
      );

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Get original position
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];

        // Current particle position
        const particlePos = new THREE.Vector3(origX, origY, origZ);
        particlePos.applyEuler(particleSphere.rotation);

        // Calculate distance from mouse
        const distance = particlePos.distanceTo(mouse3D);
        const interactionRadius = 12;

        if (distance < interactionRadius) {
          // Push particles away from cursor with stronger force
          const force = (1 - distance / interactionRadius) * 5;
          const direction = particlePos.clone().sub(mouse3D).normalize();
          
          positionsArray[i3] = origX + direction.x * force;
          positionsArray[i3 + 1] = origY + direction.y * force;
          positionsArray[i3 + 2] = origZ + direction.z * force;

          // Change color to cyan/blue gradient based on distance
          const colorIntensity = 1 - distance / interactionRadius;
          colorsArray[i3] = 0.2 + colorIntensity * 0.3; // Red
          colorsArray[i3 + 1] = 0.5 + colorIntensity * 0.5; // Green
          colorsArray[i3 + 2] = 1.0; // Blue

          // Increase size
          sizesArray[i] = 1.0 + colorIntensity * 2.0;
        } else {
          // Return to original position smoothly
          positionsArray[i3] += (origX - positionsArray[i3]) * 0.08;
          positionsArray[i3 + 1] += (origY - positionsArray[i3 + 1]) * 0.08;
          positionsArray[i3 + 2] += (origZ - positionsArray[i3 + 2]) * 0.08;

          // Return to white color
          colorsArray[i3] += (1.0 - colorsArray[i3]) * 0.08;
          colorsArray[i3 + 1] += (1.0 - colorsArray[i3 + 1]) * 0.08;
          colorsArray[i3 + 2] += (1.0 - colorsArray[i3 + 2]) * 0.08;

          // Return to normal size
          sizesArray[i] += (1.0 - sizesArray[i]) * 0.08;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
