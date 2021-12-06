async function main() {
  const {hopper, boards} = new BingoConfig(await Deno.readTextFile("input/4.txt"));
  
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
      if (lines[i] == "") {
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

class BingoBoard {
  values: number[] = [];
  
  insertValue(value: number): void {
    this.values.push(value);
  }
  
  markValue(value: number): void {
    const found = this.values.findIndex(v => v == value)
    if (found > -1) {
      
    }
  }
}

main();