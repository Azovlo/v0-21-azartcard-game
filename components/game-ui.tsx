"use client"

import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { GameState } from "./blackjack-game"
import { motion, AnimatePresence } from "framer-motion"

type GameUIProps = {
  balance: number
  currentBet: number
  gameState: GameState
  message: string
  playerScore: number
  dealerScore: number
  onPlaceBet: (amount: number) => void
  onHit: () => void
  onStand: () => void
  onNewGame: () => void
}

export function GameUI({
  balance,
  currentBet,
  gameState,
  message,
  playerScore,
  dealerScore,
  onPlaceBet,
  onHit,
  onStand,
  onNewGame,
}: GameUIProps) {
  const betAmounts = [10, 50, 100, 200]

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  }

  const messageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  };


  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between p-4 md:p-8 pointer-events-none">
      {/* Top Section: Balance and Scores */}
      <div className="w-full flex justify-between items-start">
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="bg-black/40 text-white border-yellow-400 pointer-events-auto">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Баланс</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl md:text-4xl font-bold">{balance}₽</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <AnimatePresence>
        {(gameState === 'playing' || gameState === 'dealer-turn' || gameState === 'game-over') && (
            <motion.div 
                key="scores"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4"
            >
                <Card className="bg-black/50 text-white border-sky-400 pointer-events-auto">
                    <CardHeader><CardTitle className="text-lg">Ваши очки</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold text-center">{playerScore}</p></CardContent>
                </Card>
                <Card className="bg-black/50 text-white border-red-400 pointer-events-auto">
                    <CardHeader><CardTitle className="text-lg">Очки дилера</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-center">
                            {gameState === 'playing' ? '?' : dealerScore}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Center Section: Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          variants={messageVariants}
          initial="initial"
          animate="animate"
          exit="initial"
          className="text-center"
        >
          <p className="text-white text-2xl md:text-4xl font-bold bg-black/50 px-4 py-2 rounded-lg shadow-lg">
            {message}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Section: Controls */}
      <div className="w-full flex flex-col items-center gap-4 pointer-events-auto">
        <AnimatePresence>
          {gameState === "betting" && (
            <motion.div
              key="betting"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-wrap justify-center gap-2 md:gap-4"
            >
              {betAmounts.map((amount) => (
                <Button
                  key={amount}
                  className="text-lg md:text-xl px-6 py-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full shadow-lg transition transform hover:scale-105"
                  onClick={() => onPlaceBet(amount)}
                  disabled={balance < amount}
                >
                  {amount}₽
                </Button>
              ))}
            </motion.div>
          )}

          {gameState === "playing" && (
            <motion.div
              key="playing"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex gap-4"
            >
              <Button
                className="text-xl px-8 py-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105"
                onClick={onHit}
              >
                Взять
              </Button>
              <Button
                className="text-xl px-8 py-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105"
                onClick={onStand}
              >
                Остановиться
              </Button>
            </motion.div>
          )}

          {gameState === "game-over" && (
            <motion.div
              key="game-over"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Button
                className="text-xl px-8 py-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105"
                onClick={onNewGame}
              >
                Новая игра
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
