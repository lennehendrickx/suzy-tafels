import { useState } from 'react'
import './App.css'

function App() {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1)
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>({})
  const [isCorrect, setIsCorrect] = useState<{ [key: string]: boolean }>({})

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`
    if (answers[key] === undefined) {
      const userAnswer = prompt(`✨ Hi! I'm Suzy! What's ${row} × ${col}? Let's solve this together! ✨`)
      if (userAnswer !== null) {
        const numAnswer = parseInt(userAnswer)
        if (!isNaN(numAnswer)) {
          const correct = numAnswer === row * col
          setAnswers(prev => ({
            ...prev,
            [key]: numAnswer
          }))
          setIsCorrect(prev => ({
            ...prev,
            [key]: correct
          }))
          if (correct) {
            alert("💖 Yay! You got it right! You're super smart! 💎")
          } else {
            alert("✨ That's okay! Let's keep practicing together! You can do it! 💝")
          }
        }
      }
    }
  }

  const handleReset = () => {
    setAnswers({})
    setIsCorrect({})
    alert("✨ Let's start a new round of fun math! Ready? 💖")
  }

  const getCellClass = (key: string) => {
    if (answers[key] === undefined) return 'cell'
    return `cell ${isCorrect[key] ? 'correct' : 'incorrect'}`
  }

  const renderSparkles = () => (
    <div className="correct-sparkles">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )

  return (
    <div className="container">
      <h1>✨ Suzy's Math Adventure ✨</h1>
      <p className="subtitle">Let's learn multiplication together and have fun! 💖</p>
      <div className="grid">
        <div className="row header">
          <div className="cell"></div>
          {numbers.map(num => (
            <div key={num} className="cell header-cell">
              {num}
            </div>
          ))}
        </div>
        {numbers.map(row => (
          <div key={row} className="row">
            <div className="cell header-cell">
              {row}
            </div>
            {numbers.map(col => (
              <div
                key={`${row}-${col}`}
                className={getCellClass(`${row}-${col}`)}
                onClick={() => handleCellClick(row, col)}
              >
                {answers[`${row}-${col}`] ?? ''}
                {isCorrect[`${row}-${col}`] && renderSparkles()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={handleReset}>
        ✨ Play Again ✨
      </button>
    </div>
  )
}

export default App
