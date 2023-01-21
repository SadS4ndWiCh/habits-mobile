import { useEffect, useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native"
import { useRoute } from "@react-navigation/native";
import clsx from "clsx";

import { api } from "../libs/axios";
import { dayjs } from "../libs/dayjs";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";

interface Params {
	date: string;
}

interface HabitsInfoProps {
	completedHabits: string[];
	possibleHabits: {
		id: string;
		title: string;
	}[];
}

export const Habit = () => {
	const [loading, setLoading] = useState(true);
	const [habitsInfo, setHabitsInfo] = useState<HabitsInfoProps | null>(null);

	const route = useRoute()
	const { date } = route.params as Params;

	const parsedDate = dayjs(date);
	const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
	const dayOfWeek = parsedDate.format('dddd');
	const dayAndMonth = parsedDate.format('DD/MM');

	const habitsProgress = habitsInfo
		? generateProgressPercentage(
				habitsInfo.possibleHabits.length,
				habitsInfo.completedHabits.length
			)
		: 0;

	const fetchHabits = async () => {
		try {
			setLoading(true);

			const response = await api.get('/day', { params: { date } });

			setHabitsInfo(response.data);
		} catch (err) {
			console.log(err);
			Alert.alert('Ops...', 'Não foi possível carregar as informações do hábito.')
		} finally {
			setLoading(false);
		}
	}

	const handleToggleHabit = async (habitId: string) => {
		try {
			await api.patch(`/habits/${habitId}/toggle`);

			const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

			let completedHabits: string[] = [];
			if (isHabitAlreadyCompleted) {
				completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId);
			} else {
				completedHabits = [...habitsInfo!.completedHabits, habitId];
			}

			setHabitsInfo({
				possibleHabits: habitsInfo!.possibleHabits,
				completedHabits,
			});
		} catch(err) {
			Alert.alert('Ops...', 'Não foi possível fazer a alteração do status do hábito');
			console.log(err);
		}

	}

	useEffect(() => {
		fetchHabits()
	}, []);

	if (loading) return <Loading />

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<ScrollView
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				<BackButton />

				<Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
					{ dayOfWeek }
				</Text>
				<Text className="text-white font-extrabold text-3xl lowercase">
					{ dayAndMonth }
				</Text>

				<ProgressBar progress={habitsProgress} />

				<View className={clsx("mt-6", {
					'opacity-50': isDateInPast
				})}>
					{ habitsInfo?.possibleHabits ? (
						habitsInfo?.possibleHabits.map(habit => (
							<CheckBox
								key={habit.id}
								title={habit.title}
								disabled={isDateInPast}
								checked={habitsInfo.completedHabits.includes(habit.id)}
								onPress={() => handleToggleHabit(habit.id)}
							/>
						))
					) : (
						<HabitsEmpty />
					) }
				</View>

				{ isDateInPast && (
					<Text className="text-white mt-10 text-center">
						Você não pode editar os hábitos de uma data passada
					</Text>
				) }
			</ScrollView>
		</View>
	)
}