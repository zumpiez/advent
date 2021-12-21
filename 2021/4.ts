async function main() {
  const {hopper, boards} = new BingoConfig(await Deno.readTextFile("./input/4.txt"));

  let winningBoards: BingoBoard[] = [];

  for (const ball of hopper) {
    for (const board of boards) {
      if (board.score == false) {
        board.markValue(ball);
        if (board.score != false) {
          winningBoards.push(board);
        }
      }
    }
  }

  console.log(`First winner (part 1): ${winningBoards[0].score}
  Final winner (part 2): ${winningBoards.at(-1)!.score}`);
}

// impl

class BingoConfig {
  hopper: number[];
  boards: BingoBoard[] = [];
  
  constructor(configFile:string) {
    const lines = configFile.split("\n");
    
    // First line contains ball draw order
    this.hopper = lines[0].split(",").map(s => parseInt(s));
    
    // Remaining lines are parsed as bingo grids
    for(let i = 1; i < lines.length; ++i) {
      if (lines[i] == "\r") {
        this.boards.push(new BingoBoard());
      } else {
        // Parse this line into the current board as a row of whitespace-delimited numbers
        const lineRegexp = /(\d+)\s*/g;
        const result = lines[i].matchAll(lineRegexp);

        for (const value of result) {
          this.boards.at(-1)!.insertValue(parseInt(value[1]));
        }
      }
    }
  }
}

class BoardSpace {
  value: number;
  marked: boolean;

  constructor(value: number) {
    this.value = value;
    this.marked = false;
  }
}

class BingoBoard {
  spaces: BoardSpace[] = [];
  score: number|false = false;

  insertValue(value: number): void {
    this.spaces.push(new BoardSpace(value));
  }

  markValue(value: number): void {
    if (this.score != false) return; //don't mark boards that already have a bingo

    const found = this.spaces.findIndex(s => s.value == value)
    if (found > -1) {
      this.spaces[found].marked = true;
    }

    if (this.checkWin()) {
      this.score = this.computeScore(value);
    }
  }

  getRow(index: number): BoardSpace[] {
    const rowStart = index * 5;
    const rowEnd = rowStart + 5;

    return this.spaces.slice(rowStart, rowEnd);
  }

  getColumn(index: number): BoardSpace[] {
    const colStart = index;
    const stride = 5;

    let result: BoardSpace[] = [];

    for(let i = 0; i < 5; ++i) {
      result.push(this.spaces[colStart + stride*i])
    }

    return result;
  }

  checkWin(): boolean {
    for(let i = 0; i < 5; ++i) {
      const row = this.getRow(i);
      if (row.every((space) => space.marked == true)) return true;

      const col = this.getColumn(i);
      if (col.every((space) => space.marked == true)) return true;
    }

    return false;
  }

  computeScore(finalBall: number): number {
    // Sum all of the UNMARKED numbers on the board
    let unmarkedTotal = 0;
    for (const space of this.spaces) {
      if (!space.marked) {
        unmarkedTotal += space.value;
      }
    }

    return unmarkedTotal * finalBall;
  }
}

main();