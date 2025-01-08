export const convertWeight = {
  lbToKg: (lb: number) => lb * 0.45359237,
  kgToLb: (kg: number) => kg * 2.20462262,
};

export const convertHeight = {
  ftInToCm: (feet: number, inches: number) => (feet * 12 + inches) * 2.54,
  cmToFtIn: (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  },
}; 