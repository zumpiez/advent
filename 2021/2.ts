async function main() {
  const file = (await Deno.readTextFile("input/2.txt")).split('\n')
  const subs = [ new Submarine(partOneExecutor), new Submarine(partTwoExecutor) ];
  const commandBuffer = file.map(line => new Command(line));

  subs.forEach(sub => sub.execute(commandBuffer));

  const solutions = subs.map(sub => sub.getMultiplied())
  console.log(solutions);
}

// impl

type Executor = (command: Command, sub: Submarine) => void;

class Submarine {
  depth = 0;
  horizontalPosition = 0;
  aim = 0;
  executor:Executor;

  constructor(executor: Executor) {
    this.executor = executor;
  }

  execute(commandBuffer: Command[]) {
    for (const command of commandBuffer) {
      this.executor(command, this);
    }
  }

  getMultiplied(): number {
    return this.horizontalPosition * this.depth;
  }
}

type Keyword = "forward"|"down"|"up";

class Command {
  keyword: Keyword
  value: number;

  constructor(input:string) {
    const tokens = input.split(' ');
    this.keyword = tokens[0] as Keyword;
    this.value = parseInt(tokens[1]);
  }
}

const partOneExecutor: Executor = (command, sub) => {
  switch(command.keyword) {
    case "forward":
      sub.horizontalPosition += command.value;
      break;
    case "up":
      sub.depth -= command.value;
      break;
    case "down":
      sub.depth += command.value;
      break;
  }
}

const partTwoExecutor: Executor = (command, sub) => {
  switch(command.keyword) {
    case "down":
      sub.aim += command.value
      break;
    case "forward":
      sub.horizontalPosition += command.value;
      sub.depth += sub.aim * command.value;
      break;
    case "up":
      sub.aim -= command.value
      break;
  }
}

main();