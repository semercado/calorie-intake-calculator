import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { calculateCalories } from '../utils/calorieCalculations';
import { convertWeight, convertHeight } from '../utils/unitConversions';

interface UserData {
    age: number;
    weight: number;
    height: number;
    gender: 'male' | 'female';
    activityLevel: string;
    formula: string;
    useMetric: boolean;
    heightFeet: number;
    heightInches: number;
    weightLbs: number;
}

const initialData: UserData = {
    age: 0,
    weight: 0,
    height: 0,
    gender: 'male',
    activityLevel: 'sedentary',
    formula: 'mifflin-st-jeor',
    useMetric: false,
    heightFeet: 0,
    heightInches: 0,
    weightLbs: 0,
};

export function CalorieCalculator() {
    const [userData, setUserData] = useState<UserData>(initialData);
    const [calories, setCalories] = useState<number>(0);

    useEffect(() => {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
            setUserData(JSON.parse(savedData));
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const calculatedCalories = calculateCalories(userData);
        setCalories(calculatedCalories);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const handleUnitChange = (useMetric: boolean) => {
        if (useMetric) {
            const newWeight = userData.weightLbs > 0 ? convertWeight.lbToKg(userData.weightLbs) : 0;
            const newHeight = convertHeight.ftInToCm(userData.heightFeet, userData.heightInches);
            setUserData({
                ...userData,
                useMetric,
                weight: Math.round(newWeight * 10) / 10,
                height: Math.round(newHeight),
            });
        } else {
            const newWeight = userData.weight > 0 ? convertWeight.kgToLb(userData.weight) : 0;
            const { feet, inches } = convertHeight.cmToFtIn(userData.height);
            setUserData({
                ...userData,
                useMetric,
                weightLbs: Math.round(newWeight),
                heightFeet: feet,
                heightInches: inches,
            });
        }
    };

    const handleHeightChange = (field: 'heightFeet' | 'heightInches', value: number) => {
        const newData = { ...userData, [field]: value };
        const heightInCm = convertHeight.ftInToCm(newData.heightFeet, newData.heightInches);
        setUserData({ ...newData, height: Math.round(heightInCm) });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Calorie Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-end mb-4">
                        <div className="space-x-2">
                            <Button
                                type="button"
                                variant={userData.useMetric ? "outline" : "default"}
                                onClick={() => handleUnitChange(false)}
                                className="w-20"
                            >
                                Imperial
                            </Button>
                            <Button
                                type="button"
                                variant={userData.useMetric ? "default" : "outline"}
                                onClick={() => handleUnitChange(true)}
                                className="w-20"
                            >
                                Metric
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={userData.age || ''}
                                onChange={(e) => setUserData({ ...userData, age: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight ({userData.useMetric ? 'kg' : 'lbs'})</Label>
                            <Input
                                id="weight"
                                type="number"
                                value={userData.useMetric ? userData.weight || '' : userData.weightLbs || ''}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (userData.useMetric) {
                                        setUserData({ ...userData, weight: value });
                                    } else {
                                        setUserData({
                                            ...userData,
                                            weightLbs: value,
                                            weight: convertWeight.lbToKg(value),
                                        });
                                    }
                                }}
                            />
                        </div>
                        {userData.useMetric ? (
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    value={userData.height || ''}
                                    onChange={(e) => setUserData({ ...userData, height: Number(e.target.value) })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="height">Height (ft/in)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Input
                                            id="heightFeet"
                                            type="number"
                                            placeholder="Feet"
                                            value={userData.heightFeet || ''}
                                            onChange={(e) => handleHeightChange('heightFeet', Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            id="heightInches"
                                            type="number"
                                            placeholder="Inches"
                                            min="0"
                                            max="11"
                                            value={userData.heightInches || ''}
                                            onChange={(e) => handleHeightChange('heightInches', Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={userData.gender}
                                onValueChange={(value) => setUserData({ ...userData, gender: value as 'male' | 'female' })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="activityLevel">Activity Level</Label>
                            <Select
                                value={userData.activityLevel}
                                onValueChange={(value) => setUserData({ ...userData, activityLevel: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select activity level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedentary">Sedentary</SelectItem>
                                    <SelectItem value="light">Light Exercise</SelectItem>
                                    <SelectItem value="moderate">Moderate Exercise</SelectItem>
                                    <SelectItem value="active">Very Active</SelectItem>
                                    <SelectItem value="extra-active">Extra Active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="formula">Formula</Label>
                            <Select
                                value={userData.formula}
                                onValueChange={(value) => setUserData({ ...userData, formula: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select formula" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="harris-benedict">Harris-Benedict</SelectItem>
                                    <SelectItem value="mifflin-st-jeor">Mifflin-St Jeor</SelectItem>
                                    <SelectItem value="katch-mccardle">Katch-McArdle</SelectItem>
                                    <SelectItem value="cunningham">Cunningham</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full">Calculate Calories</Button>
                    
                    {calories > 0 && (
                        <div className="mt-4 space-y-4">
                            <div className="p-4 bg-secondary rounded-lg">
                                <p className="text-center text-lg font-semibold">
                                    Maintenance Calories: {Math.round(calories)} kcal/day
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-secondary rounded-lg">
                                    <p className="text-center font-semibold">Weight Loss</p>
                                    <p className="text-center">
                                        Moderate: {Math.round(calories - 500)} kcal/day
                                    </p>
                                    <p className="text-center text-sm text-muted-foreground">
                                        (-500 calories/day ≈ 1lb/week)
                                    </p>
                                </div>
                                <div className="p-4 bg-secondary rounded-lg">
                                    <p className="text-center font-semibold">Weight Gain</p>
                                    <p className="text-center">
                                        Moderate: {Math.round(calories + 500)} kcal/day
                                    </p>
                                    <p className="text-center text-sm text-muted-foreground">
                                        (+500 calories/day ≈ 1lb/week)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}