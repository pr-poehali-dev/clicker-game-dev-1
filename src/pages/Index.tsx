import { useState } from 'react'
import { Button } from "@/components/ui/button"

const Index = () => {
  const [score, setScore] = useState(0)

  const handleClick = () => {
    setScore(score + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          🌱 Космический Сад
        </h1>
        <div className="text-2xl text-white mb-8">
          Очки: {score}
        </div>
        <Button
          onClick={handleClick}
          className="w-32 h-32 rounded-full text-4xl bg-green-500 hover:bg-green-400"
        >
          🌱
        </Button>
      </div>
    </div>
  )
}

export default Index