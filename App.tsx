/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
	Alert,
	Button,
	Dimensions,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	View,
	Image
} from 'react-native';

import {
	Colors,
} from 'react-native/Libraries/NewAppScreen';

import Clipboard from '@react-native-clipboard/clipboard';

const copyImg = require('./path/copy.png');

const screenHeight = Dimensions.get('window').height;

type SectionProps = PropsWithChildren<{
	title: string;
	tips?: string
}>;

interface contentType {
	id: number | string,
	amount: number | string,
	[key: string]: any
}

function Section({ title, tips }: SectionProps): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	return (
		<View>
			<Text
				style={[
					styles.sectionTitle,
					{
						color: isDarkMode ? Colors.white : Colors.black,
					},
				]}>
				{title}
			</Text>
			{tips ? <Text style={styles.sectionDescription}>{tips}</Text> : ''}
		</View>
	);
}

function App(): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	const viewStyle = {
		backgroundColor: isDarkMode ? Colors.black : Colors.white,
		marginTop: 100,
		marginLeft: 16,
		marginRight: 16,
		marginBottom: 30,
		padding: 20,
		borderRadius: 4,
	}

	const [text, setText] = useState('');

	const [content, setContent] = useState<contentType[]>([]);

	const handleReset = () => {
		setText('');
		setContent([]);
	}

	const handleAnalyze = () => {
		if (!text) {
			Alert.alert('请复制内容后解析');
		}

		analyzeContent();
	}

	const analyzeContent = () => {
		const lines = text.split('\n');
		const parsedData = [];

		for (const line of lines) {
			const match = line.match(/(\d+)\D+(\d+)([wk]?)/);

			if (match) {
				const [fullMatch, id, amount, unit] = match;
				let parsedAmount = parseInt(amount, 10);

				if (unit === 'w') {
					parsedAmount *= 10000;
				} else if (unit === 'k') {
					parsedAmount *= 1000;
				}

				parsedData.push({ id, amount: parsedAmount, isIdCopy: false, isAmountCopy: false });
			}
		}

		setContent((parsedData as any))

		// Alert.alert(JSON.stringify(parsedData))
	}

	const copyText = (text: string | number, index: number, type = 'id') => {
		Clipboard.setString(text + '');
		const updatedContent = [...content];
    	if(type == 'id') {
			updatedContent[index].isIdCopy = true;
		}

		if(type == 'amount') {
			updatedContent[index].isAmountCopy = true;
		}

		setContent(updatedContent);
	}

	return (
		<SafeAreaView style={[{ flex: 1 }, backgroundStyle]}>
			<StatusBar
				barStyle={isDarkMode ? 'light-content' : 'dark-content'}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={[{ flex: 1 }, backgroundStyle]}
			>
				<View
					style={viewStyle}
				>
					<Section title="文本内容" />
					<TextInput
						placeholder='将内容复制在此处'
						multiline={true}
						numberOfLines={4}
						onChangeText={(newText) => setText(newText)}
						value={text}
						textAlignVertical="top" // 设置垂直对齐方式为顶部
						style={styles.textInput}
					/>
					<View style={styles.fixToText}>
						<TouchableOpacity
							onPress={handleAnalyze}
							style={styles.analyzeBtn}
							activeOpacity={0.8}
						>
							<Text style={styles.customButton}>解析</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleReset}
							style={[styles.analyzeBtn, styles.resetBtn]}
							activeOpacity={0.8}
						>
							<Text style={[styles.customButton, { color: '#165dff' }]}>重置</Text>
						</TouchableOpacity>
					</View>
				</View>

				<View
					style={[viewStyle, { marginTop: 0, minHeight: 200 }]}
				>
					<Section title="解析内容" tips={content.length > 0 ? '复制之后复制按钮将会消失，请尽快粘贴' : ''} />
					{content.length > 0 && (
						<View style={styles.analyzeContent}>
							<View style={styles.analyzeItem}>
								<View style={[styles.itemContent, { paddingRight: 15 }]}>
									<Text style={[styles.itemText, { fontSize: 18, fontWeight: '700' }]}>客户ID</Text>
								</View>
								<View style={[styles.itemContent, { paddingLeft: 10 }]}>
									<Text style={[styles.itemText, { fontSize: 18, fontWeight: '700' }]}>充值金额</Text>
								</View>
							</View>
							{content.map((data, index) => (
								<View style={styles.analyzeItem} key={index}>
									<View style={[styles.itemContent, { paddingRight: 10 }]}>
										<Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>{data.id}</Text>
										{data.isIdCopy ? '' : 
											<TouchableOpacity onPress={() => copyText(data.id, index, 'id')}>
												<Image source={copyImg} style={styles.copyImage} />
											</TouchableOpacity>
										}
									</View>
									<View style={[styles.itemContent, { paddingLeft: 10 }]}>
										<Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemText}>{data.amount}</Text>
										{data.isAmountCopy ? '' : 
											<TouchableOpacity onPress={() => copyText(data.amount, index, 'amount')}>
												<Image source={copyImg} style={styles.copyImage} />
											</TouchableOpacity>
										}
									</View>
								</View>
							))}
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 12,
		fontWeight: '400',
		color: '#f53f3f'
	},
	textInput: {
		fontSize: 16,
		fontWeight: '400',
		borderWidth: 1,
		borderColor: 'gray',
		padding: 10,
		width: 300,
		height: 150, // 初始高度
		marginTop: 15,
		borderRadius: 4,
	},
	fixToText: {
		flexDirection: 'row',
		marginTop: 20,
	},
	analyzeBtn: {
		width: 85,
		height: 36,
		borderRadius: 4, // 可选：添加圆角
		backgroundColor: '#165dff',
	},
	resetBtn: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#165dff',
		marginLeft: 15,
	},
	customButton: {
		fontSize: 16,
		fontWeight: '400',
		lineHeight: 36, // 保持文本垂直居中
		color: '#fff',
		textAlign: 'center',
		borderRadius: 4,
	},
	analyzeContent: {
		flexDirection: 'column',
		marginTop: 16,
	},
	analyzeItem: {
		flexDirection: 'row', // 横向布局
		alignItems: 'center',
	},
	itemContent: {
		flex: 1,
		flexDirection: 'row', // 横向布局
		alignItems: 'center',
	},
	itemText: {
		flex: 1,
		fontSize: 16,
		fontWeight: '400',
		color: '#1d2129',
		paddingTop: 8,
		paddingBottom: 8,
		textAlign: 'left',
		overflow: 'hidden',
	},
	copyImage: {
		width: 30,
		height: 30,
		marginLeft: 10,
	}
});

export default App;
