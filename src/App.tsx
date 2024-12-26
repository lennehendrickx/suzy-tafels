import { useState } from 'react'
import './App.css'

function App() {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1)
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>({})
  const [isCorrect, setIsCorrect] = useState<{ [key: string]: boolean }>({})
  const [showDialog, setShowDialog] = useState(false)
  const [currentProblem, setCurrentProblem] = useState<{ row: number; col: number } | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`
    setCurrentProblem({ row, col })
    setShowDialog(true)
    setInputValue('')
    setFeedback('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentProblem && inputValue) {
      const numAnswer = parseInt(inputValue)
      if (!isNaN(numAnswer)) {
        const key = `${currentProblem.row}-${currentProblem.col}`
        const correct = numAnswer === currentProblem.row * currentProblem.col
        
        if (correct) {
          setAnswers(prev => ({
            ...prev,
            [key]: numAnswer
          }))
          setIsCorrect(prev => ({
            ...prev,
            [key]: true
          }))
          setShowDialog(false)
          setCurrentProblem(null)
        } else {
          setFeedback(`Oops! That's not quite right. Let's try again! 💝\nHint: Count ${currentProblem.row} groups of ${currentProblem.col}`)
          setInputValue('')
        }
      }
    }
  }

  const handleReset = () => {
    setAnswers({})
    setIsCorrect({})
    setShowDialog(false)
    setCurrentProblem(null)
    setFeedback('')
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

      {showDialog && currentProblem && (
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-content">
              <h2>✨ Time to Multiply! ✨</h2>
              <p className="problem">
                What is {currentProblem.row} × {currentProblem.col}?
              </p>
              {feedback && <p className="feedback">{feedback}</p>}
              <form onSubmit={handleSubmit}>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                  placeholder="Type your answer..."
                />
                <div className="dialog-buttons">
                  <button type="submit" className="submit-button">
                    Check Answer! 💫
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowDialog(false)}
                  >
                    Try Later 🌸
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
