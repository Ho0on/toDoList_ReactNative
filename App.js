import react, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, TextInput, Alert, ScrollView } from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-web';

const STORAGE_KEY = '@toDos';

export default function App() {
	const [working, setWorking] = useState(true);
	const [text, setText] = useState('');
	const [toDos, setToDos] = useState({});
	useEffect(() => {
		loadToDos();
	}, []);

	const travel = () => setWorking(false);
	const work = () => setWorking(true);

	const onChangeText = e => setText(e);

	const addToDo = async () => {
		if (text === '') {
			return;
		}
		const newToDos = { ...toDos, [Date.now()]: { text, working } };
		setToDos(newToDos);
		await saveToDos(newToDos);
		setText('');
	};

	const deleteToDo = key => {
		Alert.alert('Delete To Do', 'Are you sure?', [
			{ text: 'Cancel' },
			{
				text: "I'm Sure",
				style: 'destructive',
				onPress: () => {
					const newToDos = { ...toDos };
					delete newToDos[key];
					setToDos(newToDos);
					saveToDos(newToDos);
				},
			},
		]);
	};

	const saveToDos = async toSave => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
		} catch (e) {
			Alert.alert('오류');
		}
	};

	const loadToDos = async () => {
		const s = await AsyncStorage.getItem(STORAGE_KEY);
		setToDos(JSON.parse(s));
	};

	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<View style={styles.header}>
				<TouchableOpacity onPress={work}>
					<Text style={{ ...styles.btnText, color: working ? 'white' : theme.grey }}>Work</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={travel}>
					<Text style={{ ...styles.btnText, color: !working ? 'white' : theme.grey }}>Travel</Text>
				</TouchableOpacity>
			</View>

			<TextInput onSubmitEditing={addToDo} returnKeyType="done" value={text} onChangeText={onChangeText} style={styles.input} placeholder={working ? 'Add a To Do' : 'Where do you want to go?'} />
			<ScrollView>
				{Object.keys(toDos).map(key =>
					toDos[key].working === working ? (
						<View key={key} style={styles.toDo}>
							<Text style={styles.toDoText}>{toDos[key].text}</Text>
							<TouchableOpacity onPress={() => deleteToDo(key)}>
								<Fontisto name="trash" size={18} color="black" />
							</TouchableOpacity>
						</View>
					) : null
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	header: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		marginTop: 100,
	},
	btnText: {
		fontSize: 38,
		fontWeight: '600',
	},
	input: {
		backgroundColor: 'white',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 30,
		marginVertical: 20,
		fontSize: 18,
	},
	toDo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
		backgroundColor: theme.grey,
		borderRadius: 15,
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	toDoText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
	},
});
