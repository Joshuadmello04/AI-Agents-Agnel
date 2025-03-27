"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import * as THREE from "three"
import { PauseCircle, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GlobeSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<THREE.Group | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const satellitesRef = useRef<THREE.Group | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)
  const animationRef = useRef<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 7
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0) // transparent background
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create stars background
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 3000
    const starsPositions = new Float32Array(starsCount * 3)
    const starsSizes = new Float32Array(starsCount)
    const starsColors = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3
      starsPositions[i3] = (Math.random() - 0.5) * 100
      starsPositions[i3 + 1] = (Math.random() - 0.5) * 100
      starsPositions[i3 + 2] = (Math.random() - 0.5) * 100
      starsSizes[i] = Math.random() * 2 + 0.5

      // Random color between blue and purple
      const t = Math.random()
      starsColors[i3] = 0.5 + t * 0.3 // R: 0.5-0.8
      starsColors[i3 + 1] = 0.4 + t * 0.2 // G: 0.4-0.6
      starsColors[i3 + 2] = 0.8 + t * 0.2 // B: 0.8-1.0
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3))
    starsGeometry.setAttribute("size", new THREE.BufferAttribute(starsSizes, 1))
    starsGeometry.setAttribute("color", new THREE.BufferAttribute(starsColors, 3))

    const starsShader = {
      vertexShader: `
        attribute float size;
        attribute vec3 color;
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
          float dist = length(gl_PointCoord - vec2(0.5, 0.5));
          if (dist > 0.5) discard;
          float opacity = 1.0 - smoothstep(0.2, 0.5, dist);
          gl_FragColor = vec4(vColor, opacity);
        }
      `,
    }

    const starsMaterial = new THREE.ShaderMaterial({
      vertexShader: starsShader.vertexShader,
      fragmentShader: starsShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)
    starsRef.current = stars

    // Create globe
    const group = new THREE.Group()
    scene.add(group)
    globeRef.current = group

    // Create dot pattern texture for globe
    const createGlobeTexture = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 2048
      canvas.height = 1024
      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      // Fill with transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw dots in a pattern resembling continents
      ctx.fillStyle = "rgba(180, 180, 255, 0.9)"

      // World map approximation using dot clusters
      // North America
      drawDotCluster(ctx, 400, 360, 240, 160, 3000)
      // South America
      drawDotCluster(ctx, 560, 600, 120, 200, 2000)
      // Europe
      drawDotCluster(ctx, 1000, 340, 100, 80, 1500)
      // Africa
      drawDotCluster(ctx, 1050, 500, 150, 200, 2500)
      // Asia
      drawDotCluster(ctx, 1300, 400, 300, 200, 4000)
      // Australia
      drawDotCluster(ctx, 1500, 700, 140, 100, 1200)
      // Antarctica
      drawDotCluster(ctx, 1024, 900, 300, 80, 1000)

      return new THREE.CanvasTexture(canvas)
    }

    function drawDotCluster(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      dots: number,
    ) {
      for (let i = 0; i < dots; i++) {
        const dotX = x + (Math.random() - 0.5) * width * 2
        const dotY = y + (Math.random() - 0.5) * height * 2

        // Check if within ellipse
        const normalizedX = (dotX - x) / width
        const normalizedY = (dotY - y) / height
        if (normalizedX * normalizedX + normalizedY * normalizedY <= 1) {
          const dotSize = Math.random() * 1.2 + 0.8
          ctx.beginPath()
          ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const globeTexture = createGlobeTexture()

    // Globe sphere with gradient material
    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64)
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        globeTexture: { value: globeTexture },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D globeTexture;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Base gradient color - GitHub style blue to purple
          vec3 baseColor = mix(
            vec3(0.1, 0.2, 0.8),  // Deep blue
            vec3(0.4, 0.1, 0.8),  // Purple
            vNormal.y * 0.5 + 0.5
          );
          
          // Add some rim lighting
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          rim = pow(rim, 2.0);
          
          // Sample the dot texture
          vec4 dotPattern = texture2D(globeTexture, vUv);
          
          // Combine everything
          vec3 finalColor = baseColor;
          finalColor += dotPattern.rgb * 0.7;
          finalColor += vec3(0.3, 0.4, 1.0) * rim * 0.8;
          
          gl_FragColor = vec4(finalColor, 0.95);
        }
      `,
      transparent: true,
    })

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    group.add(sphere)

    // Add subtle wireframe
    const wireframeGeometry = new THREE.SphereGeometry(2.02, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x6a8cff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    })
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    group.add(wireframe)

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(2.1, 32, 32)
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.2 },
        p: { value: 4.0 },
        glowColor: { value: new THREE.Color(0x3b5cff) },
        time: { value: 0 },
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
        uniform float time;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
          // Pulse effect
          intensity *= 0.8 + 0.2 * sin(time * 0.5);
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

    // Create satellites and connection lines
    const satellitesGroup = new THREE.Group()
    scene.add(satellitesGroup)
    satellitesRef.current = satellitesGroup

    // Create orbit paths (visible ellipses)
    const createOrbitPath = (radiusX: number, radiusY: number, rotation: THREE.Euler, color: number) => {
      const curve = new THREE.EllipseCurve(
        0,
        0, // Center x, y
        radiusX,
        radiusY, // xRadius, yRadius
        0,
        2 * Math.PI, // startAngle, endAngle
        false, // clockwise
        0, // rotation
      )

      const points = curve.getPoints(100)
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      // Convert 2D points to 3D
      const positions = new Float32Array(points.length * 3)
      for (let i = 0; i < points.length; i++) {
        positions[i * 3] = points[i].x
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = points[i].y
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
      })

      const ellipse = new THREE.Line(geometry, material)
      ellipse.rotation.copy(rotation)

      satellitesGroup.add(ellipse)
    }

    // Create satellite objects with more complex orbits
    const createSatellite = (
      color: number,
      size: number,
      orbitRadiusX: number,
      orbitRadiusY: number,
      orbitSpeed: number,
      startAngle: number,
      rotationX: number,
      rotationZ: number,
    ) => {
      // Satellite body
      const satelliteGroup = new THREE.Group()

      // Set orbit rotation
      const orbitRotation = new THREE.Euler(rotationX, 0, rotationZ)
      satelliteGroup.rotation.copy(orbitRotation)

      // Create visible orbit path
      createOrbitPath(orbitRadiusX, orbitRadiusY, orbitRotation, color)

      // Satellite mesh - use a more complex shape for GitHub style
      const satelliteGeometry = new THREE.SphereGeometry(size, 16, 16)
      const satelliteMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 90,
      })

      const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial)

      // Add a glow to the satellite
      const satelliteGlowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16)
      const satelliteGlowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
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
          varying vec3 vNormal;
          void main() {
            float intensity = 1.0 - dot(vNormal, vec3(0, 0, 1.0));
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, intensity * 0.6);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      })

      const satelliteGlow = new THREE.Mesh(satelliteGlowGeometry, satelliteGlowMaterial)
      satellite.add(satelliteGlow)

      // Position on orbit
      satellite.userData = {
        orbitRadiusX,
        orbitRadiusY,
        orbitSpeed,
        angle: startAngle,
        originPoint: new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
          .normalize()
          .multiplyScalar(2), // Point on globe surface
      }

      // Update position
      updateSatellitePosition(satellite)

      // Create connection line
      const curvePoints = createCurvedLine(satellite.userData.originPoint, satellite.position, 0.8)
      const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints)

      // Use a shader material for the line to create a gradient effect
      const curveMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(color) },
          dashOffset: { value: 0 },
        },
        vertexShader: `
          attribute float linePosition;
          varying float vLinePosition;
          
          void main() {
            vLinePosition = position.y; // Use any component to track position along line
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float dashOffset;
          varying float vLinePosition;
          
          void main() {
            // Create a gradient along the line
            float opacity = smoothstep(0.0, 0.3, vLinePosition) * smoothstep(1.0, 0.7, vLinePosition);
            
            // Add animated dash pattern
            float dashPattern = fract((vLinePosition * 15.0) + dashOffset);
            opacity *= smoothstep(0.0, 0.5, dashPattern) * smoothstep(1.0, 0.5, dashPattern);
            
            gl_FragColor = vec4(color, opacity * 0.7);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })

      const curve = new THREE.Line(curveGeometry, curveMaterial)
      satellite.userData.curve = curve

      satelliteGroup.add(satellite)
      satelliteGroup.add(curve)
      satellitesGroup.add(satelliteGroup)

      return satellite
    }

    function updateSatellitePosition(satellite: THREE.Mesh) {
      const userData = satellite.userData

      // Update orbit angle
      userData.angle += userData.orbitSpeed

      // Calculate new position using elliptical orbit
      const x = Math.cos(userData.angle) * userData.orbitRadiusX
      const z = Math.sin(userData.angle) * userData.orbitRadiusY
      satellite.position.set(x, 0, z)

      // Update connection line with animated dash offset
      if (userData.curve && userData.curve.material instanceof THREE.ShaderMaterial) {
        userData.curve.material.uniforms.dashOffset.value += 0.01

        const curvePoints = createCurvedLine(userData.originPoint, satellite.position, 0.8)
        userData.curve.geometry.dispose()
        userData.curve.geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
      }
    }

    function createCurvedLine(start: THREE.Vector3, end: THREE.Vector3, curvature = 1.0) {
      // Create a curved line between two points
      const points = []
      const segments = 100

      // Control point for the curve (above the direct line)
      const mid = new THREE.Vector3().addVectors(start, end).divideScalar(2)
      const direction = new THREE.Vector3().subVectors(end, start).normalize()
      const perpendicular = new THREE.Vector3(direction.z, 0, -direction.x).normalize()

      // Adjust height of control point
      const controlPoint = mid.clone().add(perpendicular.clone().multiplyScalar(curvature + Math.random() * 0.5))

      // Create quadratic curve
      for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const point = new THREE.Vector3()

        // Quadratic Bezier curve formula
        point.x = Math.pow(1 - t, 2) * start.x + 2 * (1 - t) * t * controlPoint.x + Math.pow(t, 2) * end.x
        point.y = Math.pow(1 - t, 2) * start.y + 2 * (1 - t) * t * controlPoint.y + Math.pow(t, 2) * end.y
        point.z = Math.pow(1 - t, 2) * start.z + 2 * (1 - t) * t * controlPoint.z + Math.pow(t, 2) * end.z

        points.push(point)
      }

      return points
    }

    // Create satellites with elliptical orbits
    const satellites = [
      createSatellite(0x4a9eff, 0.3, 4.5, 4.0, 0.005, 0, Math.PI * 0.3, Math.PI * 0.1),
      createSatellite(0x8a4fff, 0.2, 5.0, 4.2, 0.003, Math.PI, Math.PI * 0.1, Math.PI * 0.25),
      createSatellite(0x4aff9e, 0.25, 4.2, 4.8, 0.004, Math.PI / 2, Math.PI * 0.2, Math.PI * 0.15),
      createSatellite(0xff4a9e, 0.18, 5.2, 4.5, 0.0035, Math.PI * 1.5, Math.PI * 0.15, Math.PI * 0.05),
    ]

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404080, 2)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x3b5cff, 2, 50)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x9333ea, 2, 50)
    pointLight2.position.set(-10, -10, -10)
    scene.add(pointLight2)

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate normalized mouse position (-1 to 1)
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      mousePosition.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mousePosition.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Set target rotation based on mouse position (limited range)
      targetRotation.current.x = mousePosition.current.y * 0.2
      targetRotation.current.y = mousePosition.current.x * 0.5
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      if (isPaused) return

      animationRef.current = requestAnimationFrame(animate)

      // Update time uniform for shaders
      if (sphere.material instanceof THREE.ShaderMaterial) {
        sphere.material.uniforms.time.value += 0.01
      }

      if (glowMesh.material instanceof THREE.ShaderMaterial) {
        glowMesh.material.uniforms.time.value += 0.01
      }

      // Smooth rotation towards target (mouse interaction)
      if (globeRef.current) {
        // Base rotation
        const baseRotationY = Date.now() * 0.0001

        // Smooth interpolation towards target rotation
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.05
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.05

        // Apply rotations
        globeRef.current.rotation.x = currentRotation.current.x
        globeRef.current.rotation.y = baseRotationY + currentRotation.current.y
      }

      // Update satellites
      satellites.forEach((satellite) => {
        updateSatellitePosition(satellite)
      })

      // Rotate stars slightly
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0001
        starsRef.current.rotation.x += 0.00005
      }

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth / containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }

      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isPaused])

  const toggleAnimation = () => {
    setIsPaused(!isPaused)

    if (isPaused && rendererRef.current && sceneRef.current && cameraRef.current) {
      // Restart animation
      const animate = () => {
        if (!isPaused) {
          animationRef.current = requestAnimationFrame(animate)
          rendererRef.current?.render(sceneRef.current!, cameraRef.current!)
        }
      }
      animate()
    }
  }

  return (
    <section className="py-20 relative overflow-hidden bg-black">
      {/* Stars background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0f1642_0%,#000000_70%)]"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-8 relative z-10"
      >
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-700 bg-[#0a0118]/30 backdrop-blur-sm">
          <span className="text-sm font-medium text-purple-200">MAGIC HAPPENS BY DATA SCIENCE</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white glow-text">Spot issues faster</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-white glow-text">with smart indicators</h3>
      </motion.div>

      <div className="relative h-[500px] mb-8">
        <div ref={containerRef} className="absolute inset-0 flex items-center justify-center" />

        {/* Radial gradient under globe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,#3b5cff_0%,transparent_70%)] opacity-20"></div>
        </div>
      </div>

      {/* Pause/Play button */}
      <div className="flex justify-center relative z-10">
        <Button
          onClick={toggleAnimation}
          variant="ghost"
          className="text-white hover:bg-white/10 rounded-full px-6 py-2 flex items-center gap-2"
        >
          {isPaused ? (
            <>
              <PlayCircle className="w-5 h-5" />
              <span>Play</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-5 h-5" />
              <span>Pause</span>
            </>
          )}
        </Button>
      </div>
    </section>
  )
}

