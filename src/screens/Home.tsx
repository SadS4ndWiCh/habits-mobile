import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import { AxiosError } from "axios";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { api } from "../libs/axios";

import { Header } from "../components/Header"
import { HabitDay, DAY_SIZE } from "../components/HabitDay"
import { Loading } from "../components/Loading";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const datesFromYearStart = generateDatesFromYearBeginning();

const minSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minSummaryDatesSize - datesFromYearStart.length;

type Summary = {
	id: string;
	date: string;
	amount: number;
	completed: number;
}[]

export const Home = () => {
	const [loading, setLoading] = useState(true);
	const [summary, setSummary] = useState<Summary>([]);
	const { navigate } = useNavigation();

	const fetchData = async () => {
		try {
			setLoading(true);

			const { data } = await api.get('/summary');
			setSummary(data);
		} catch (err) {
			if (err instanceof AxiosError) {
				console.error(err.message);
			} else {
				console.error(err);
			}
			Alert.alert('Ops...', 'Não foi possível carregar o sumário de hábitos.');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	if (loading) return <Loading />

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
					{ datesFromYearStart.map(date => {
						const dayWithHabits = summary.find(day => dayjs(date).isSame(day.date, 'day'));

						return (
							<HabitDay
								key={date.toISOString()}
								date={date}
								amount={dayWithHabits?.amount}
								completed={dayWithHabits?.completed}
								onPress={() => navigate('habit', { date: date.toISOString() })}
							/>
						)
					}) }

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