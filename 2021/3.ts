const file = (await Deno.readTextFile("input/3.txt")).split("\n")
const sampleCount = file.length;
const sampleLength = file[0].length;
console.warn(`Sample count: ${sampleCount}, Sample length: ${sampleLength}`)

// part 1
let gammaRate = 0;
let epsilonRate = 0;
analyzeSamples(file).forEach((onesCount) => {
  const digit = (onesCount * 2 > sampleCount ? 1 : 0); // Check if over half the samples contained 1
  gammaRate <<= 1;
  gammaRate += digit;

  epsilonRate <<= 1;
  epsilonRate += 1 - digit;
});

const powerConsumption = gammaRate * epsilonRate;
console.log(powerConsumption);

// part 2
const oxygenRating = getOxygenGeneratorRating(file);
const scrubberRating = getScrubberRating(file);

const lifeSupportRating = oxygenRating * scrubberRating;
console.log(lifeSupportRating);

function getOxygenGeneratorRating(samples: string[]): number {
  return sieve(samples, ["1", "0"]);
}

function getScrubberRating(samples: string[]): number {
  return sieve(samples, ["0", "1"]);
}

function sieve(samples: string[], resultValues: string[], bitPosition = 0): number {
  const onesByIndex = analyzeSamples(samples);
  const bitCriteria = (onesByIndex[bitPosition] * 2) >= samples.length ? resultValues[0] : resultValues[1]; // Keep the most popular digit
  const filtered = samples.filter((sample) => sample[bitPosition] == bitCriteria);
  if (filtered.length > 1) {
    return sieve(filtered, resultValues, ++bitPosition);
  }

  const binaryString = filtered[0];
  let decimalResult = 0;
  for (const digit of binaryString) {
    decimalResult <<= 1;
    decimalResult += parseInt(digit);
  }
  return decimalResult;
}

function analyzeSamples(samples: string[]): Uint32Array {
  const onesByIndex = new Uint32Array(sampleLength);

  for (const sample of samples) {
    for (let i = 0; i < sample.length; ++i) {
      if (sample[i] == "1") {
        ++onesByIndex[i];
      }
    }
  }
  
  return onesByIndex;
}