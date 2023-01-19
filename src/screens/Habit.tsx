import { useRoute } from "@react-navigation/native";
import { ScrollView, View, Text } from "react-native"
import { dayjs } from "../libs/dayjs";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";

interface Params {
	date: string;
}

export const Habit = () => {
	const route = useRoute()
	const { date } = route.params as Params;

	const parsedDate = dayjs(date);
	const dayOfWeek = parsedDate.format('dddd');
	const dayAndMonth = parsedDate.format('DD/MM');

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

				<ProgressBar progress={50} />

				<View className="mt-6">
					<CheckBox
						title="Estudar por 1h"
					/>
					<CheckBox
						title="Beber 3L de água"
						checked
					/>
				</View>
			</ScrollView>
		</View>
	)
}