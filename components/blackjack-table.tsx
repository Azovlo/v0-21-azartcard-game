"use client"
import type { Card as CardType, GameState } from "./blackjack-game"
import { PlayingCard } from "./playing-card"

type BlackjackTableProps = {
  playerCards: CardType[]
  dealerCards: CardType[]
  gameState: GameState
}

export function BlackjackTable({ playerCards, dealerCards, gameState }: BlackjackTableProps) {
  return (
    <group>
      {/* Table surface */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6, 6, 0.3, 64]} />
        <meshStandardMaterial color="#1a4d2e" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Table edge */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6.2, 6.2, 0.4, 64]} />
        <meshStandardMaterial color="#8b4513" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Table felt pattern */}
      <mesh receiveShadow position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial color="#0d3320" roughness={0.9} metalness={0} />
      </mesh>

      {/* Player cards */}
      {playerCards.map((card, index) => (
        <PlayingCard
          key={`player-${index}`}
          card={card}
          position={[-2 + index * 1.2, 0.2, 3]}
          rotation={[0, 0, 0]}
          delay={index * 0.3}
        />
      ))}

      {/* Dealer cards */}
      {dealerCards.map((card, index) => (
        <PlayingCard
          key={`dealer-${index}`}
          card={card}
          position={[-2 + index * 1.2, 0.2, -3]}
          rotation={[0, Math.PI, 0]}
          delay={index * 0.3}
          hidden={gameState === "playing" && index === 1}
        />
      ))}
    </group>
  )
}
