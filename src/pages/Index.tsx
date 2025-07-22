import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Icon from '@/components/ui/icon'

const Index = () => {
  const [score, setScore] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  const [clickAnimation, setClickAnimation] = useState(false)
  const [totalClicks, setTotalClicks] = useState(0)
  const [factories, setFactories] = useState(0)
  
  // Система уровней
  const [currentLevel, setCurrentLevel] = useState(1)
  const [totalClicksForLevel, setTotalClicksForLevel] = useState(0)
  
  const levels = [
    { level: 1, name: '🌱 Росток', clicksRequired: 100, emoji: '🌱' },
    { level: 2, name: '🌿 Побег', clicksRequired: 500, emoji: '🌿' },
    { level: 3, name: '🪴 Саженец', clicksRequired: 1200, emoji: '🪴' },
    { level: 4, name: '🌳 Молодое дерево', clicksRequired: 2000, emoji: '🌳' },
    { level: 5, name: '🎋 Бамбук', clicksRequired: 2800, emoji: '🎋' },
    { level: 6, name: '🌲 Ель', clicksRequired: 5000, emoji: '🌲' },
    { level: 7, name: '🌴 Пальма', clicksRequired: 7000, emoji: '🌴' },
    { level: 8, name: '🍃 Могучее дерево', clicksRequired: 10000, emoji: '🍃' },
    { level: 9, name: '🌺 Цветущее дерево', clicksRequired: 14000, emoji: '🌺' },
    { level: 10, name: '🌳 Дуб', clicksRequired: 20000, emoji: '🌳' }
  ]

  // Система тем
  const [currentTheme, setCurrentTheme] = useState('default')
  
  const themes = {
    default: {
      name: 'Земля',
      bg: 'from-blue-500 to-purple-600',
      icon: '🌍'
    },
    space: {
      name: 'Космос',
      bg: 'from-indigo-900 via-purple-900 to-black',
      icon: '🌌'
    },
    forest: {
      name: 'Лес',
      bg: 'from-green-600 to-emerald-800',
      icon: '🌲'
    }
  }

  // Автоматические кликеры
  useEffect(() => {
    if (autoClickers > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + autoClickers)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoClickers])

  // Фабрики
  useEffect(() => {
    if (factories > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + factories * 5)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [factories])

  // Проверка уровня
  useEffect(() => {
    const nextLevel = levels.find(l => l.level === currentLevel + 1)
    if (nextLevel && totalClicksForLevel >= nextLevel.clicksRequired) {
      setCurrentLevel(prev => prev + 1)
      setTotalClicksForLevel(0)
    }
  }, [totalClicksForLevel, currentLevel])

  // Сохранение игры
  useEffect(() => {
    const saveData = {
      score, clickPower, autoClickers, totalClicks, factories,
      currentLevel, totalClicksForLevel, currentTheme
    }
    localStorage.setItem('cosmicGardenSave', JSON.stringify(saveData))
  }, [score, clickPower, autoClickers, totalClicks, factories, currentLevel, totalClicksForLevel, currentTheme])

  // Загрузка игры
  useEffect(() => {
    const saved = localStorage.getItem('cosmicGardenSave')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setScore(data.score || 0)
        setClickPower(data.clickPower || 1)
        setAutoClickers(data.autoClickers || 0)
        setTotalClicks(data.totalClicks || 0)
        setFactories(data.factories || 0)
        setCurrentLevel(data.currentLevel || 1)
        setTotalClicksForLevel(data.totalClicksForLevel || 0)
        setCurrentTheme(data.currentTheme || 'default')
      } catch (e) {
        console.log('Ошибка загрузки:', e)
      }
    }
  }, [])

  const handleClick = () => {
    setScore(prev => prev + clickPower)
    setTotalClicks(prev => prev + 1)
    setTotalClicksForLevel(prev => prev + 1)
    
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 150)
  }

  const buyUpgrade = (type: string) => {
    if (type === 'power' && score >= 10) {
      setScore(prev => prev - 10)
      setClickPower(prev => prev + 1)
    } else if (type === 'auto' && score >= 100) {
      setScore(prev => prev - 100)
      setAutoClickers(prev => prev + 1)
    } else if (type === 'factory' && score >= 1000) {
      setScore(prev => prev - 1000)
      setFactories(prev => prev + 1)
    }
  }

  const currentLevelData = levels.find(l => l.level === currentLevel)
  const nextLevelData = levels.find(l => l.level === currentLevel + 1)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].bg} p-4`}>
      <div className="container mx-auto max-w-6xl">
        
        {/* Шапка с информацией */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            🌱 Космический Сад 🌱
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge className="text-2xl p-3 bg-yellow-500 hover:bg-yellow-400">
              💰 {score.toLocaleString()} очков
            </Badge>
            <Badge className="text-xl p-2 bg-blue-500 hover:bg-blue-400">
              👆 Сила клика: {clickPower}
            </Badge>
            <Badge className="text-xl p-2 bg-green-500 hover:bg-green-400">
              🤖 Автокликеры: {autoClickers}
            </Badge>
            <Badge className="text-xl p-2 bg-purple-500 hover:bg-purple-400">
              🏭 Фабрики: {factories}
            </Badge>
          </div>

          {/* Уровень */}
          <div className="mb-6">
            <div className="text-3xl text-white mb-2">
              {currentLevelData?.name} (Уровень {currentLevel})
            </div>
            <div className={`text-sm ${currentTheme === 'space' ? 'text-gray-300' : 'text-gray-200'}`}>
              Прогресс: {totalClicksForLevel} / {nextLevelData?.clicksRequired || '∞'} кликов
            </div>
            {nextLevelData && (
              <div className="w-64 mx-auto mt-2 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (totalClicksForLevel / nextLevelData.clicksRequired) * 100)}%`
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Основная кнопка */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center">
            <Button
              onClick={handleClick}
              className={`w-80 h-80 rounded-full text-8xl bg-gradient-to-br from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 border-8 border-white shadow-2xl transition-all duration-200 ${
                clickAnimation ? 'scale-95' : 'hover:scale-105'
              }`}
              style={{fontFamily: 'Comic Sans MS, cursive'}}
            >
              <div className="text-center">
                <div className="text-9xl mb-2">{currentLevelData?.emoji}</div>
              </div>
            </Button>
          </div>

          {/* Магазин улучшений */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white text-center mb-6">🛒 Магазин</h2>
            
            <Card className="p-4 bg-white/90">
              <h3 className="font-bold text-lg mb-2">💪 Сила клика</h3>
              <p className="text-sm text-gray-600 mb-3">Увеличивает очки за клик</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">+1 к клику</span>
                <Button 
                  onClick={() => buyUpgrade('power')}
                  disabled={score < 10}
                  size="sm"
                >
                  10 💰
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-white/90">
              <h3 className="font-bold text-lg mb-2">🤖 Автокликер</h3>
              <p className="text-sm text-gray-600 mb-3">+1 очко в секунду</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">1/сек</span>
                <Button 
                  onClick={() => buyUpgrade('auto')}
                  disabled={score < 100}
                  size="sm"
                >
                  100 💰
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-white/90">
              <h3 className="font-bold text-lg mb-2">🏭 Фабрика</h3>
              <p className="text-sm text-gray-600 mb-3">+5 очков в секунду</p>
              <div className="flex justify-between items-center">
                <span className="font-bold">5/сек</span>
                <Button 
                  onClick={() => buyUpgrade('factory')}
                  disabled={score < 1000}
                  size="sm"
                >
                  1000 💰
                </Button>
              </div>
            </Card>

            {/* Смена темы */}
            <Card className="p-4 bg-white/90">
              <h3 className="font-bold text-lg mb-3">🎨 Сменить тему</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(themes).map(([key, theme]) => (
                  <Button
                    key={key}
                    onClick={() => setCurrentTheme(key)}
                    variant={currentTheme === key ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    {theme.icon} {theme.name}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-200">Всего кликов</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{(autoClickers + factories * 5).toLocaleString()}</div>
              <div className="text-sm text-gray-200">Очков/сек</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{currentLevel}</div>
              <div className="text-sm text-gray-200">Уровень</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{themes[currentTheme].icon}</div>
              <div className="text-sm text-gray-200">Тема</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index