"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import type * as THREE from "three"
import type { Card } from "./blackjack-game"

type PlayingCardProps = {
  card: Card
  position: [number, number, number]
  rotation: [number, number, number]
  delay?: number
  hidden?: boolean
}

export function PlayingCard({ card, position, rotation, delay = 0, hidden = false }: PlayingCardProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [startTime] = useState(Date.now())

  useFrame(() => {
    if (!meshRef.current) return

    const elapsed = (Date.now() - startTime) / 1000
    const progress = Math.min((elapsed - delay) / 0.5, 1)

    if (progress > 0 && progress < 1) {
      setAnimationProgress(progress)

      const startY = 5
      const endY = position[1]
      const currentY = startY + (endY - startY) * progress

      meshRef.current.position.y = currentY
      meshRef.current.rotation.x = (1 - progress) * Math.PI * 2
    } else if (progress >= 1) {
      meshRef.current.position.set(...position)
      meshRef.current.rotation.set(...rotation)
    }
  })

  const getSuitColor = (suit: Card["suit"]) => {
    return suit === "hearts" || suit === "diamonds" ? "#dc2626" : "#000000"
  }

  const getSuitSymbol = (suit: Card["suit"]) => {
    const symbols = {
      hearts: "♥",
      diamonds: "♦",
      clubs: "♣",
      spades: "♠",
    }
    return symbols[suit]
  }

  return (
    <group ref={meshRef} position={[position[0], 5, position[2]]}>
      {/* Card body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.02, 1.3]} />
        <meshStandardMaterial color={hidden ? "#1a4d2e" : "#ffffff"} roughness={0.3} metalness={0.1} />
      </mesh>

      {!hidden && (
        <>
          {/* Card value - top left */}
          <Text
            position={[-0.3, 0.015, -0.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.15}
            color={getSuitColor(card.suit)}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf"
          >
            {card.value}
          </Text>

          {/* Suit symbol - top left */}
          <Text
            position={[-0.3, 0.015, -0.35]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.12}
            color={getSuitColor(card.suit)}
            anchorX="center"
            anchorY="middle"
          >
            {getSuitSymbol(card.suit)}
          </Text>

          {/* Center suit symbol */}
          <Text
            position={[0, 0.015, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.4}
            color={getSuitColor(card.suit)}
            anchorX="center"
            anchorY="middle"
          >
            {getSuitSymbol(card.suit)}
          </Text>

          {/* Card value - bottom right */}
          <Text
            position={[0.3, 0.015, 0.5]}
            rotation={[-Math.PI / 2, 0, Math.PI]}
            fontSize={0.15}
            color={getSuitColor(card.suit)}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Geist-Bold.ttf"
          >
            {card.value}
          </Text>

          {/* Suit symbol - bottom right */}
          <Text
            position={[0.3, 0.015, 0.35]}
            rotation={[-Math.PI / 2, 0, Math.PI]}
            fontSize={0.12}
            color={getSuitColor(card.suit)}
            anchorX="center"
            anchorY="middle"
          >
            {getSuitSymbol(card.suit)}
          </Text>
        </>
      )}

      {hidden && (
        <>
          {/* Card back pattern */}
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.7, 1.1]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
          <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 1.0]} />
            <meshStandardMaterial color="#d4af37" />
          </mesh>
        </>
      )}
    </group>
  )
}
