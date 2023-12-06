'use client'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const createEmptyMatrix = (rows: number, columns: number) => {
    return Array.from({ length: rows }, () =>
      Array(columns).fill(0)
    ) as number[][]
  }

  const [matrix, setMatrix] = useState<number[][]>(createEmptyMatrix(18, 10))
  const [piecePosition, setPiecePosition] = useState({ x: 0, y: 4 })
  const [piece, setPiece] = useState<number[][]>([
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ])

  const placePieceOnBoard = useCallback(
    (piece: number[][]) => {
      setMatrix((prevMatrix) => {
        const newBoard = prevMatrix.map((row) => [...row])

        for (let row = 0; row < piece.length; row++) {
          for (let column = 0; column < piece[row].length; column++) {
            if (piece[row][column] !== 0) {
              newBoard[row + piecePosition.x][column + piecePosition.y] =
                piece[row][column]
            }
          }
        }

        return newBoard
      })
    },
    [piecePosition]
  )

  const movePieceOnBoard = useCallback(
    (
      board: number[][],
      piece: number[][],
      position: { x: number; y: number }
    ) => {
      // Create a new board based on the previous state
      const newBoard = board.map((row) => [...row])

      // Clear the previous position of the piece
      for (let row = 0; row < piece.length; row++) {
        for (let column = 0; column < piece[row].length; column++) {
          if (piece[row][column] !== 0) {
            newBoard[row + piecePosition.x][column + piecePosition.y] = 0
          }
        }
      }

      // Place the piece in the new position
      for (let row = 0; row < piece.length; row++) {
        for (let column = 0; column < piece[row].length; column++) {
          if (piece[row][column] !== 0) {
            newBoard[row + position.x][column + position.y] = piece[row][column]
          }
        }
      }

      setMatrix(newBoard)
    },
    [piecePosition]
  )

  useEffect(() => {
    placePieceOnBoard(piece)
    // placePieceOnBoard(matrix, piece, { x: 15, y: 4 })
  }, [piece, placePieceOnBoard])

  const movePiece = useCallback(
    (direction: 'left' | 'right' | 'down') => {
      let newX = piecePosition.x
      let newY = piecePosition.y

      switch (direction) {
        case 'left':
          newY -= 1
          break
        case 'right':
          newY += 1
          break
        case 'down':
          newX += 1
          break
        default:
          break
      }
      movePieceOnBoard(matrix, piece, { x: newX, y: newY })
      setPiecePosition({ x: newX, y: newY })
    },
    [piecePosition.x, piecePosition.y, movePieceOnBoard, matrix, piece]
  )

  //Detect when move a the current piece
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'ArrowDown') {
        movePiece('down')
      } else if (event.key === 'ArrowLeft') {
        movePiece('left')
      } else if (event.key === 'ArrowRight') {
        movePiece('right')
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [movePiece, piece, piecePosition])

  return (
    <div>
      <h1>Home</h1>
      <div>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: cell ? 'red' : 'yellow',
                  border: '1px solid gray',
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
