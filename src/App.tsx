import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1)
  const [answers, setAnswers] = useState<{ [key: string]: number | null }>({})
  const [isCorrect, setIsCorrect] = useState<{ [key: string]: boolean }>({})
  const [retries, setRetries] = useState<{ [key: string]: number }>({})
  const [showDialog, setShowDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [currentProblem, setCurrentProblem] = useState<{ row: number; col: number } | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState('')
  const [completedRows, setCompletedRows] = useState<number[]>([])
  const [completedCols, setCompletedCols] = useState<number[]>([])
  const [totalValue, setTotalValue] = useState(0)
  const [isScoreAnimating, setIsScoreAnimating] = useState(false)

  const animateScore = () => {
    setIsScoreAnimating(true)
    setTimeout(() => setIsScoreAnimating(false), 500)
  }

  // Check for completed rows and columns whenever isCorrect changes
  useEffect(() => {
    // Check all rows
    numbers.forEach(row => {
      const isRowComplete = numbers.every(col => isCorrect[`${row}-${col}`])
      if (isRowComplete && !completedRows.includes(row)) {
        setCompletedRows(prev => [...prev, row])
      }
    })

    // Check all columns
    numbers.forEach(col => {
      const isColComplete = numbers.every(row => isCorrect[`${row}-${col}`])
      if (isColComplete && !completedCols.includes(col)) {
        setCompletedCols(prev => [...prev, col])
      }
    })
  }, [isCorrect])

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`
    setCurrentProblem({ row, col })
    setShowDialog(true)
    setInputValue('')
    setFeedback('')
    if (!retries[key]) {
      setRetries(prev => ({
        ...prev,
        [key]: 0
      }))
    }
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
          setTotalValue(prev => prev + numAnswer)
          animateScore()
          setShowDialog(false)
          setCurrentProblem(null)
        } else {
          setRetries(prev => ({
            ...prev,
            [key]: (prev[key] || 0) + 1
          }))
          setTotalValue(prev => {
            const newValue = Math.max(0, prev - 5)
            if (newValue !== prev) animateScore()
            return newValue
          })
          setFeedback(`Oeps! Dat is niet helemaal juist. Je verliest 5 punten! 💝\nTip: Tel ${currentProblem.row} groepjes van ${currentProblem.col}`)
          setInputValue('')
        }
      }
    }
  }

  const handleReset = () => {
    setShowResetDialog(true)
  }

  const confirmReset = () => {
    setAnswers({})
    setIsCorrect({})
    setRetries({})
    setShowDialog(false)
    setCurrentProblem(null)
    setFeedback('')
    setCompletedRows([])
    setCompletedCols([])
    setTotalValue(0)
    setShowResetDialog(false)
  }

  const getCellClass = (key: string, row: number, col: number) => {
    const baseClass = answers[key] === undefined ? 'cell unanswered' : `cell ${isCorrect[key] ? 'correct' : 'incorrect'}`
    const isInCompletedRow = completedRows.includes(row)
    const isInCompletedCol = completedCols.includes(col)
    return `${baseClass} ${isInCompletedRow ? 'completed-row' : ''} ${isInCompletedCol ? 'completed-col' : ''}`
  }

  const renderSparkles = () => (
    <div className="correct-sparkles">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )

  const getCellContent = (row: number, col: number) => {
    const key = `${row}-${col}`
    if (answers[key] !== undefined) {
      return (
        <>
          {answers[key]}
          {isCorrect[key] && renderSparkles()}
          {retries[key] > 0 && (
            <span className="retry-count">
              {retries[key]}
            </span>
          )}
        </>
      )
    }
    return (
      <div className="multiplication">
        <span>{row}</span>
        <span>×</span>
        <span>{col}</span>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>
        ✨ Suzy's Tafels Avontuur ✨
        <span className="title-sparkle">✨</span>
        <span className="title-sparkle">✨</span>
        <span className="title-sparkle">✨</span>
        <span className="title-sparkle">✨</span>
      </h1>
      <div className={`total-value ${isScoreAnimating ? 'points-changed' : ''}`}>
        Score: {totalValue}
      </div>
      <div className="grid">
        <div className="row header">
          <div className="cell"></div>
          {numbers.map(num => (
            <div key={num} className={`cell header-cell ${completedCols.includes(num) ? 'completed-col' : ''}`}>
              {num}
            </div>
          ))}
        </div>
        {numbers.map(row => (
          <div key={row} className="row">
            <div className={`cell header-cell ${completedRows.includes(row) ? 'completed-row' : ''}`}>
              {row}
            </div>
            {numbers.map(col => (
              <div
                key={`${row}-${col}`}
                className={getCellClass(`${row}-${col}`, row, col)}
                onClick={() => handleCellClick(row, col)}
              >
                {getCellContent(row, col)}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={handleReset}>
        ✨ Opnieuw Spelen ✨
      </button>

      {showResetDialog && (
        <div className="dialog-overlay" onClick={() => setShowResetDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-content">
              <h2>✨ Opnieuw beginnen? ✨</h2>
              <p className="problem">
                Weet je zeker dat je opnieuw wilt beginnen?<br/>
                Je score wordt gereset naar 0!
              </p>
              <div className="dialog-buttons">
                <button 
                  className="submit-button"
                  onClick={confirmReset}
                >
                  Ja, begin opnieuw! 🌟
                </button>
                <button 
                  className="cancel-button"
                  onClick={() => setShowResetDialog(false)}
                >
                  Nee, speel verder! 🎮
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDialog && currentProblem && (
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <div className="dialog-content">
              <h2>✨ Tijd om te Vermenigvuldigen! ✨</h2>
              <p className="problem">
                Hoeveel is {currentProblem.row} × {currentProblem.col}?
              </p>
              {feedback && <p className="feedback">{feedback}</p>}
              <form onSubmit={handleSubmit}>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                  placeholder="Type je antwoord..."
                />
                <div className="dialog-buttons">
                  <button type="submit" className="submit-button">
                    Controleer! 💫
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setShowDialog(false)}
                  >
                    Later 🌸
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
