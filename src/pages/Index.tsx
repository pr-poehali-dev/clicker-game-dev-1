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
  
  // Состояние мини-игры с динамитами
  const [activeTab, setActiveTab] = useState('main')
  const [mineField, setMineField] = useState<Array<Array<{revealed: boolean, hasDynamite: boolean, reward: number, adjacentDynamites: number}>>>>([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [mineRewards, setMineRewards] = useState(0)
  const [minesRemaining, setMinesRemaining] = useState(8)
  const [gameStarted, setGameStarted] = useState(false)
  
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
      currentLevel, totalClicksForLevel, currentTheme, mineRewards
    }
    localStorage.setItem('cosmicGardenSave', JSON.stringify(saveData))
  }, [score, clickPower, autoClickers, totalClicks, factories, currentLevel, totalClicksForLevel, currentTheme, mineRewards])

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
        setMineRewards(data.mineRewards || 0)
      } catch (e) {
        console.log('Ошибка загрузки:', e)
      }
    }
  }, [])

  // Функция сброса игры
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
      setMineRewards(0)
      setActiveTab('main')
      resetMineGame()
    }
  }

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

  // Мини-игра с динамитами
  const initializeMineField = () => {
    const size = 8
    const dynamiteCount = 8
    const field = Array(size).fill(null).map(() => 
      Array(size).fill(null).map(() => ({
        revealed: false,
        hasDynamite: false,
        reward: Math.floor(Math.random() * 50) + 10,
        adjacentDynamites: 0
      }))
    )

    // Размещаем динамиты
    let placedDynamites = 0
    while (placedDynamites < dynamiteCount) {
      const row = Math.floor(Math.random() * size)
      const col = Math.floor(Math.random() * size)
      if (!field[row][col].hasDynamite) {
        field[row][col].hasDynamite = true
        field[row][col].reward = 0
        placedDynamites++
      }
    }

    // Подсчитываем соседние динамиты
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!field[row][col].hasDynamite) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = row + dr
              const nc = col + dc
              if (nr >= 0 && nr < size && nc >= 0 && nc < size && field[nr][nc].hasDynamite) {
                count++
              }
            }
          }
          field[row][col].adjacentDynamites = count
        }
      }
    }

    return field
  }

  const startMineGame = () => {
    setMineField(initializeMineField())
    setGameOver(false)
    setGameWon(false)
    setGameStarted(true)
    setMinesRemaining(8)
  }

  const resetMineGame = () => {
    setMineField([])
    setGameOver(false)
    setGameWon(false)
    setGameStarted(false)
    setMinesRemaining(8)
  }

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon || mineField[row][col].revealed) return

    const newField = mineField.map(r => r.map(c => ({ ...c })))
    
    if (newField[row][col].hasDynamite) {
      // Попали на динамит
      newField[row][col].revealed = true
      setMineField(newField)
      setGameOver(true)
      return
    }

    // Открываем клетку и получаем награду
    newField[row][col].revealed = true
    const reward = newField[row][col].reward
    setScore(prev => prev + reward)
    setMineRewards(prev => prev + reward)

    // Проверяем победу
    const revealedSafeCells = newField.flat().filter(cell => cell.revealed && !cell.hasDynamite).length
    const totalSafeCells = 64 - 8 // 8x8 - 8 динамитов
    
    if (revealedSafeCells === totalSafeCells) {
      setGameWon(true)
      setScore(prev => prev + 500) // Бонус за победу
    }

    setMineField(newField)
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
              onClick={() => setActiveTab('mines')}
              variant={activeTab === 'mines' ? 'default' : 'ghost'}
              className={activeTab === 'mines' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}
            >
              🧨 Мины
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
        )}

        {activeTab === 'mines' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-white mb-4">🧨 Минное поле</h2>
            <div className="flex justify-center gap-4 mb-4">
              <Badge className="text-xl p-2 bg-red-500">
                🧨 Осталось динамитов: {minesRemaining}
              </Badge>
              <Badge className="text-xl p-2 bg-green-500">
                💰 Наград с мин: {mineRewards.toLocaleString()}
              </Badge>
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              <Button onClick={startMineGame} className="bg-green-600 hover:bg-green-500">
                🎮 Новая игра
              </Button>
              <Button onClick={resetMineGame} variant="outline" className="text-white border-white hover:bg-white/20">
                🔄 Сброс
              </Button>
            </div>
          </div>

          {gameStarted && (
            <div className="bg-white/90 rounded-lg p-6 mb-6">
              {gameOver && (
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-red-600 mb-2">💥 Взрыв!</div>
                  <p className="text-gray-600">Вы попали на динамит. Попробуйте ещё раз!</p>
                </div>
              )}
              
              {gameWon && (
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-2">🎉 Победа!</div>
                  <p className="text-gray-600">Вы открыли все безопасные клетки! Бонус: +500 очков!</p>
                </div>
              )}
              
              <div className="grid grid-cols-8 gap-1 max-w-md mx-auto">
                {mineField.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <Button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => revealCell(rowIndex, colIndex)}
                      disabled={gameOver || gameWon || cell.revealed}
                      className={`
                        w-8 h-8 p-0 text-xs font-bold
                        ${cell.revealed 
                          ? cell.hasDynamite 
                            ? 'bg-red-500 hover:bg-red-500' 
                            : 'bg-green-500 hover:bg-green-500'
                          : 'bg-gray-300 hover:bg-gray-200'
                        }
                      `}
                    >
                      {cell.revealed ? (
                        cell.hasDynamite ? '🧨' : (
                          cell.adjacentDynamites > 0 ? cell.adjacentDynamites : '💰'
                        )
                      ) : '?'}
                    </Button>
                  ))
                )}
              </div>
              
              <div className="mt-4 text-center text-gray-600">
                <p>Осторожно: на поле 8 динамитов!</p>
                <p>Открывайте безопасные клетки для получения очков</p>
              </div>
            </div>
          )}
        </div>
        )}

        {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-white mb-4">⚙️ Настройки</h2>
          </div>

          <div className="space-y-4">
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

            {/* Управление сохранениями */}
            <Card className="p-6 bg-white/90">
              <h3 className="font-bold text-xl mb-4">💾 Сохранение игры</h3>
              <div className="space-y-3">
                <div className="text-gray-600 mb-4">
                  <p>Игра автоматически сохраняется в вашем браузере.</p>
                  <p>Вы можете сбросить весь прогресс, если хотите начать заново.</p>
                </div>
                
                <Button 
                  onClick={resetGame} 
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3"
                >
                  🗑️ Сбросить всё (Необратимо!)
                </Button>
              </div>
            </Card>

            {/* Статистика для настроек */}
            <Card className="p-6 bg-white/90">
              <h3 className="font-bold text-xl mb-4">📊 Полная статистика</h3>
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
                  <div className="text-2xl font-bold">{clickPower}</div>
                  <div className="text-sm text-gray-600">Сила клика</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{currentLevel}</div>
                  <div className="text-sm text-gray-600">Уровень</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{autoClickers}</div>
                  <div className="text-sm text-gray-600">Автокликеров</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{factories}</div>
                  <div className="text-sm text-gray-600">Фабрик</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{mineRewards.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Наград с мин</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded">
                  <div className="text-2xl font-bold">{(autoClickers + factories * 5).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Очков/сек</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        )}

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