"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import * as THREE from "three"

export function ThreeDGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0) // transparent background
    containerRef.current.appendChild(renderer.domElement)

    // Create globe
    const group = new THREE.Group()
    scene.add(group)
    globeRef.current = group

    // Globe sphere
    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64)
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.8,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    group.add(sphere)

    // Add wireframe
    const wireframeGeometry = new THREE.SphereGeometry(2.05, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    group.add(wireframe)

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(2.1, 32, 32)
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.2 },
        p: { value: 4.0 },
        glowColor: { value: new THREE.Color(0x60a5fa) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float c;
        uniform float p;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
          gl_FragColor = vec4(glowColor, intensity);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    glowMesh.scale.multiplyScalar(1.2)
    group.add(glowMesh)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x60a5fa, 2, 50)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x60a5fa, 2, 50)
    pointLight2.position.set(-10, -10, -10)
    scene.add(pointLight2)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (globeRef.current) {
        globeRef.current.rotation.y += 0.002
        globeRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section className="py-20 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-700 bg-blue-900/30 backdrop-blur-sm">
          <span className="text-sm font-medium text-blue-200">MAGIC HAPPENS BY DATA SCIENCE</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Spot issues faster</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white">with smart indicators</h3>
      </motion.div>

      <div className="relative h-[400px] mb-16">
        <div ref={containerRef} className="absolute inset-0 flex items-center justify-center" />

        {/* Radial lines effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,#60a5fa_0%,transparent_70%)] opacity-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="relative p-6 bg-blue-900/50 backdrop-blur-sm border border-blue-700/40 rounded-xl h-full transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="bg-blue-800/30 p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 text-blue-300 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3a9 9 0 1 0 9 9"></path>
                    <path d="M12 3v9l5.2 3"></path>
                  </svg>
                  <span>Worst Months: Dec, Jan, Feb</span>
                </div>
                <div className="text-sm text-blue-200/70">It is not the right time to focus on this keyword.</div>
                <div className="mt-2 text-xs text-blue-300">
                  <span className="mr-2">Example:</span>
                  <span className="px-2 py-1 bg-blue-800/50 rounded">Ice Cream</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-100">Seasonality</h3>
              <p className="text-blue-200/70">Spot when any keywords' seasonality is trending and when losing</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
          >
            <div className="relative p-6 bg-blue-900/50 backdrop-blur-sm border border-blue-700/40 rounded-xl h-full transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="bg-blue-800/30 p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 text-blue-300 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Mobile Issue Detector</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-blue-200/70 mt-2">
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                    Desktop
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-orange-400 mr-1"></span>
                    Mobile
                  </span>
                </div>
                <div className="mt-3 h-8 relative">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-md"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-100">Mobile Issue Detector</h3>
              <p className="text-blue-200/70">
                When you have issues on mobile pages, we find them out by ranking differences.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="relative p-6 bg-blue-900/50 backdrop-blur-sm border border-blue-700/40 rounded-xl h-full transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="bg-blue-800/30 p-4 rounded-lg mb-4">
                <div className="flex items-center space-x-2 text-blue-300 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <span>Keyword: iPhone 14 Pro Max</span>
                </div>
                <div className="text-sm text-blue-200/70">Find the best moments to celebrate!</div>
                <div className="mt-3 flex items-end space-x-1 h-10">
                  {[4, 2, 5, 1, 3, 2, 1, 6, 2, 1, 4, 5].map((h, i) => (
                    <div key={i} className="w-2 bg-purple-500/70 rounded-sm" style={{ height: `${h * 15}%` }}></div>
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-100">Best Rank Spotter</h3>
              <p className="text-blue-200/70">
                Analyzes the history of ranking and letting you know when you spot the best rank.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

