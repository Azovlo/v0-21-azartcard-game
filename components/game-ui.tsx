"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameState } from "./blackjack-game"

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
  const betAmounts = [10, 25, 50, 100, 250]

  return (
    <>
      {/* Top bar - Balance and scores */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        <Card className="px-6 py-3 bg-card/90 backdrop-blur-sm border-primary/20">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Баланс</p>
              <p className="text-2xl font-bold text-primary">{balance}₽</p>
            </div>
            {currentBet > 0 && (
              <div className="border-l border-border pl-4">
                <p className="text-sm text-muted-foreground">Ставка</p>
                <p className="text-2xl font-bold text-foreground">{currentBet}₽</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="px-6 py-3 bg-card/90 backdrop-blur-sm border-primary/20">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Дилер</p>
              <p className="text-2xl font-bold text-foreground">{gameState === "playing" ? "?" : dealerScore}</p>
            </div>
            <div className="border-l border-border pl-6 text-center">
              <p className="text-sm text-muted-foreground">Игрок</p>
              <p className="text-2xl font-bold text-primary">{playerScore}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <Card className="p-6 bg-card/90 backdrop-blur-sm border-primary/20">
          <div className="text-center mb-4">
            <p className="text-xl font-semibold text-foreground">{message}</p>
          </div>

          {gameState === "betting" && (
            <div className="flex items-center justify-center gap-3">
              {betAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => onPlaceBet(amount)}
                  disabled={amount > balance}
                  size="lg"
                  className="min-w-[80px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  {amount}₽
                </Button>
              ))}
            </div>
          )}

          {gameState === "playing" && (
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={onHit}
                size="lg"
                className="min-w-[120px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Взять карту
              </Button>
              <Button onClick={onStand} size="lg" variant="secondary" className="min-w-[120px] font-bold">
                Хватит
              </Button>
            </div>
          )}

          {gameState === "game-over" && (
            <div className="flex items-center justify-center">
              <Button
                onClick={onNewGame}
                size="lg"
                className="min-w-[160px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Новая игра
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
