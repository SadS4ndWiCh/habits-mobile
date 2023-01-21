import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

import { BackButton } from "../components/BackButton"
import { CheckBox } from "../components/CheckBox";
import { api } from "../libs/axios";

const availableWeekDays = [
	'Domingo',
	'Segunda-Feira',
	'Terça-Feira',
	'Quarta-Feira',
	'Quinta-Feira',
	'Sexta-Feira',
	'Sábado',
]

export const New = () => {
	const [title, setTitle] = useState('');
	const [weekDays, setWeekDays] = useState<number[]>([]);

	const handleToggleWeekDay = (weekDayIndex: number) => {
		if (weekDays.includes(weekDayIndex)) {
			setWeekDays(prev => prev.filter(weekDay => weekDay !== weekDayIndex));
		} else {
			setWeekDays(prev => [...prev, weekDayIndex]);
		}
	}

	const handleCreateNewHabit = async () => {
		try {
			if (!title.trim() || weekDays.length === 0) {
				return Alert.alert('Novo hábito', 'Informe o nome do hábito e escolha a recorrência.')
			}

			await api.post('/habits', { title, weekDays });

			setTitle('');
			setWeekDays([]);

			Alert.alert('Novo hábito', 'Hábito criado com sucesso!');
		} catch (err) {
			console.error(err);
			Alert.alert('Ops...', 'Não foi possível criar o novo hábito.');
		}
	}

	return (
		<View className="flex-1 bg-background px-8 pt-16">
			<ScrollView
				contentContainerStyle={{
					paddingBottom: 100
				}}
			>
				<BackButton />

				<Text className="mt-6 text-white font-extrabold text-3xl">
					Criar hábito
				</Text>

				<Text className="mt-6 text-white font-semibold text-base">
					Qual seu comprometimento?
				</Text>

				<TextInput
					className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-violet-600"
					placeholder="ex. Exercitar, beber água, estudar, etc..."
					placeholderTextColor={colors.zinc[400]}
					cursorColor={colors.white}
					value={title}
					onChangeText={setTitle}
				/>

				<Text className="mt-6 text-white font-semibold text-base">
					Qual a recorrência?
				</Text>

				<View className="mt-3">
					{ availableWeekDays.map((weekDay, i) => (
						<CheckBox
							key={weekDay}
							title={weekDay}
							checked={weekDays.includes(i)}
							onPress={() => handleToggleWeekDay(i)}
						/>
					)) }
				</View>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={handleCreateNewHabit}
					className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
				>
					<Feather
						name="check"
						size={20}
						color={colors.white}
					/>
					<Text className="font-semibold text-base text-white ml-2">
						Confirmar
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}