"use client"

import { useMemo } from "react"
import { Cylinder, Plane } from "@react-three/drei"
import { PlayingCard, CardProps } from "./playing-card"
import { GameState } from "./blackjack-game"
import { motion } from "framer-motion"
import { MotionCanvas } from "framer-motion-3d"
import { MotionValue } from "framer-motion"
import { MotionConfig } from "framer-motion"
import { MotionContext } from "framer-motion"
import { MotionPlugins } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { LayoutGroup } from "framer-motion"
import { Reorder } from "framer-motion"
import { useCycle } from "framer-motion"
import { useScroll } from "framer-motion"
import { useSpring } from "framer-motion"
import { useTransform } from "framer-motion"
import { useVelocity } from "framer-motion"
import { useWillChange } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { useInView } from "framer-motion"
import { useAnimation } from "framer-motion"

type BlackjackTableProps = {
  playerCards: CardProps[]
  dealerCards: CardProps[]
  gameState: GameState
}

export function BlackjackTable({ playerCards, dealerCards, gameState }: BlackjackTableProps) {
  const tableRadius = 8
  const tableHeight = 1
  
  const feltMaterial = useMemo(() => <meshStandardMaterial color="#2E7D32" roughness={0.6} metalness={0.1} />, [])
  const woodMaterial = useMemo(() => <meshStandardMaterial color="#8D6E63" roughness={0.4} metalness={0.2} />, [])

  const cardPosition = (index: number, y: number, isPlayer: boolean) => {
    const offset = isPlayer ? -1.5 : 1.5;
    return [index * 1.5 - (isPlayer ? playerCards.length : dealerCards.length) * 0.75 + offset, y, 2] as const
  }
  
  const motionVariants = {
    hidden: { scale: 0, y: 1, z: 2 },
    visible: (i: number) => ({
      scale: 1, y: 1.1, z: 2,
      transition: { delay: i * 0.2, type: 'spring', stiffness: 150, damping: 20 },
    }),
  }

  return (
    <group>
      {/* Table Structure */}
      <Cylinder args={[tableRadius, tableRadius, tableHeight, 64]} position={[0, tableHeight / 2 - 1, 0]} castShadow receiveShadow>
        {woodMaterial}
      </Cylinder>
      <Cylinder args={[tableRadius - 0.2, tableRadius - 0.2, tableHeight + 0.02, 64]} position={[0, tableHeight / 2 - 1, 0]} receiveShadow>
        {feltMaterial}
      </Cylinder>

      {/* Ground plane */}
      <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial color="#1a1a1a" />
      </Plane>

      {/* Player's Cards */}
      {playerCards.map((card, i) => (
        <motion.group 
            key={`player-card-${i}`}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
            position={cardPosition(i, 1.05, true)}
        >
          <PlayingCard {...card} />
        </motion.group>
      ))}

      {/* Dealer's Cards */}
      {dealerCards.map((card, i) => {
        const isHidden = i === 1 && gameState === "playing"
        return (
          <motion.group
            key={`dealer-card-${i}`}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={motionVariants}
            position={cardPosition(i, 1.05, false)}
          >
            <PlayingCard {...card} isHidden={isHidden} />
          </motion.group>
        )
      })}
    </group>
  )
}
