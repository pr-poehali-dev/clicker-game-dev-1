import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Index = () => {
  const [score, setScore] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [autoClickers, setAutoClickers] = useState(0)
  const [clickAnimation, setClickAnimation] = useState(false)
  const [totalClicks, setTotalClicks] = useState(0)
  const [factories, setFactories] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [totalClicksForLevel, setTotalClicksForLevel] = useState(0)
  const [currentTheme, setCurrentTheme] = useState('default')
  const [activeTab, setActiveTab] = useState('main')
  
  const levels = [
    { level: 1, name: '🌱 Росток', clicksRequired: 100, emoji: '🌱' },
    { level: 2, name: '🌿 Побег', clicksRequired: 500, emoji: '🌿' },
    { level: 3, name: '🪴 Саженец', clicksRequired: 1200, emoji: '🪴' },
    { level: 4, name: '🌳 Молодое дерево', clicksRequired: 2000, emoji: '🌳' },
    { level: 5, name: '🎋 Бамбук', clicksRequired: 2800, emoji: '🎋' }
  ]

  const themes = {
    default: { name: 'Земля', bg: 'from-blue-500 to-purple-600', icon: '🌍' },
    space: { name: 'Космос', bg: 'from-indigo-900 via-purple-900 to-black', icon: '🌌' },
    forest: { name: 'Лес', bg: 'from-green-600 to-emerald-800', icon: '🌲' }
  }

  // Автокликеры
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

  // Сохранение
  useEffect(() => {
    const saveData = { score, clickPower, autoClickers, totalClicks, factories, currentLevel, totalClicksForLevel, currentTheme }
    localStorage.setItem('cosmicGardenSave', JSON.stringify(saveData))
  }, [score, clickPower, autoClickers, totalClicks, factories, currentLevel, totalClicksForLevel, currentTheme])

  // Загрузка
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

  const resetGame = () => {
    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
      localStorage.removeItem('cosmicGardenSave')
      setScore(0)
      setClickPower(1)
      setAutoClickers(0)
      setTotalClicks(0)
      setFactories(0)
      setCurrentLevel(1)
      setTotalClicksForLevel(0)
      setCurrentTheme('default')
    }
  }

  const currentLevelData = levels.find(l => l.level === currentLevel)
  const nextLevelData = levels.find(l => l.level === currentLevel + 1)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].bg} p-4`}>
      <div className="container mx-auto max-w-6xl">
        
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">🌱 Космический Сад 🌱</h1>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge className="text-2xl p-3 bg-yellow-500">💰 {score.toLocaleString()}</Badge>
            <Badge className="text-xl p-2 bg-blue-500">👆 Сила: {clickPower}</Badge>
            <Badge className="text-xl p-2 bg-green-500">🤖 Авто: {autoClickers}</Badge>
            <Badge className="text-xl p-2 bg-purple-500">🏭 Фабрики: {factories}</Badge>
          </div>

          {/* Уровень */}
          <div className="mb-6">
            <div className="text-3xl text-white mb-2">
              {currentLevelData?.name} (Уровень {currentLevel})
            </div>
            <div className="text-sm text-gray-200">
              Прогресс: {totalClicksForLevel} / {nextLevelData?.clicksRequired || '∞'}
            </div>
            {nextLevelData && (
              <div className="w-64 mx-auto mt-2 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{width: `${Math.min(100, (totalClicksForLevel / nextLevelData.clicksRequired) * 100)}%`}}
                />
              </div>
            )}
          </div>
        </div>

        {/* Табы */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/20 rounded-lg p-1 gap-1">
            <Button
              onClick={() => setActiveTab('main')}
              variant={activeTab === 'main' ? 'default' : 'ghost'}
              className={activeTab === 'main' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}
            >
              🌱 Основное
            </Button>
            <Button
              onClick={() => setActiveTab('settings')}
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className={activeTab === 'settings' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}
            >
              ⚙️ Настройки
            </Button>
          </div>
        </div>

        {activeTab === 'main' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Основная кнопка */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center">
              <Button
                onClick={handleClick}
                className={`w-80 h-80 rounded-full text-8xl bg-gradient-to-br from-green-400 to-emerald-600 hover:from-green-300 hover:to-emerald-500 border-8 border-white shadow-2xl transition-all duration-200 ${
                  clickAnimation ? 'scale-95' : 'hover:scale-105'
                }`}
              >
                <div className="text-center">
                  <div className="text-9xl mb-2">{currentLevelData?.emoji}</div>
                </div>
              </Button>
            </div>

            {/* Магазин */}
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
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-4">
            
            {/* Смена темы */}
            <Card className="p-6 bg-white/90">
              <h3 className="font-bold text-xl mb-4">🎨 Смена темы</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(themes).map(([key, theme]) => (
                  <Button
                    key={key}
                    onClick={() => setCurrentTheme(key)}
                    variant={currentTheme === key ? "default" : "outline"}
                    className="h-16 text-lg"
                  >
                    {theme.icon} {theme.name}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Сброс игры */}
            <Card className="p-6 bg-white/90">
              <h3 className="font-bold text-xl mb-4">💾 Сохранение игры</h3>
              <div className="space-y-3">
                <p className="text-gray-600">Игра автоматически сохраняется в браузере.</p>
                <Button 
                  onClick={resetGame} 
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3"
                >
                  🗑️ Сбросить всё
                </Button>
              </div>
            </Card>

            {/* Статистика */}
            <Card className="p-6 bg-white/90">
              <h3 className="font-bold text-xl mb-4">📊 Статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{score.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Очков</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Кликов</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{currentLevel}</div>
                  <div className="text-sm text-gray-600">Уровень</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{(autoClickers + factories * 5).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Очков/сек</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index