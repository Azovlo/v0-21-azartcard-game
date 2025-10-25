"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { BlackjackTable } from "./blackjack-table"
import { GameUI } from "./game-ui"
import { useState, useCallback } from "react"

export type Card = {
  suit: "hearts" | "diamonds" | "clubs" | "spades"
  value: string
  numericValue: number
}

export type GameState = "betting" | "playing" | "dealer-turn" | "game-over"

export function BlackjackGame() {
  const [playerCards, setPlayerCards] = useState<Card[]>([])
  const [dealerCards, setDealerCards] = useState<Card[]>([])
  const [gameState, setGameState] = useState<GameState>("betting")
  const [balance, setBalance] = useState(1000)
  const [currentBet, setCurrentBet] = useState(0)
  const [message, setMessage] = useState("Сделайте ставку")

  const createDeck = useCallback((): Card[] => {
    const suits: Card["suit"][] = ["hearts", "diamonds", "clubs", "spades"]
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    const deck: Card[] = []

    for (const suit of suits) {
      for (const value of values) {
        let numericValue = Number.parseInt(value)
        if (value === "J" || value === "Q" || value === "K") numericValue = 10
        if (value === "A") numericValue = 11
        deck.push({ suit, value, numericValue })
      }
    }

    return deck.sort(() => Math.random() - 0.5)
  }, [])

  const calculateScore = useCallback((cards: Card[]): number => {
    let score = cards.reduce((sum, card) => sum + card.numericValue, 0)
    let aces = cards.filter((card) => card.value === "A").length

    while (score > 21 && aces > 0) {
      score -= 10
      aces--
    }

    return score
  }, [])

  const placeBet = useCallback(
    (amount: number) => {
      if (amount > balance) return
      setCurrentBet(amount)
      setBalance(balance - amount)

      const deck = createDeck()
      const newPlayerCards = [deck[0], deck[2]]
      const newDealerCards = [deck[1], deck[3]]

      setPlayerCards(newPlayerCards)
      setDealerCards(newDealerCards)
      setGameState("playing")
      setMessage("Ваш ход")
    },
    [balance, createDeck],
  )

  const hit = useCallback(() => {
    const deck = createDeck()
    const newCard = deck[0]
    const newPlayerCards = [...playerCards, newCard]
    setPlayerCards(newPlayerCards)

    const score = calculateScore(newPlayerCards)
    if (score > 21) {
      setGameState("game-over")
      setMessage(`Перебор! Вы проиграли ${currentBet}₽`)
    }
  }, [playerCards, createDeck, calculateScore, currentBet])

  const stand = useCallback(() => {
    setGameState("dealer-turn")
    setMessage("Ход дилера...")

    let newDealerCards = [...dealerCards]
    const deck = createDeck()
    let deckIndex = 0

    const dealerInterval = setInterval(() => {
      const dealerScore = calculateScore(newDealerCards)

      if (dealerScore < 17) {
        newDealerCards = [...newDealerCards, deck[deckIndex++]]
        setDealerCards(newDealerCards)
      } else {
        clearInterval(dealerInterval)

        const playerScore = calculateScore(playerCards)
        const finalDealerScore = calculateScore(newDealerCards)

        if (finalDealerScore > 21) {
          setBalance(balance + currentBet * 2)
          setMessage(`Дилер перебрал! Вы выиграли ${currentBet}₽`)
        } else if (playerScore > finalDealerScore) {
          setBalance(balance + currentBet * 2)
          setMessage(`Вы выиграли ${currentBet}₽!`)
        } else if (playerScore === finalDealerScore) {
          setBalance(balance + currentBet)
          setMessage("Ничья! Ставка возвращена")
        } else {
          setMessage(`Вы проиграли ${currentBet}₽`)
        }

        setGameState("game-over")
      }
    }, 1000)
  }, [dealerCards, playerCards, balance, currentBet, createDeck, calculateScore])

  const newGame = useCallback(() => {
    setPlayerCards([])
    setDealerCards([])
    setCurrentBet(0)
    setGameState("betting")
    setMessage("Сделайте ставку")
  }, [])

  return (
    <div className="w-full h-screen relative">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 8, 12]} fov={50} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={10}
          maxDistance={20}
        />

        <ambientLight intensity={0.3} />
        <spotLight
          position={[0, 15, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffd700" />
        <pointLight position={[10, 10, -10]} intensity={0.5} color="#ffd700" />

        <Environment preset="night" />

        <BlackjackTable playerCards={playerCards} dealerCards={dealerCards} gameState={gameState} />
      </Canvas>

      <GameUI
        balance={balance}
        currentBet={currentBet}
        gameState={gameState}
        message={message}
        playerScore={calculateScore(playerCards)}
        dealerScore={calculateScore(dealerCards)}
        onPlaceBet={placeBet}
        onHit={hit}
        onStand={stand}
        onNewGame={newGame}
      />
    </div>
  )
}
