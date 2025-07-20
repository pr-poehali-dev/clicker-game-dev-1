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
  const [totalClicks, setTotalClicks] = useState(0)
  const [prestigePoints, setPrestigePoints] = useState(0)
  const [prestigeMultiplier, setPrestigeMultiplier] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [factories, setFactories] = useState(0)
  const [goldenClickChance, setGoldenClickChance] = useState(0)

  // Магазин апгрейдов
  const upgrades = [
    { id: 'power', name: 'Мощный Клик', cost: 50, effect: 'Увеличивает силу клика на 1', owned: 0, emoji: '💪' },
    { id: 'auto', name: 'Авто-кликер', cost: 100, effect: 'Автоматически кликает 1 раз в секунду', owned: 0, emoji: '🤖' },
    { id: 'multiplier', name: 'Мультипликатор', cost: 500, effect: 'Удваивает очки за клик', owned: 0, emoji: '✨' },
    { id: 'turbo', name: 'Турбо Режим', cost: 1000, effect: 'Увеличивает силу клика в 3 раза', owned: 0, emoji: '🚀' },
    { id: 'golden', name: 'Золотой Клик', cost: 2500, effect: 'Шанс получить x10 очков за клик', owned: 0, emoji: '🌟' },
    { id: 'factory', name: 'Фабрика', cost: 5000, effect: 'Производит 10 очков в секунду', owned: 0, emoji: '🏭' }
  ]

  // Достижения
  const achievements = [
    { id: 'first', name: 'Первый клик', description: 'Сделать первый клик', condition: (s: number) => s >= 1, unlocked: false, reward: 10 },
    { id: 'hundred', name: 'Сотня', description: 'Набрать 100 очков', condition: (s: number) => s >= 100, unlocked: false, reward: 50 },
    { id: 'thousand', name: 'Тысяча', description: 'Набрать 1000 очков', condition: (s: number) => s >= 1000, unlocked: false, reward: 200 },
    { id: 'tenThousand', name: 'Десять тысяч', description: 'Набрать 10,000 очков', condition: (s: number) => s >= 10000, unlocked: false, reward: 1000 },
    { id: 'clickMaster', name: 'Мастер кликов', description: 'Сделать 500 кликов', condition: (clicks: number) => clicks >= 500, unlocked: false, reward: 500 },
    { id: 'speedster', name: 'Спидстер', description: 'Достичь 10 кликов в секунду', condition: (cps: number) => cps >= 10, unlocked: false, reward: 300 },
    { id: 'millionaire', name: 'Миллионер', description: 'Набрать 1,000,000 очков', condition: (s: number) => s >= 1000000, unlocked: false, reward: 10000 }
  ]

  const [upgradesList, setUpgradesList] = useState(upgrades)
  const [achievementsList, setAchievementsList] = useState(achievements)

  // Звуковые эффекты
  const playClickSound = () => {
    if (!soundEnabled) return
    // Создаем звук клика с помощью Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const playPurchaseSound = () => {
    if (!soundEnabled) return
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }

  // Автоматические клики и фабрики
  useEffect(() => {
    if (autoClickers > 0 || factories > 0) {
      const interval = setInterval(() => {
        setScore(prev => prev + (autoClickers + factories * 10) * prestigeMultiplier)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [autoClickers, factories, prestigeMultiplier])

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
      prev.map(achievement => {
        const wasUnlocked = achievement.unlocked
        let newUnlocked = false
        
        // Разные условия для разных достижений
        if (achievement.id === 'first' || achievement.id === 'hundred' || achievement.id === 'thousand' || 
            achievement.id === 'tenThousand' || achievement.id === 'millionaire') {
          newUnlocked = achievement.condition(score)
        } else if (achievement.id === 'clickMaster') {
          newUnlocked = achievement.condition(totalClicks)
        } else if (achievement.id === 'speedster') {
          newUnlocked = achievement.condition(clicksPerSecond)
        }
        
        // Если достижение только что разблокировалось, добавляем награду
        if (newUnlocked && !wasUnlocked) {
          setScore(prev => prev + achievement.reward)
          if (soundEnabled) {
            setTimeout(() => playPurchaseSound(), 100)
          }
        }
        
        return {
          ...achievement,
          unlocked: newUnlocked
        }
      })
    )
  }, [score, totalClicks, clicksPerSecond, soundEnabled])

  const handleClick = () => {
    playClickSound()
    setTotalClicks(prev => prev + 1)
    
    // Проверка на золотой клик
    const isGoldenClick = goldenClickChance > 0 && Math.random() < goldenClickChance / 100
    const clickValue = isGoldenClick ? clickPower * 10 : clickPower
    
    setScore(prev => prev + clickValue * prestigeMultiplier)
    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 200)
    
    if (isGoldenClick) {
      // Показываем спецэффект для золотого клика
      const goldenEffect = document.createElement('div')
      goldenEffect.innerText = `💰 ЗОЛОТОЙ КЛИК! +${clickValue * prestigeMultiplier}`
      goldenEffect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        font-weight: bold;
        color: gold;
        pointer-events: none;
        z-index: 1000;
        animation: fadeOut 2s ease-out forwards;
      `
      document.body.appendChild(goldenEffect)
      setTimeout(() => goldenEffect.remove(), 2000)
    }
  }

  const buyUpgrade = (upgradeId: string) => {
    const upgrade = upgradesList.find(u => u.id === upgradeId)
    if (!upgrade || score < upgrade.cost) return

    playPurchaseSound()
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
    } else if (upgradeId === 'turbo') {
      setClickPower(prev => prev * 3)
    } else if (upgradeId === 'golden') {
      setGoldenClickChance(prev => prev + 5) // +5% шанс
    } else if (upgradeId === 'factory') {
      setFactories(prev => prev + 1)
    }
  }

  const canPrestige = () => {
    return score >= 1000000 // Можно сделать престиж при 1 миллионе очков
  }

  const calculatePrestigeReward = () => {
    return Math.floor(score / 100000) // 1 очко престижа за каждые 100k очков
  }

  const doPrestige = () => {
    if (!canPrestige()) return
    
    const reward = calculatePrestigeReward()
    setPrestigePoints(prev => prev + reward)
    setPrestigeMultiplier(prev => prev + reward * 0.1) // Каждое очко престижа дает +10% к доходу
    
    // Сброс прогресса
    setScore(0)
    setClickPower(1)
    setAutoClickers(0)
    setFactories(0)
    setGoldenClickChance(0)
    setTotalClicks(0)
    setUpgradesList(upgrades.map(u => ({ ...u, owned: 0, cost: u.cost })))
    setAchievementsList(achievements.map(a => ({ ...a, unlocked: false })))
    
    playPurchaseSound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Шапка */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg" style={{fontFamily: 'Comic Sans MS, cursive'}}>
            🎮 Супер Кликер 🎮
          </h1>
          <div className="flex justify-center gap-4 text-white text-lg font-semibold flex-wrap">
            <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              💰 Очки: {score.toLocaleString()}
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              ⚡ Сила: {clickPower}x
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              🤖 Авто: {autoClickers}/сек
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              🏭 Фабрики: {factories}
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
              ⭐ Престиж: {prestigePoints} (x{prestigeMultiplier.toFixed(1)})
            </div>
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full px-4 py-2"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </Button>
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
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <span className="text-2xl">{upgrade.emoji}</span>
                        {upgrade.name}
                      </h3>
                      <Badge variant="outline">{upgrade.owned}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{upgrade.effect}</p>
                    <Button 
                      onClick={() => buyUpgrade(upgrade.id)}
                      disabled={score < upgrade.cost}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                        ? 'bg-gradient-to-r from-green-200 to-emerald-200 border-2 border-green-400 animate-pulse' 
                        : 'bg-gray-100 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {achievement.unlocked ? '🏆' : '🔒'}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold">{achievement.name}</h3>
                          {achievement.unlocked && (
                            <Badge variant="default" className="bg-green-600 text-white">
                              +{achievement.reward} 💰
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Престиж */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-4 text-center text-red-700" style={{fontFamily: 'Comic Sans MS, cursive'}}>
                ⭐ Престиж
              </h2>
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-2xl">
                  <p className="text-lg font-semibold">Очки престижа: {prestigePoints}</p>
                  <p className="text-sm text-gray-600">Множитель дохода: x{prestigeMultiplier.toFixed(1)}</p>
                </div>
                
                {canPrestige() && (
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-2xl">
                    <p className="text-lg font-semibold text-orange-700">
                      🎉 Доступен престиж!
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Получите: +{calculatePrestigeReward()} очков престижа
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={doPrestige}
                  disabled={!canPrestige()}
                  className={`w-full rounded-xl text-white font-bold ${
                    canPrestige() 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 animate-pulse' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canPrestige() ? '🔄 ПРЕСТИЖ!' : '🔒 Нужно 1,000,000 очков'}
                </Button>
                
                <div className="text-xs text-gray-500">
                  <p>Престиж сбрасывает весь прогресс,</p>
                  <p>но дает постоянный бонус к доходу!</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index;