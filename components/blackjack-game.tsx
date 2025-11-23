"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera } from "@react-three/drei"
import { BlackjackTable } from "./blackjack-table"
import { GameUI } from "./game-ui"
import { useState, useCallback, useEffect } from "react"

export type Card = {
  suit: "hearts" | "diamonds" | "clubs" | "spades"
  value: string
  numericValue: number
}

export type GameState = "betting" | "playing" | "dealer-turn" | "game-over"

// Helper function to create a shuffled deck of cards
const createShuffledDeck = (): Card[] => {
  const suits: Card["suit"][] = ["hearts", "diamonds", "clubs", "spades"]
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
  let deck: Card[] = []

  for (const suit of suits) {
    for (const value of values) {
      let numericValue = parseInt(value)
      if (["J", "Q", "K"].includes(value)) numericValue = 10
      if (value === "A") numericValue = 11
      deck.push({ suit, value, numericValue })
    }
  }

  // Fisher-Yates shuffle algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export function BlackjackGame() {
  const [deck, setDeck] = useState<Card[]>([])
  const [playerCards, setPlayerCards] = useState<Card[]>([])
  const [dealerCards, setDealerCards] = useState<Card[]>([])
  const [gameState, setGameState] = useState<GameState>("betting")
  const [balance, setBalance] = useState(1000)
  const [currentBet, setCurrentBet] = useState(0)
  const [message, setMessage] = useState("Сделайте вашу ставку")

  const calculateScore = useCallback((cards: Card[]): number => {
    let score = cards.reduce((sum, card) => sum + card.numericValue, 0)
    let aces = cards.filter((card) => card.value === "A").length

    while (score > 21 && aces > 0) {
      score -= 10
      aces--
    }

    return score
  }, [])
  
  const resetGame = useCallback(() => {
    setPlayerCards([])
    setDealerCards([])
    setCurrentBet(0)
    setGameState("betting")
    setMessage("Сделайте вашу ставку")
  }, [])

  const placeBet = useCallback(
    (amount: number) => {
      if (amount <= 0 || amount > balance) {
        setMessage("Неверная ставка")
        return
      }

      setBalance((prev) => prev - amount)
      setCurrentBet(amount)
      
      const newDeck = createShuffledDeck()
      const playerHand = [newDeck.pop()!, newDeck.pop()!]
      const dealerHand = [newDeck.pop()!, newDeck.pop()!]
      
      setPlayerCards(playerHand)
      setDealerCards(dealerHand)
      setDeck(newDeck)

      const playerScore = calculateScore(playerHand)
      const dealerScore = calculateScore(dealerHand)
      
      if (playerScore === 21 && dealerScore === 21) {
        setMessage("Ничья! У обоих блэкджек. Ставка возвращена.")
        setBalance(prev => prev + amount)
        setGameState("game-over")
      } else if (playerScore === 21) {
        setMessage(`Блэкджек! Вы выиграли ${amount * 1.5}₽`)
        setBalance(prev => prev + amount + amount * 1.5)
        setGameState("game-over")
      } else if (dealerScore === 21) {
        setMessage("У дилера блэкджек! Вы проиграли.")
        setGameState("game-over")
      } else {
        setGameState("playing")
        setMessage("Ваш ход: Взять карту или остановиться?")
      }
    },
    [balance, calculateScore],
  )

  const hit = useCallback(() => {
    if (gameState !== "playing" || !deck.length) return

    const newDeck = [...deck]
    const newCard = newDeck.pop()!
    const newPlayerCards = [...playerCards, newCard]

    setPlayerCards(newPlayerCards)
    setDeck(newDeck)

    if (calculateScore(newPlayerCards) > 21) {
      setMessage(`Перебор! Вы проиграли ${currentBet}₽`)
      setGameState("game-over")
    }
  }, [deck, playerCards, gameState, calculateScore, currentBet])

  const stand = useCallback(() => {
    if (gameState !== "playing") return
    setGameState("dealer-turn")
    setMessage("Ход дилера...")
  }, [gameState])
  
  useEffect(() => {
    if (gameState === "dealer-turn") {
      const dealerPlay = (currentDealerCards: Card[], currentDeck: Card[]): void => {
        const dealerScore = calculateScore(currentDealerCards)
        
        if (dealerScore >= 17) {
          // Dealer stands, determine winner
          const playerScore = calculateScore(playerCards)
          
          if (dealerScore > 21 || playerScore > dealerScore) {
            setMessage(`Вы выиграли ${currentBet}₽!`)
            setBalance(prev => prev + currentBet * 2)
          } else if (playerScore === dealerScore) {
            setMessage("Ничья! Ставка возвращена")
            setBalance(prev => prev + currentBet)
          } else {
            setMessage(`Вы проиграли ${currentBet}₽`)
          }
          setGameState("game-over")
          return
        }
        
        // Dealer hits
        setTimeout(() => {
          const newDeck = [...currentDeck]
          const newCard = newDeck.pop()!
          const newDealerCards = [...currentDealerCards, newCard]
          setDealerCards(newDealerCards)
          setDeck(newDeck)
          dealerPlay(newDealerCards, newDeck)
        }, 1000)
      }
      
      dealerPlay(dealerCards, deck)
    }
  }, [gameState, dealerCards, playerCards, deck, currentBet, calculateScore])


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
        onNewGame={resetGame}
      />
    </div>
  )
}
