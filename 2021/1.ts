async function GetInputs():Promise<number[]> {
  const input = await Deno.readTextFile("input/1-1.txt");
  return input.split('\n').map((num:string) => parseInt(num))
}

const input = await GetInputs();

{ //Part 1
  let greaterCount = 0;
  for(let i = 0; i < input.length - 1; ++i) {
    if (input[i] < input[i+1]) {
      ++greaterCount;
    }
  }

  console.log(greaterCount);
}

{ //Part 2
  let greaterCount = 0;
  for(let i = 0; i < input.length - 3; ++i) {
    if (input[i] < input[i+3]) { //When a 3-wide window "slides", these are the only two values that change, so just compare these.
      ++greaterCount;
    }
  }

  console.log(greaterCount);
}