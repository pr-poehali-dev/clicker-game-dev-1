import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Icon from '@/components/ui/icon'

const Index = () => {
  const [score, setScore] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  const [clicksPerSecond, setClicksPerSecond] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [clickAnimation, setClickAnimation] = useState(false)

  // Магазин апгрейдов
  const upgrades = [
    { id: 'power', name: 'Мощный Клик', cost: 50, effect: 'Увеличивает силу клика на 1', owned: 0 },
    { id: 'auto', name: 'Авто-кликер', cost: 100, effect: 'Автоматически кликает 1 раз в секунду', owned: 0 },
    { id: 'multiplier', name: 'Мультипликатор', cost: 500, effect: 'Удваивает очки за клик', owned: 0 }
  ]

  // Достижения
  const achievements = [
    { id: 'first', name: 'Первый клик', description: 'Сделать первый клик', condition: (s: number) => s >= 1, unlocked: false },
    { id: 'hundred', name: 'Сотня', description: 'Набрать 100 очков', condition: (s: number) => s >= 100, unlocked: false },
    { id: 'thousand', name: 'Тысяча', description: 'Набрать 1000 очков', condition: (s: number) => s >= 1000, unlocked: false }
  ]

  const [upgradesList, setUpgradesList] = useState(upgrades)
  const [achievementsList, setAchievementsList] = useState(achievements)

  // Автоматические клики
  useEffect(() => {
    if (autoClickers > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + autoClickers)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoClickers])

  // Подсчет кликов в секунду
  useEffect(() => {
    const now = Date.now()
    if (now - lastClickTime < 1000) {
      setClicksPerSecond(prev => prev + 1)
    } else {
      setClicksPerSecond(1)
    }
    setLastClickTime(now)

    const timeout = setTimeout(() => {
      setClicksPerSecond(0)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [score])

  // Проверка достижений
  useEffect(() => {
    setAchievementsList(prev => 
      prev.map(achievement => ({
        ...achievement,
        unlocked: achievement.condition(score)
      }))
    )
  }, [score])

  const handleClick = () => {
    setScore(prev => prev + clickPower)
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 200)
  }

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgradesList.find(u => u.id === upgradeId)
    if (!upgrade || score < upgrade.cost) return

    setScore(prev => prev - upgrade.cost)
    setUpgradesList(prev => 
      prev.map(u => 
        u.id === upgradeId 
          ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.5) }
          : u
      )
    )

    // Применяем эффекты
    if (upgradeId === 'power') {
      setClickPower(prev => prev + 1)
    } else if (upgradeId === 'auto') {
      setAutoClickers(prev => prev + 1)
    } else if (upgradeId === 'multiplier') {
      setClickPower(prev => prev * 2)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Шапка */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            🎮 Супер Кликер 🎮
          </h1>
          <div className="flex justify-center gap-8 text-white text-xl font-semibold">
            <div className="bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
              💰 Очки: {score.toLocaleString()}
            </div>
            <div className="bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
              ⚡ Сила клика: {clickPower}
            </div>
            <div className="bg-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
              🤖 Авто: {autoClickers}/сек
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Игровая зона */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="relative mb-8">
              <Button
                onClick={handleClick}
                className={`w-80 h-80 rounded-full text-8xl bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 border-8 border-white shadow-2xl transition-all duration-200 ${
                  clickAnimation ? 'scale-95' : 'hover:scale-105'
                }`}
                style={{fontFamily: 'Comic Sans MS, cursive'}}
              >
                <img 
                  src="/img/c67dac53-93f2-4502-9446-78176cf00d79.jpg" 
                  alt="Кликер" 
                  className="w-full h-full object-cover rounded-full"
                />
              </Button>
              {clickAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-6xl font-bold text-white animate-bounce">+{clickPower}</span>
                </div>
              )}
            </div>

            {clicksPerSecond > 0 && (
              <div className="text-center">
                <Badge variant="secondary" className="text-2xl px-6 py-2 bg-white/90">
                  🔥 {clicksPerSecond} кликов/сек
                </Badge>
              </div>
            )}

            {/* События и мини-игры (заглушки) */}
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
              <Button className="h-16 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-bold rounded-2xl">
                <Icon name="Zap" className="mr-2" />
                Событие
              </Button>
              <Button className="h-16 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-300 hover:to-pink-400 text-white font-bold rounded-2xl">
                <Icon name="Gamepad2" className="mr-2" />
                Мини-игра
              </Button>
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Магазин */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-4 text-center text-purple-700" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                🛒 Магазин
              </h2>
              <div className="space-y-4">
                {upgradesList.map(upgrade => (
                  <div key={upgrade.id} className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{upgrade.name}</h3>
                      <Badge variant="outline">{upgrade.owned}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{upgrade.effect}</p>
                    <Button 
                      onClick={() => buyUpgrade(upgrade.id)}
                      disabled={score < upgrade.cost}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 rounded-xl"
                    >
                      💰 {upgrade.cost.toLocaleString()}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Достижения */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-4 text-center text-green-700" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                🏆 Достижения
              </h2>
              <div className="space-y-3">
                {achievementsList.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 rounded-2xl transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-green-200 to-emerald-200 border-2 border-green-400' 
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {achievement.unlocked ? '🏆' : '🔒'}
                      </span>
                      <div>
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Престиж (заглушка) */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-4 text-center text-red-700" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                ⭐ Престиж
              </h2>
              <div className="text-center">
                <p className="text-gray-600 mb-4">Очки престижа: 0</p>
                <Button disabled className="w-full bg-gradient-to-r from-red-400 to-pink-500 rounded-xl">
                  Сбросить прогресс (скоро)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index;