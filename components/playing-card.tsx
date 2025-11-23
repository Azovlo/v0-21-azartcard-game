"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, RoundedBox } from "@react-three/drei"
import * as THREE from "three"

export type CardProps = {
  suit: "hearts" | "diamonds" | "clubs" | "spades"
  value: string
  isHidden?: boolean
}

export function PlayingCard({ suit, value, isHidden = false }: CardProps) {
  const meshRef = useRef<THREE.Group>(null)

  const suitSymbols = useMemo(() => ({
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  }), [])

  const color = useMemo(() => (suit === "hearts" || suit === "diamonds" ? "red" : "black"), [suit])

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Optional: Add any animations here, e.g., hover effect
    }
  })

  const cardMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "white",
    roughness: 0.5,
    metalness: 0.3,
  }), [])
  
  const backMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#4a148c",
    roughness: 0.3,
    metalness: 0.2,
  }), [])

  return (
    <group ref={meshRef} rotation={[0, isHidden ? Math.PI : 0, 0]}>
      {/* Card body */}
      <group>
        {/* Front Face */}
        <mesh position={[0,0,0.011]} material={cardMaterial}>
          <planeGeometry args={[0.9, 1.3]} />
        </mesh>
        
        {/* Back Face */}
         <mesh rotation={[0,Math.PI,0]} material={backMaterial}>
          <planeGeometry args={[0.9, 1.3]} />
        </mesh>
        
        {/* Edge */}
        <mesh>
            <extrudeGeometry args={[new THREE.Shape([
                new THREE.Vector2(-0.45, -0.65),
                new THREE.Vector2(0.45, -0.65),
                new THREE.Vector2(0.45, 0.65),
                new THREE.Vector2(-0.45, 0.65),
            ]), { depth: 0.02, bevelEnabled: false }]} />
            <meshStandardMaterial color="lightgray" />
        </mesh>
      </group>


      {!isHidden && (
        <>
          <Text position={[-0.35, 0.5, 0.02]} fontSize={0.12} color={color} anchorX="left" anchorY="top">
            {value}
          </Text>
          <Text position={[-0.35, 0.4, 0.02]} fontSize={0.1} color={color} anchorX="left" anchorY="top">
            {suitSymbols[suit]}
          </Text>
          <Text position={[0.35, -0.5, 0.02]} fontSize={0.12} color={color} anchorX="right" anchorY="bottom" rotation={[0, 0, Math.PI]}>
            {value}
          </Text>
           <Text position={[0.35, -0.4, 0.02]} fontSize={0.1} color={color} anchorX="right" anchorY="bottom" rotation={[0, 0, Math.PI]}>
            {suitSymbols[suit]}
          </Text>
          <Text position={[0, 0, 0.02]} fontSize={0.3} color={color} anchorX="center" anchorY="middle">
            {suitSymbols[suit]}
          </Text>
        </>
      )}
    </group>
  )
}
