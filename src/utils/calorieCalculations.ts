interface UserData {
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female';
    activityLevel: string;
    formula: string;
}

const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'extra-active': 1.9,
};

export function calculateCalories(userData: UserData): number {
    let bmr: number;

    switch (userData.formula) {
        case 'harris-benedict':
            bmr = harrisBenedict(userData);
            break;
        case 'mifflin-st-jeor':
            bmr = mifflinStJeor(userData);
            break;
        case 'katch-mccardle':
            bmr = katchMcArdle(userData);
            break;
        case 'cunningham':
            bmr = cunningham(userData);
            break;
        default:
            bmr = harrisBenedict(userData);
    }

    return bmr * activityMultipliers[userData.activityLevel as keyof typeof activityMultipliers];
}

function harrisBenedict(userData: UserData): number {
    if (userData.gender === 'male') {
        return 66.47 + (13.75 * userData.weight) + (5.003 * userData.height) - (6.755 * userData.age);
    }
    return 655.1 + (9.563 * userData.weight) + (1.850 * userData.height) - (4.676 * userData.age);
}

function mifflinStJeor(userData: UserData): number {
    if (userData.gender === 'male') {
        return (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) + 5;
    }
    return (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age) - 161;
}

function katchMcArdle(userData: UserData): number {
    // Assuming 15% body fat for men and 23% for women as default
    const leanBodyMass = userData.gender === 'male'
        ? userData.weight * 0.85
        : userData.weight * 0.77;
    return 370 + (21.6 * leanBodyMass);
}

function cunningham(userData: UserData): number {
    // Assuming 15% body fat for men and 23% for women as default
    const leanBodyMass = userData.gender === 'male'
        ? userData.weight * 0.85
        : userData.weight * 0.77;
    return 500 + (22 * leanBodyMass);
}