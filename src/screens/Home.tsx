import { ScrollView, Text, View } from "react-native"

import { Header } from "../components/Header"
import { HabitDay, DAY_SIZE } from "../components/HabitDay"

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { useNavigation } from "@react-navigation/native";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();

const minSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minSummaryDatesSize - datesFromYearStart.length;

export const Home = () => {
	const { navigate } = useNavigation();

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<Header />

			<View className="flex-row mt-6 mb-2">
				{ weekDays.map((weekDay, i) => (
					<Text
						key={`${weekDay}-${i}`}
						className="text-zinc-400 font-bold text-xl text-center mx-1"
						style={{ width: DAY_SIZE, height: DAY_SIZE }}
					>
						{ weekDay }
					</Text>
				)) }
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 100
				}}
			>
				<View className="flex-row flex-wrap">
					{ datesFromYearStart.map(date => (
						<HabitDay
							key={date.toISOString()}
							onPress={() => navigate('habit', { date: date.toISOString() })}
						/>
					)) }

					{ amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
						<View
							key={i}
							className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-900 opacity-50"
							style={{ width: DAY_SIZE, height: DAY_SIZE }}
						/>
					)) }	
				</View>
			</ScrollView>
		</View>
	)
}