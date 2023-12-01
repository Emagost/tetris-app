'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const createEmptyMatrix = (rows: number, columns: number) => {
    return Array.from({ length: rows }, () =>
      Array(columns).fill(0)
    ) as number[][]
  }

  const [matrix, setMatrix] = useState<number[][]>(createEmptyMatrix(18, 10))

  const placePiece = (piece: number[][], x: number, y: number) => {
    setMatrix((prevMatrix) => {
      const newMatrix = prevMatrix.map((row) => [...row])
      //Iterate over the piece and place it in the matrix
      piece.forEach((row, rowIndex) => {
        row.forEach((value, cellIndex) => {
          if (value) {
            newMatrix[rowIndex + x][cellIndex + y] = value
          }
        })
      })
      return newMatrix
    })
  }

  useEffect(() => {
    //For now I added this generic piece but I need the generic dynamically
    placePiece(
      [
        [1, 1],
        [1, 1],
      ],
      0,
      4
    )

    placePiece(
      [
        [1, 1],
        [1, 1],
      ],
      16,
      4
    )
  }, [])

  useEffect(() => {
    //The idea is remove useEffect and use keyDown but I don't know why is not working
    const handleKeyDown = (event: any) => {
      const movePieceBottom = () => {
        setMatrix((prevMatrix) => {
          const newMatrix = prevMatrix.map((rowArr) => rowArr.slice())
          const matrixLength = newMatrix.length

          for (let x = matrixLength - 1; x >= 0; x--) {
            for (let y = 0; y < newMatrix[x].length; y++) {
              //If the current cell is not empty
              if (newMatrix[x][y] !== 0) {
                //If the next cell is not empty  and I'm not in the bottom of the tetris
                if (x + 1 < matrixLength && newMatrix[x + 1][y] === 0) {
                  //Move the current cell to the next cell
                  newMatrix[x + 1][y] = newMatrix[x][y]
                  // Set the current cell to empty
                  newMatrix[x][y] = 0
                }
              }
            }
          }
          return newMatrix
        })
      }

      if (event.key === 'ArrowDown') {
        movePieceBottom()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
